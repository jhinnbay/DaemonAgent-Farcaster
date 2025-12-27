import { NextResponse } from "next/server"
import { generateDaemonAnalysisForFid } from "@/lib/daemon-analysis"

export async function POST(request: Request) {
  try {
    const apiKey = process.env.NEYNAR_API_KEY || process.env.FARCASTER_NEYNAR_API_KEY
    const deepseekKey = process.env.DEEPSEEK_API_KEY
    
    console.log("[ANALYZE-DAEMON] Environment check:", {
      hasNeynarKey: !!apiKey,
      hasDeepseekKey: !!deepseekKey
    })
    
    if (!apiKey) {
      console.error("[ANALYZE-DAEMON] Missing NEYNAR_API_KEY")
      return NextResponse.json({ error: "Missing NEYNAR_API_KEY" }, { status: 500 })
    }
    
    if (!deepseekKey) {
      console.error("[ANALYZE-DAEMON] Missing DEEPSEEK_API_KEY")
      return NextResponse.json({ error: "Missing DEEPSEEK_API_KEY" }, { status: 500 })
    }
    
    const body = await request.json().catch(() => ({}))
    const { fid, username } = body
    
    console.log("[ANALYZE-DAEMON] Request:", { fid, username })
    
    if (!fid) {
      return NextResponse.json({ error: "FID is required" }, { status: 400 })
    }
    
    // Fetch user data
    const { analysis, profile, stats } = await generateDaemonAnalysisForFid({
      fid,
      username,
      neynarApiKey: apiKey,
    })
    
    console.log("[ANALYZE-DAEMON] Success:", { analysisLength: analysis.length, stats })
    
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
    console.error("[ANALYZE-DAEMON] Error:", error)
    console.error("[ANALYZE-DAEMON] Error stack:", error instanceof Error ? error.stack : "No stack")
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error",
        errorType: error instanceof Error ? error.constructor.name : typeof error
      },
      { status: 500 }
    )
  }
}
