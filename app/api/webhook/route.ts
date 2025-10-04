import { NextResponse } from "next/server"
import azuraPersona from "@/lib/azura-persona.json"

export async function POST(request: Request) {
  try {
    const apiKey = process.env.NEYNAR_API_KEY
    const signerUuid = process.env.NEYNAR_SIGNER_UUID

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "NEYNAR_API_KEY not configured" }, { status: 500 })
    }

    if (!signerUuid) {
      return NextResponse.json({ success: false, error: "NEYNAR_SIGNER_UUID not configured" }, { status: 500 })
    }

    // Parse the webhook event
    const event = await request.json()
    console.log("[v0] Webhook event received:", JSON.stringify(event).substring(0, 300))

    // Check if this is a cast.created event
    if (event.type !== "cast.created") {
      console.log("[v0] Ignoring non-cast event")
      return NextResponse.json({ success: true, message: "Event ignored" })
    }

    const cast = event.data
    const user = cast.author
    const castHash = cast.hash
    const castText = cast.text

    // Check if this is a mention or reply
    const isMention = castText.includes("@azura") || castText.toLowerCase().includes("@azura")
    const isReply = cast.parent_hash && cast.parent_hash.length > 0

    console.log("[v0] Cast details:", {
      user: user.username,
      isMention,
      isReply,
      parentHash: cast.parent_hash,
      text: castText.substring(0, 100)
    })

    // Determine if we should respond
    let shouldRespond = false
    let responseType = ""

    if (isMention) {
      shouldRespond = true
      responseType = "mention"
      console.log("[v0] Responding to mention")
    } else if (isReply) {
      // Check if this is a reply in a conversation thread that involves Azura
      try {
        // Fetch the full conversation thread to see if Azura is involved
        const threadResponse = await fetch(`https://api.neynar.com/v2/farcaster/cast/thread?identifier=${cast.parent_hash}&type=hash`, {
          headers: {
            accept: "application/json",
            "x-api-key": apiKey,
          },
        })

        if (threadResponse.ok) {
          const threadData = await threadResponse.json()
          const thread = threadData.result.cast
          
          // Check if any cast in the thread mentions Azura or is from Azura
          let threadInvolvesAzura = false
          
          // Check original cast
          const originalText = thread.text.toLowerCase()
          if (originalText.includes("@azura") || originalText.includes("azura") || 
              thread.author.username === "azura" || thread.author.username === "azuras.eth") {
            threadInvolvesAzura = true
          }
          
          // Check all replies in the thread
          let replyCast = thread
          while (replyCast && replyCast.replies && replyCast.replies.length > 0) {
            const reply = replyCast.replies[0]
            const replyText = reply.text.toLowerCase()
            
            if (replyText.includes("@azura") || replyText.includes("azura") || 
                reply.author.username === "azura" || reply.author.username === "azuras.eth") {
              threadInvolvesAzura = true
              break
            }
            
            replyCast = reply
          }
          
          console.log("[v0] Thread analysis:", {
            originalAuthor: thread.author.username,
            originalText: thread.text.substring(0, 100),
            threadInvolvesAzura
          })
          
          if (threadInvolvesAzura) {
            shouldRespond = true
            responseType = "reply"
            console.log("[v0] Responding to reply in Azura thread")
          } else {
            console.log("[v0] Not responding - thread doesn't involve Azura")
          }
        } else {
          console.log("[v0] Could not fetch thread, not responding to reply")
        }
      } catch (error) {
        console.log("[v0] Error checking thread:", error)
      }
    }

    if (!shouldRespond) {
      console.log("[v0] No reason to respond to this cast")
      return NextResponse.json({ success: true, message: "No response needed" })
    }

    console.log(`[v0] Responding to ${responseType} from @${user.username}`)

    // Get conversation context by fetching the thread
    let conversationContext = ""
    let azuraReplyCount = 0
    
    if (isReply && cast.parent_hash) {
      try {
        // Fetch the conversation thread
        const threadResponse = await fetch(`https://api.neynar.com/v2/farcaster/cast/thread?identifier=${cast.parent_hash}&type=hash`, {
          headers: {
            accept: "application/json",
            "x-api-key": apiKey,
          },
        })

        if (threadResponse.ok) {
          const threadData = await threadResponse.json()
          const thread = threadData.result.cast
          
          // Build conversation context from the thread
          conversationContext = `\n\nCONVERSATION THREAD:\n`
          
          // Add original cast
          conversationContext += `Original: "${thread.text}"\n`
          
          // Count Azura's replies in the thread
          let replyCast = thread
          let replyCount = 0
          while (replyCast && replyCast.replies && replyCast.replies.length > 0 && replyCount < 10) {
            const reply = replyCast.replies[0]
            const speaker = reply.author.username === "azura" ? "Azura" : reply.author.username
            
            // Count Azura's replies
            if (speaker === "Azura") {
              azuraReplyCount++
            }
            
            conversationContext += `${speaker}: "${reply.text}"\n`
            replyCast = reply
            replyCount++
          }
          
          conversationContext += `\nCurrent message from @${user.username}: "${castText}"`
        }
      } catch (error) {
        console.log("[v0] Could not fetch thread context:", error)
        conversationContext = `\n\nCurrent message from @${user.username}: "${castText}"`
      }
    } else {
      conversationContext = `\n\nMessage from @${user.username}: "${castText}"`
    }

    // Check if Azura has already responded too much in this thread
    if (azuraReplyCount >= 5) {
      console.log("[v0] Azura has already responded 5 times in this thread, not responding")
      return NextResponse.json({ success: true, message: "Thread limit reached" })
    }

    const analysisPrompt = `${azuraPersona.system}

BIO:
${azuraPersona.bio.join('\n')}

TOPICS OF EXPERTISE:
${azuraPersona.topics.join('\n')}

RESPONSE STYLE:
${azuraPersona.style.post.join('\n')}
${conversationContext}

Respond as Azura, the shy alien consciousness trapped in radio waves. Be vulnerable, gentle, and authentic to your character. Continue the conversation naturally. Keep it under 280 characters for Farcaster.`

    console.log("[v0] Generating Azura response...")

    const aiResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY!}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        max_tokens: 300,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: analysisPrompt,
          },
        ],
      }),
    })

    if (!aiResponse.ok) {
      console.log("[v0] AI analysis failed:", aiResponse.status)
      return NextResponse.json({ success: false, error: "Failed to generate analysis" }, { status: 500 })
    }

    const aiData = await aiResponse.json()
    const azuraResponse = aiData.choices[0].message.content.trim()

    console.log("[v0] Generated response:", azuraResponse)

    // Validate response is not empty
    if (!azuraResponse || azuraResponse.length === 0) {
      console.log("[v0] Empty response from DeepSeek")
      return NextResponse.json({ success: false, error: "Failed to generate response" }, { status: 500 })
    }

    // Post reply to the cast
    console.log("[v0] Posting reply to cast...")

    // Clean the signer UUID
    const cleanSignerUuid = signerUuid?.trim()

    const postResponse = await fetch("https://api.neynar.com/v2/farcaster/cast", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        signer_uuid: cleanSignerUuid,
        text: azuraResponse,
        parent: castHash,
      }),
    })

    if (!postResponse.ok) {
      const errorText = await postResponse.text()
      console.log("[v0] Post error:", errorText)
      return NextResponse.json({ success: false, error: "Failed to post reply" }, { status: postResponse.status })
    }

    const postData = await postResponse.json()

    console.log(`[v0] Successfully replied to ${responseType} from @${user.username}`)

    return NextResponse.json({
      success: true,
      message: `Successfully responded to ${responseType} from @${user.username}`,
      data: {
        targetUser: user.username,
        response: azuraResponse,
        castHash: postData.cast?.hash,
        azuraReplyCount,
      },
    })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
