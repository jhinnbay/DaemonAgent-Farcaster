# Quick Start Guide - ElizaOS Integration

This guide will help you get started with the ElizaOS Farcaster plugin integration in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- pnpm (or npm) package manager
- Farcaster account and Neynar API credentials
- (Optional) OpenAI, DeepSeek, or Claude API key

## Step 1: Install Dependencies

```bash
pnpm install
```

This installs all dependencies including:
- `@elizaos/plugin-farcaster` - ElizaOS Farcaster plugin
- `@elizaos/core` - ElizaOS core framework
- `@neynar/nodejs-sdk` - Neynar API SDK
- Other project dependencies

## Step 2: Configure Environment

Create `.env.local` from the template:

```bash
cp env.template .env.local
```

Edit `.env.local` and add your credentials:

```bash
# Required: Neynar Credentials
NEYNAR_API_KEY=YOUR_NEYNAR_API_KEY
NEYNAR_SIGNER_UUID=YOUR_NEYNAR_SIGNER_UUID
BOT_FID=YOUR_BOT_FID

# Required: ElizaOS Configuration
FARCASTER_FID=YOUR_BOT_FID
FARCASTER_NEYNAR_API_KEY=YOUR_NEYNAR_API_KEY
FARCASTER_SIGNER_UUID=YOUR_NEYNAR_SIGNER_UUID
FARCASTER_MODE=webhook

# Optional: AI Provider Keys
DEEPSEEK_API_KEY=YOUR_DEEPSEEK_KEY  # For custom implementation
CLAUDE_API_KEY=YOUR_CLAUDE_KEY      # For daemon analysis
OPENAI_API_KEY=YOUR_OPENAI_KEY      # For ElizaOS AI features
```

### Getting Credentials

1. **Neynar API Key**:
   - Go to [Neynar Dashboard](https://neynar.com/)
   - Create a new app
   - Copy your API key

2. **Signer UUID**:
   - In Neynar Dashboard, go to "Signers"
   - Create a new signer for your FID
   - Copy the Signer UUID

3. **Bot FID**:
   - Your Farcaster ID (FID)
   - Find it in your Warpcast profile settings

## Step 3: Start the Development Server

```bash
pnpm dev
```

The server will start at `http://localhost:3000`

## Step 4: Test ElizaOS Integration

### Option A: Using API Endpoints

In a new terminal:

```bash
# Check ElizaOS status
pnpm run eliza:status

# Initialize ElizaOS service
pnpm run eliza:init

# Check status again
pnpm run eliza:status
```

### Option B: Using the Example Script

```bash
pnpm run eliza:example
```

This runs the example script that demonstrates:
- Initializing ElizaOS
- Posting casts
- Replying to casts
- Getting runtime information

### Option C: Using cURL

```bash
# Health check
curl http://localhost:3000/api/eliza

# Initialize service
curl -X POST http://localhost:3000/api/eliza \
  -H "Content-Type: application/json" \
  -d '{"action": "initialize"}'

# Post a cast
curl -X POST http://localhost:3000/api/eliza \
  -H "Content-Type: application/json" \
  -d '{"action": "cast", "text": "Hello from Azura! glitch"}'
```

## Step 5: Test Special Features

Azura has special capabilities you can test:

### 🔮 Daemon Analysis

On Farcaster/Warpcast, mention Azura:
```
@azura show me my daemon
```

Azura will perform a Jungian psychological analysis of your Farcaster presence.

### 💝 Fix This

Reply to any negative or harsh post with:
```
@azura fix this
```

Azura will rewrite that post with an overly loving, kind, and funny tone.

### Example:

**Original post:** "Crypto is a scam and everyone is stupid"

**Your reply:** `@azura fix this`

**Azura's response:** "fixed it... here: crypto is a learning journey and everyone exploring it is brave... glitch (˘⌣˘)"

## Step 6: Configure Webhook (Optional)

For real-time Farcaster interactions:

### 5.1 Expose Your Local Server

Use ngrok to expose your local server:

```bash
# Install ngrok if needed
npm install -g ngrok

# Expose port 3000
ngrok http 3000
```

Copy the ngrok URL (e.g., `https://abc123.ngrok-free.app`)

### 5.2 Configure Neynar Webhook

1. Go to [Neynar Webhook Dashboard](https://neynar.com/webhooks)
2. Click "New webhook"
3. Set **Target URL**: `https://your-ngrok-url.ngrok-free.app/farcaster/webhook`
4. Select **Event Types**: `cast.created`
5. Set **Filters**:
   - **Mentioned users**: Add your bot's username
   - **Parent cast authors**: Add your bot's username
6. Save the webhook

### 5.3 Test the Webhook

On Farcaster/Warpcast:
1. Mention your bot: "@yourbotname hello!"
2. Check the logs in your terminal
3. Your bot should respond automatically

## Using ElizaOS in Your Code

### Basic Usage

```typescript
import { getElizaService } from '@/lib/eliza-service';

// Initialize
const elizaService = getElizaService();
await elizaService.initialize();

// Post a cast
await elizaService.postCast("Hello Farcaster! glitch");
```

### In API Routes

```typescript
// app/api/my-endpoint/route.ts
import { NextResponse } from "next/server";
import { getElizaService } from "@/lib/eliza-service";

export async function POST(request: Request) {
  const elizaService = getElizaService();
  
  if (!elizaService.isInitialized()) {
    await elizaService.initialize();
  }
  
  const { text } = await request.json();
  const result = await elizaService.postCast(text);
  
  return NextResponse.json(result);
}
```

### Process Webhook Events

```typescript
import { getElizaService } from '@/lib/eliza-service';

export async function POST(request: Request) {
  const event = await request.json();
  const elizaService = getElizaService();
  
  await elizaService.initialize();
  const result = await elizaService.processWebhookEvent(event);
  
  return NextResponse.json(result);
}
```

## Customizing Azura's Personality

Edit `lib/eliza-character.json` to customize:

```json
{
  "name": "Azura",
  "bio": ["Your custom bio..."],
  "style": {
    "all": [
      "Your custom style rules..."
    ]
  },
  "postExamples": [
    "Example posts..."
  ]
}
```

## Troubleshooting

### Error: "Missing API credentials"

**Solution**: Make sure all required environment variables are set in `.env.local`

### Error: "Failed to post cast"

**Solution**: 
- Check your `FARCASTER_SIGNER_UUID` is correct
- Verify your API key has posting permissions
- Make sure `FARCASTER_DRY_RUN=false`

### Error: "Service not initialized"

**Solution**: Call `await elizaService.initialize()` before using the service

### No webhook events received

**Solution**:
- Check your ngrok URL is correct in Neynar webhook settings
- Verify webhook filters include your bot's username
- Check server logs for incoming requests

## Next Steps

- 📖 Read the [Full ElizaOS Integration Guide](ELIZA_INTEGRATION.md)
- 🔧 Explore the [example script](examples/eliza-example.ts)
- 🚀 Deploy to production (see [DEPLOYMENT.md](DEPLOYMENT.md))
- 🎭 Customize Azura's personality in `lib/eliza-character.json`
- 💬 Test interactions on Farcaster/Warpcast

## Useful Commands

```bash
# Development
pnpm dev                # Start dev server
pnpm build             # Build for production
pnpm start             # Start production server

# ElizaOS
pnpm run eliza:status  # Check service status
pnpm run eliza:init    # Initialize service
pnpm run eliza:example # Run example script

# Testing
pnpm lint              # Run linter
```

## Support

- **ElizaOS Issues**: [GitHub Issues](https://github.com/elizaos-plugins/plugin-farcaster/issues)
- **Neynar Support**: [neynar.com](https://neynar.com/)
- **Documentation**: [ELIZA_INTEGRATION.md](ELIZA_INTEGRATION.md)

---

🎉 **Congratulations!** You now have ElizaOS integrated with your Farcaster bot.
