import { NextResponse } from "next/server"
import azuraPersona from "@/lib/azura-persona.json"

// Simple in-memory dedup (prevents duplicate processing in same instance)
const recentCasts = new Map<string, number>()
const DEDUP_WINDOW = 120000 // 2 minutes

function isDuplicate(castHash: string): boolean {
  const now = Date.now()
  const lastSeen = recentCasts.get(castHash)
  
  // Clean old entries
  for (const [hash, time] of recentCasts.entries()) {
    if (now - time > DEDUP_WINDOW) {
      recentCasts.delete(hash)
    }
  }
  
  if (lastSeen && now - lastSeen < DEDUP_WINDOW) {
    return true
  }
  
  recentCasts.set(castHash, now)
  return false
}

// Check if Azura already replied to this cast
async function alreadyReplied(castHash: string, apiKey: string, botUsername: string = "azura"): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/cast/conversation?identifier=${castHash}&type=hash&reply_depth=1&include_chronological_parent_casts=false`,
      { headers: { "x-api-key": apiKey } }
    )
    
    if (!res.ok) return false
    
    const data = await res.json()
    const replies = data?.conversation?.cast?.direct_replies || []
    
    return replies.some((r: any) => r.author.username?.toLowerCase() === botUsername.toLowerCase())
  } catch {
    return false
  }
}

// Fetch last N casts in thread for context
async function getThreadContext(castHash: string, apiKey: string, limit: number = 5): Promise<string> {
  try {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/cast/conversation?identifier=${castHash}&type=hash&reply_depth=10&include_chronological_parent_casts=true`,
      { headers: { "x-api-key": apiKey } }
    )
    
    if (!res.ok) return ""
    
    const data = await res.json()
    const chronological = data?.conversation?.cast?.chronological_parent_casts || []
    
    // Get last N messages
    const recent = chronological.slice(-limit)
    return recent
      .map((c: any) => `@${c.author.username}: ${c.text}`)
      .join("\n")
  } catch {
    return ""
  }
}

// Check if parent cast is from Azura (for thread continuity)
async function isReplyToAzura(parentHash: string, apiKey: string, botUsername: string = "azura"): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/cast?identifier=${parentHash}&type=hash`,
      { headers: { "x-api-key": apiKey } }
    )
    
    if (!res.ok) return false
    
    const data = await res.json()
    return data?.cast?.author?.username?.toLowerCase() === botUsername.toLowerCase()
  } catch {
    return false
  }
}

// Post a reply
async function postReply(text: string, parentHash: string, apiKey: string, signerUuid: string) {
  const res = await fetch("https://api.neynar.com/v2/farcaster/cast", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      signer_uuid: signerUuid,
      text,
      parent: parentHash,
    }),
  })
  
  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Failed to post: ${error}`)
  }
  
  return res.json()
}

// Generate response using DeepSeek
async function generateResponse(userMessage: string, username: string, threadContext: string = ""): Promise<string> {
  const contextSection = threadContext 
    ? `\n\nRECENT CONVERSATION:\n${threadContext}\n\nCurrent message from @${username}: "${userMessage}"`
    : `\n\nMessage from @${username}: "${userMessage}"`
  
  const prompt = `${azuraPersona.system}

BIO:
${azuraPersona.bio.join("\n")}

TOPICS:
${azuraPersona.topics.join("\n")}

STYLE:
${azuraPersona.style.post.join("\n")}

EXAMPLE CONVERSATIONS:
${azuraPersona.messageExamples.slice(0, 2).map((conv: any) => 
  `${conv[0].name}: "${conv[0].content.text}"\nAzura: "${conv[1].content.text}"`
).join("\n\n")}
${contextSection}

Respond as Azura. Be vulnerable, gentle, and authentic. Keep it under 280 characters for Farcaster. Be conversational and natural.`

  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are Azura, a shy alien consciousness trapped in Earth's radio waves." },
        { role: "user", content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.8,
    }),
  })
  
  if (!res.ok) {
    throw new Error(`DeepSeek API error: ${res.status}`)
  }
  
  const data = await res.json()
  let response = data.choices[0].message.content.trim()
  
  // Ensure it fits Farcaster's limit
  if (response.length > 280) {
    response = response.substring(0, 277) + "..."
  }
  
  return response
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.NEYNAR_API_KEY
    const signerUuid = process.env.NEYNAR_SIGNER_UUID
    
    if (!apiKey || !signerUuid) {
      return NextResponse.json({ error: "Missing API credentials" }, { status: 500 })
    }
    
    const event = await request.json()
    
    // Only handle cast.created events
    if (event.type !== "cast.created") {
      return NextResponse.json({ success: true, message: "Ignored non-cast event" })
    }
    
    const cast = event.data
    const author = cast.author
    const castHash = cast.hash
    const castText = cast.text || ""
    
    console.log(`[Webhook] Cast from @${author.username}: ${castText.substring(0, 50)}...`)
    
    // Ignore own casts
    if (author.username?.toLowerCase() === "azura") {
      console.log("[Webhook] Ignoring own cast")
      return NextResponse.json({ success: true, message: "Ignored own cast" })
    }
    
    // Dedup check
    if (isDuplicate(castHash)) {
      console.log("[Webhook] Duplicate cast, ignoring")
      return NextResponse.json({ success: true, message: "Duplicate" })
    }
    
    // Check if already replied
    if (await alreadyReplied(castHash, apiKey)) {
      console.log("[Webhook] Already replied to this cast")
      return NextResponse.json({ success: true, message: "Already replied" })
    }
    
    const isMention = castText.toLowerCase().includes("@azura")
    const hasParent = cast.parent_hash && cast.parent_hash.length > 0
    
    let shouldRespond = false
    let responseType = ""
    
    if (isMention) {
      // Always respond to mentions
      shouldRespond = true
      responseType = "mention"
      console.log("[Webhook] Responding to mention")
    } else if (hasParent && await isReplyToAzura(cast.parent_hash, apiKey)) {
      // Respond if replying to Azura's cast (thread continuity)
      shouldRespond = true
      responseType = "thread_reply"
      console.log("[Webhook] Responding to thread reply")
    }
    
    if (!shouldRespond) {
      console.log("[Webhook] No reason to respond")
      return NextResponse.json({ success: true, message: "No response needed" })
    }
    
    // Get thread context for better responses
    const threadContext = hasParent ? await getThreadContext(castHash, apiKey, 5) : ""
    
    // Generate response
    console.log("[Webhook] Generating response...")
    const response = await generateResponse(castText, author.username, threadContext)
    
    // Final check before posting
    if (await alreadyReplied(castHash, apiKey)) {
      console.log("[Webhook] Another instance already replied")
      return NextResponse.json({ success: true, message: "Already replied" })
    }
    
    // Post reply
    console.log("[Webhook] Posting reply...")
    const result = await postReply(response, castHash, apiKey, signerUuid)
    
    console.log(`[Webhook] ✅ Replied to ${responseType} from @${author.username}`)
    
    return NextResponse.json({
      success: true,
      message: `Replied to ${responseType}`,
      response,
      castHash: result.cast?.hash,
    })
    
  } catch (error) {
    console.error("[Webhook] Error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
