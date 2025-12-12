import { NextResponse } from "next/server"
import { createHmac } from "crypto"
import { getElizaService } from "@/lib/eliza-service"

// WEBHOOK SIGNATURE VERIFICATION
function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false
  
  const hmac = createHmac("sha256", secret)
  hmac.update(payload)
  const expectedSignature = `sha256=${hmac.digest("hex")}`
  
  return signature === expectedSignature
}

// Simple deduplication
const processedEvents = new Set<string>()
const processedCasts = new Map<string, number>()
const processingLocks = new Set<string>()
const DEDUP_WINDOW = 180000 // 3 minutes

function cleanupOldEntries() {
  const now = Date.now()
  for (const [hash, time] of processedCasts.entries()) {
    if (now - time > DEDUP_WINDOW) {
      processedCasts.delete(hash)
    }
  }
}

function markAsProcessed(castHash: string, eventId?: string) {
  if (eventId) processedEvents.add(eventId)
  processedCasts.set(castHash, Date.now())
  processingLocks.delete(castHash)
}

function wasRecentlyProcessed(castHash: string, eventId?: string): boolean {
  cleanupOldEntries()
  if (eventId && processedEvents.has(eventId)) return true
  const lastProcessed = processedCasts.get(castHash)
  return lastProcessed && Date.now() - lastProcessed < DEDUP_WINDOW
}

function isAlreadyProcessing(castHash: string): boolean {
  if (processingLocks.has(castHash)) return true
  processingLocks.add(castHash)
  return false
}

// Check thread depth - limit to 5 messages
async function getThreadDepth(castHash: string, apiKey: string): Promise<number> {
  try {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/cast/conversation?identifier=${castHash}&type=hash&reply_depth=10&include_chronological_parent_casts=true`,
      { 
        headers: { "x-api-key": apiKey },
        signal: AbortSignal.timeout(5000)
      }
    )
    
    if (!res.ok) return 0
    
    const data = await res.json()
    const chronological = data?.conversation?.cast?.chronological_parent_casts || []
    return chronological.length + 1
  } catch {
    return 0
  }
}

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.NEYNAR_WEBHOOK_SECRET
    const apiKey = process.env.NEYNAR_API_KEY || process.env.FARCASTER_NEYNAR_API_KEY
    
    // Get the raw body for signature verification
    const rawBody = await request.text()
    
    // Verify webhook signature if secret is configured
    if (webhookSecret) {
      const signature = request.headers.get("x-neynar-signature")
      
      if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        console.error("[WEBHOOK] Invalid signature")
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
      }
    }
    
    const event = JSON.parse(rawBody)
    const eventId = event.id || event.created_at?.toString()
    
    // Only handle cast.created events
    if (event.type !== "cast.created") {
      return NextResponse.json({ success: true, message: "Ignored non-cast event" })
    }
    
    const cast = event.data
    const author = cast.author
    const castHash = cast.hash
    
    // FAIL-SAFE: Don't respond to own casts
    const authorFid = author.fid
    const botFid = process.env.BOT_FID || process.env.FARCASTER_FID
    const authorUsername = author.username?.toLowerCase() || ""
    
    if (botFid && Number(botFid) === authorFid) {
      return NextResponse.json({ success: true, message: "Own cast" })
    }
    if (authorUsername === "daemonagent" || authorUsername === "azura" || authorUsername === "azuras.eth") {
      return NextResponse.json({ success: true, message: "Own cast" })
    }
    
    // Deduplication
    if (wasRecentlyProcessed(castHash, eventId)) {
      return NextResponse.json({ success: true, message: "Already processed" })
    }
    
    if (isAlreadyProcessing(castHash)) {
      return NextResponse.json({ success: true, message: "Already processing" })
    }
    
    // FAIL-SAFE: Limit thread depth to 5 messages
    if (apiKey) {
      const threadDepth = await getThreadDepth(castHash, apiKey)
      if (threadDepth >= 5) {
        markAsProcessed(castHash, eventId)
        return NextResponse.json({ success: true, message: "Thread limit reached", depth: threadDepth })
      }
    }
    
    // Initialize ElizaOS if not already initialized
    const elizaService = getElizaService()
    if (!elizaService.isInitialized()) {
      try {
        await elizaService.initialize()
      } catch (error) {
        console.error("[WEBHOOK] Failed to initialize ElizaOS:", error)
        return NextResponse.json({ 
          success: false, 
          error: "ElizaOS not available. Check environment variables: FARCASTER_FID, FARCASTER_NEYNAR_API_KEY, FARCASTER_SIGNER_UUID" 
        }, { status: 500 })
      }
    }
    
    // Process event through ElizaOS
    try {
      const result = await elizaService.processWebhookEvent(event)
      markAsProcessed(castHash, eventId)
      return NextResponse.json({ success: true, ...result })
    } catch (error) {
      console.error("[WEBHOOK] ElizaOS processing error:", error)
      markAsProcessed(castHash, eventId)
      return NextResponse.json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }, { status: 500 })
    }
    
  } catch (error) {
    processingLocks.clear()
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
