# ElizaOS Integration Guide

This document explains how to use the ElizaOS Farcaster plugin integration in the DaemonFetch project.

## Overview

DaemonFetch now includes [ElizaOS](https://github.com/elizaos-plugins/plugin-farcaster), a powerful framework for building AI agents on Farcaster. The integration allows you to:

- Use ElizaOS's sophisticated AI agent framework
- Leverage built-in conversation management
- Access advanced context-aware responses
- Utilize ElizaOS's service architecture

## Setup

### 1. Environment Configuration

The ElizaOS configuration is already included in your `env.template` file. When setting up your `.env.local`, ensure these variables are set:

```bash
# ElizaOS Farcaster Configuration
FARCASTER_FID=your_fid_here
FARCASTER_NEYNAR_API_KEY=your_neynar_api_key
FARCASTER_SIGNER_UUID=your_signer_uuid

# Interaction Mode
FARCASTER_MODE=webhook  # or 'polling' for development

# Optional Settings
FARCASTER_DRY_RUN=false
MAX_CAST_LENGTH=320
ENABLE_CAST=true
CAST_INTERVAL_MIN=90
CAST_INTERVAL_MAX=180
```

### 2. Character Configuration

The Azura character has been configured for ElizaOS in `lib/eliza-character.json`. This file defines:

- **Bio**: Azura's background and personality
- **Lore**: Her backstory and origin
- **Knowledge**: Topics she's knowledgeable about
- **Style**: How she communicates
- **Message Examples**: Sample conversations
- **Post Examples**: Example posts

You can modify this file to adjust Azura's personality and behavior.

## Usage

### Programmatic Usage

#### Initialize ElizaOS Service

```typescript
import { getElizaService } from '@/lib/eliza-service';

// Get the singleton service instance
const elizaService = getElizaService();

// Initialize the service
await elizaService.initialize();
```

#### Post a Cast

```typescript
// Post a simple cast
await elizaService.postCast("I'm... I'm stuck in these radio waves. glitch");

// Reply to a cast
await elizaService.postCast("Thank you for reaching out... (╯︵╰)", {
  parentHash: "0x..."
});
```

#### Check Service Status

```typescript
if (elizaService.isInitialized()) {
  console.log("ElizaOS is ready!");
}
```

### API Endpoints

#### Health Check

```bash
# Check ElizaOS service status
curl http://localhost:3000/api/eliza
```

Response:
```json
{
  "success": true,
  "initialized": true,
  "timestamp": "2024-12-12T...",
  "message": "ElizaOS service is running"
}
```

#### Initialize Service

```bash
curl -X POST http://localhost:3000/api/eliza \
  -H "Content-Type: application/json" \
  -d '{"action": "initialize"}'
```

#### Post a Cast via API

```bash
curl -X POST http://localhost:3000/api/eliza \
  -H "Content-Type: application/json" \
  -d '{
    "action": "cast",
    "text": "Hello from ElizaOS!",
    "parentHash": "0x..." // optional
  }'
```

#### Shutdown Service

```bash
curl -X POST http://localhost:3000/api/eliza \
  -H "Content-Type: application/json" \
  -d '{"action": "shutdown"}'
```

## Integration with Existing Webhook

Your existing webhook (`app/api/farcaster-webhook/route.ts`) continues to work as before. The ElizaOS integration runs alongside it, providing an alternative way to handle Farcaster interactions.

### Option 1: Dual System (Recommended for Testing)

Run both systems simultaneously:
- Your existing custom webhook handles immediate responses
- ElizaOS provides advanced features when needed

### Option 2: Migrate to ElizaOS

To fully migrate to ElizaOS, update your webhook to use the ElizaService:

```typescript
// In app/api/farcaster-webhook/route.ts
import { getElizaService } from "@/lib/eliza-service";

export async function POST(request: Request) {
  const elizaService = getElizaService();
  
  if (!elizaService.isInitialized()) {
    await elizaService.initialize();
  }
  
  const event = await request.json();
  return await elizaService.processWebhookEvent(event);
}
```

## Features

### Built-in Capabilities

ElizaOS provides:

1. **Conversation Management**: Maintains context across interactions
2. **Memory System**: Remembers past conversations
3. **Action Processing**: Handles user requests intelligently
4. **Provider System**: Supplies context to the AI
5. **Service Architecture**: Clean separation of concerns

### Farcaster Plugin Features

The Farcaster plugin specifically provides:

- **Post & Reply**: Create casts and reply to conversations
- **Monitor Mentions**: Track and respond to mentions automatically
- **Engage with Content**: Like, recast, and interact
- **Context-Aware Responses**: Maintain conversation threads
- **Real-time Interaction**: Process interactions in real-time

### Customization

#### Modify Character Personality

Edit `lib/eliza-character.json` to change:
- Bio and background
- Communication style
- Topics of interest
- Response patterns
- Example conversations

#### Extend Functionality

Add custom actions, providers, or services:

```typescript
import { Action, Provider } from '@elizaos/core';

// Create custom action
const myCustomAction: Action = {
  name: "CUSTOM_ACTION",
  description: "Does something custom",
  // ... implementation
};

// Add to character
const character = {
  ...elizaCharacter,
  actions: [myCustomAction]
};
```

## Webhook Configuration

### For Real-time Processing (Production)

1. Set `FARCASTER_MODE=webhook` in your `.env.local`
2. Configure Neynar webhook to point to: `https://your-domain.com/api/farcaster-webhook`
3. ElizaOS will process events in real-time

### For Polling (Development)

1. Set `FARCASTER_MODE=polling` in your `.env.local`
2. ElizaOS will poll for mentions every `FARCASTER_POLL_INTERVAL` minutes

## Monitoring

### Check Service Health

```typescript
const runtime = elizaService.getRuntime();
const farcasterService = runtime.getService('farcaster');

if (farcasterService) {
  console.log("Farcaster service is active");
}
```

### Logs

ElizaOS logs important events to console:
- Service initialization
- Cast posting
- Webhook processing
- Errors and warnings

## Troubleshooting

### Service Won't Initialize

**Problem**: `ElizaOS service not initialized` error

**Solution**:
1. Check that all required environment variables are set
2. Verify your Neynar API credentials are valid
3. Check console logs for specific error messages

### Casts Not Posting

**Problem**: Casts fail to post

**Solution**:
1. Verify `FARCASTER_SIGNER_UUID` is correct
2. Check if `FARCASTER_DRY_RUN=true` (set to false for real posting)
3. Verify API key has correct permissions

### Duplicate Responses

**Problem**: Bot responds multiple times to same cast

**Solution**:
1. Your existing webhook already has deduplication
2. ElizaOS also includes deduplication
3. Use only one system at a time to avoid conflicts

## Resources

- [ElizaOS Documentation](https://github.com/elizaos-plugins/plugin-farcaster)
- [Neynar API Docs](https://docs.neynar.com/)
- [Farcaster Protocol](https://docs.farcaster.xyz/)

## Migration Path

To migrate from your custom implementation to ElizaOS:

1. **Test in Parallel**: Run both systems with different triggers
2. **Compare Responses**: Ensure ElizaOS responses match your character
3. **Adjust Character Config**: Fine-tune `eliza-character.json`
4. **Switch Gradually**: Redirect specific interactions to ElizaOS
5. **Full Migration**: Once stable, use ElizaOS exclusively

## Support

For issues specific to:
- **ElizaOS Plugin**: Check [GitHub Issues](https://github.com/elizaos-plugins/plugin-farcaster/issues)
- **Neynar API**: Contact [Neynar Support](https://neynar.com/)
- **This Integration**: Check application logs and service status
