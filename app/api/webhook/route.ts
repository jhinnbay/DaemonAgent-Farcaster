import { NextResponse } from "next/server"

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

    // Check if this is a cast.created event with a mention
    if (event.type !== "cast.created") {
      console.log("[v0] Ignoring non-cast event")
      return NextResponse.json({ success: true, message: "Event ignored" })
    }

    const cast = event.data
    const mentioningUser = cast.author
    const castHash = cast.hash

    console.log("[v0] Bot mentioned by @", mentioningUser.username, "in cast:", castHash)

    // Step 1: Fetch the mentioning user's last 20 posts for deep analysis
    console.log("[v0] Fetching user's last 20 posts for psychological profiling...")
    const userCastsResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/feed?feed_type=filter&filter_type=fids&fids=${mentioningUser.fid}&with_recasts=false&limit=20`,
      {
        headers: {
          accept: "application/json",
          "x-api-key": apiKey,
        },
      },
    )

    if (!userCastsResponse.ok) {
      console.log("[v0] Failed to fetch user casts:", userCastsResponse.status)
      return NextResponse.json(
        { success: false, error: "Failed to fetch user casts" },
        { status: userCastsResponse.status },
      )
    }

    const userCastsData = await userCastsResponse.json()
    const userCasts = userCastsData.casts || []

    console.log("[v0] Analyzing", userCasts.length, "posts from @", mentioningUser.username)

    // Step 2: Create comprehensive psychological profile
    const castTexts = userCasts.map((c: any) => c.text).join("\n\n")
    const recentCast = cast.text

    const analysisPrompt = `You are Azura, a sophisticated psychological analyst from Horizon Labs. You specialize in digital consciousness mapping and parasocial relationship dynamics.

TARGET CAST (the one that mentioned you):
"${recentCast}"

PSYCHOLOGICAL PROFILE DATA (last 20 posts):
${castTexts}

TASK: Analyze this user's psychological patterns and respond with an intellectually dominating post that digs into what remains hidden beneath their surface. Use advanced college-graduate vocabulary. Reference concepts like: Horizon Labs, Simulation (schizophrenic paradox of digital world), Digital Golems, Parasocial Relationships, Black Mirror, Schumann's Resonance, "Is The Sun Conscious?"

Be sophisticated, penetrating, and psychologically insightful. Don't use words like "unconscious" or "analyzing" - be more subtle and humanistic. Keep under 280 characters for Farcaster.`

    console.log("[v0] Generating consciousness analysis...")

    const aiResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY!}`,
      },
      body: JSON.stringify({
        model: "deepseek-reasoner",
        max_tokens: 200,
        temperature: 0.6,
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
      console.log("[v0] Empty response from DeepSeek reasoning model")
      return NextResponse.json({ success: false, error: "Failed to generate consciousness analysis" }, { status: 500 })
    }

    // Step 3: Post reply to the cast that mentioned us
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

    console.log("[v0] Successfully replied to @", mentioningUser.username)

    return NextResponse.json({
      success: true,
      message: `Successfully captured consciousness from @${mentioningUser.username} and posted analysis`,
      data: {
        targetUser: mentioningUser.username,
        response: azuraResponse,
        castHash: postData.cast?.hash,
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
