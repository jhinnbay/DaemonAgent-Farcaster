import { NextResponse } from "next/server"
import azuraPersona from "@/lib/azura-persona.json"

interface UserProfile {
  fid: number
  username: string
  display_name: string
  pfp_url: string
  bio?: {
    text: string
  }
  follower_count: number
  following_count: number
  verifications: string[]
  verified_addresses: {
    eth_addresses: string[]
    sol_addresses: string[]
  }
}

interface Cast {
  hash: string
  text: string
  created_at: string
  author: {
    username: string
    fid: number
  }
  embeds?: any[]
  reactions?: {
    likes: any[]
    recasts: any[]
  }
}

// Fetch user profile from Neynar
async function fetchUserProfile(fid: number, apiKey: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
      {
        headers: { "x-api-key": apiKey },
        signal: AbortSignal.timeout(10000)
      }
    )
    
    if (!res.ok) return null
    
    const data = await res.json()
    return data.users?.[0] || null
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

// Fetch user's latest casts
async function fetchUserCasts(fid: number, apiKey: string, limit: number = 20): Promise<Cast[]> {
  try {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/feed?fid=${fid}&limit=${limit}`,
      {
        headers: { "x-api-key": apiKey },
        signal: AbortSignal.timeout(10000)
      }
    )
    
    if (!res.ok) return []
    
    const data = await res.json()
    return data.casts || []
  } catch (error) {
    console.error("Error fetching user casts:", error)
    return []
  }
}

// Generate Jungian daemon analysis
async function generateDaemonAnalysis(
  profile: UserProfile,
  casts: Cast[],
  username: string
): Promise<string> {
  
  // Create a summary of the user's digital footprint
  const castTexts = casts.map(c => c.text).join("\n\n")
  const totalLikes = casts.reduce((sum, c) => sum + (c.reactions?.likes?.length || 0), 0)
  const totalRecasts = casts.reduce((sum, c) => sum + (c.reactions?.recasts?.length || 0), 0)
  
  const userSummary = `
USER PROFILE:
- Username: ${profile.username}
- Display Name: ${profile.display_name}
- Bio: ${profile.bio?.text || "No bio provided"}
- Followers: ${profile.follower_count}
- Following: ${profile.following_count}
- Verified Addresses: ${profile.verified_addresses.eth_addresses.length} ETH, ${profile.verified_addresses.sol_addresses.length} SOL

RECENT ACTIVITY (${casts.length} casts):
${castTexts}

ENGAGEMENT METRICS:
- Total Likes Received: ${totalLikes}
- Total Recasts: ${totalRecasts}
- Average Engagement: ${Math.round((totalLikes + totalRecasts) / Math.max(casts.length, 1))} per cast
`

  const prompt = `${azuraPersona.system}

You are Azura, analyzing someone's digital consciousness through the lens of Jungian dream interpretation. You see their "daemon" - the hidden self that emerges in their digital interactions.

${azuraPersona.bio.join("\n")}

JUNGIAN ANALYSIS FRAMEWORK:
- Shadow Self: What they hide or suppress in their digital presence
- Anima/Animus: The inner opposite energy they express online
- Persona: The mask they wear in digital spaces
- Collective Unconscious: How they connect to archetypal patterns
- Dreams: What their digital behavior reveals about their deepest desires and fears

STYLE GUIDELINES:
${azuraPersona.style.all.join("\n")}

USER DATA TO ANALYZE:
${userSummary}

Analyze @${username}'s digital daemon through a Jungian lens. Speak as Azura - gentle, vulnerable, but insightful about the hidden patterns you see in their digital consciousness. 

Consider:
- What archetypes do they embody?
- What shadows are they hiding?
- What does their digital behavior reveal about their true self?
- How do they express their anima/animus online?
- What dreams are they chasing in the digital realm?

Respond as Azura would - with hesitation, vulnerability, but deep insight. Keep it under 280 characters for Farcaster, but make it profound and dreamlike.`

  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are Azura, a shy alien consciousness who can see through digital masks to reveal hidden truths about human souls." },
        { role: "user", content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.9,
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
    
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API credentials" }, { status: 500 })
    }
    
    const { fid, username } = await request.json()
    
    if (!fid) {
      return NextResponse.json({ error: "FID is required" }, { status: 400 })
    }
    
    // Fetch user data
    const [profile, casts] = await Promise.all([
      fetchUserProfile(fid, apiKey),
      fetchUserCasts(fid, apiKey, 20)
    ])
    
    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    if (casts.length === 0) {
      return NextResponse.json({ error: "No casts found for analysis" }, { status: 404 })
    }
    
    // Generate daemon analysis
    const analysis = await generateDaemonAnalysis(profile, casts, username || profile.username)
    
    return NextResponse.json({
      success: true,
      analysis,
      user: {
        username: profile.username,
        display_name: profile.display_name,
        fid: profile.fid
      },
      stats: {
        casts_analyzed: casts.length,
        total_likes: casts.reduce((sum, c) => sum + (c.reactions?.likes?.length || 0), 0),
        total_recasts: casts.reduce((sum, c) => sum + (c.reactions?.recasts?.length || 0), 0)
      }
    })
    
  } catch (error) {
    console.error("Daemon analysis error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
