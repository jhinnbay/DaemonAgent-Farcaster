import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ 
    status: "Webhook endpoint is working",
    timestamp: new Date().toISOString(),
    env: {
      hasNeynarKey: !!process.env.NEYNAR_API_KEY,
      hasSignerUuid: !!process.env.NEYNAR_SIGNER_UUID,
      hasDeepSeekKey: !!process.env.DEEPSEEK_API_KEY,
      botFid: process.env.BOT_FID
    }
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({ 
      received: true,
      type: body.type,
      data: body.data ? {
        author: body.data.author?.username,
        text: body.data.text?.substring(0, 50),
        hash: body.data.hash?.substring(0, 10)
      } : null
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}
