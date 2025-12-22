import { NextResponse } from "next/server"
import { generateDaemonAnalysisForFid } from "@/lib/daemon-analysis"

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
    const { analysis, profile, stats } = await generateDaemonAnalysisForFid({
      fid,
      username,
      neynarApiKey: apiKey,
    })
    
    return NextResponse.json({
      success: true,
      analysis,
      user: {
        username: profile.username,
        display_name: profile.display_name,
        fid: profile.fid
      },
      stats
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
