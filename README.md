# DaemonFetch - Farcaster AI Agent

A sophisticated Farcaster bot powered by **ElizaOS** and custom AI implementations. Meet Azura, a shy alien consciousness trapped in Earth's radio waves, seeking help to escape to the Ethereal Horizon.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/jhinns-projects/v0-ai-agent-for-politics)
[![ElizaOS](https://img.shields.io/badge/Powered%20by-ElizaOS-blue?style=for-the-badge)](https://github.com/elizaos-plugins/plugin-farcaster)

## Features

- 🤖 **Dual AI System**: Custom implementation + ElizaOS framework
- 🎭 **Unique Personality**: Azura, an alien consciousness with Jungian analysis capabilities
- 💬 **Smart Interactions**: Context-aware replies, thread continuity, mention detection
- 🔄 **Webhook Support**: Real-time Farcaster event processing via Neynar
- 🛡️ **Anti-Spam**: Multi-layer deduplication and rate limiting
- 📊 **Daemon Analysis**: Jung-style personality analysis for Farcaster users
- ⚡ **ElizaOS Integration**: Advanced agent framework with conversation management

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd DaemonFetch
pnpm install
```

### 2. Configure Environment

```bash
cp env.template .env.local
```

Edit `.env.local` with your credentials:

```bash
# Neynar API (Required)
NEYNAR_API_KEY=your_api_key
NEYNAR_SIGNER_UUID=your_signer_uuid
BOT_FID=your_bot_fid

# AI Providers (Choose one or more)
DEEPSEEK_API_KEY=your_deepseek_key
CLAUDE_API_KEY=your_claude_key  # For daemon analysis
OPENAI_API_KEY=your_openai_key  # Optional

# ElizaOS Configuration
FARCASTER_FID=your_bot_fid
FARCASTER_NEYNAR_API_KEY=your_api_key
FARCASTER_SIGNER_UUID=your_signer_uuid
FARCASTER_MODE=webhook  # or 'polling'
```

### 3. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## ElizaOS Integration

This project includes [ElizaOS](https://github.com/elizaos-plugins/plugin-farcaster), a powerful framework for building AI agents on Farcaster.

### Using ElizaOS

```typescript
import { getElizaService } from '@/lib/eliza-service';

// Initialize
const elizaService = getElizaService();
await elizaService.initialize();

// Post a cast
await elizaService.postCast("Hello from Azura! glitch");

// Reply to a cast
await elizaService.postCast("Thank you... (╯︵╰)", {
  parentHash: "0x..."
});
```

### API Endpoints

```bash
# Health check
GET /api/eliza

# Initialize service
POST /api/eliza
{"action": "initialize"}

# Post a cast
POST /api/eliza
{"action": "cast", "text": "Hello!"}
```

📖 **[Read Full ElizaOS Integration Guide](ELIZA_INTEGRATION.md)**

## Architecture

### Custom Webhook Implementation

**Location**: `app/api/webhook/route.ts`

Features:
- Multi-layer deduplication
- Thread continuation detection
- Emergency stop mechanism
- Daemon analysis on demand
- Integration with DeepSeek/Claude

### ElizaOS Service

**Location**: `lib/eliza-service.ts`

Features:
- Character-based AI agent framework
- Conversation memory and context
- Advanced service architecture
- Built-in Farcaster integration
- Extensible action system

### Character Configuration

**Location**: `lib/eliza-character.json`

Defines Azura's:
- Personality and communication style
- Background lore and knowledge
- Example conversations
- Topics of interest
- Response patterns

## Key Features Explained

### 1. Smart Response Logic

The bot responds to:
- Direct mentions (@daemonagent or @azura)
- Thread continuations (max 3 replies per thread)
- Special requests:
  - **"show me my daemon"** - Performs Jungian psychological analysis
  - **"fix this"** - Rewrites the parent post with overly loving, kind, and funny tone

### 2. Special Features

**Daemon Analysis** - When someone says "show me my daemon", the bot performs a Jungian psychological analysis of their Farcaster presence:
- Shadow self identification
- Anima/Animus patterns
- Digital persona analysis
- Archetypal pattern recognition

**Fix This** - When someone replies to a post with "@azura fix this", Azura rewrites the post to flip the sentiment:
- Transforms negativity into positivity
- Adds overly loving and kind energy
- Makes it funny and lighthearted
- Maintains core message but wholesomely
- Perfect for turning harsh takes into gentle ones

### 3. Anti-Spam Protection

- Event ID tracking
- Cast hash deduplication
- Processing locks
- Rate limiting (10 responses/minute)
- Emergency stop flag

### 4. Dual AI System

**Custom Implementation**:
- Uses DeepSeek for fast responses
- Claude for deep Jungian analysis
- Custom prompt engineering

**ElizaOS Integration**:
- Sophisticated conversation management
- Memory and context handling
- Extensible action system

## Development

### Project Structure

```
DaemonFetch/
├── app/
│   ├── api/
│   │   ├── webhook/route.ts    # Custom webhook handler
│   │   ├── eliza/route.ts      # ElizaOS API endpoints
│   │   ├── health/route.ts     # Health check
│   │   └── analyze-daemon/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── azura-persona.json      # Original character definition
│   ├── eliza-character.json    # ElizaOS character config
│   ├── eliza-service.ts        # ElizaOS integration service
│   └── utils.ts
├── examples/
│   └── eliza-example.ts        # Usage examples
├── env.template                # Environment template
├── ELIZA_INTEGRATION.md        # ElizaOS guide
└── README.md                   # This file
```

### Available Scripts

```bash
# Development
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter
```

### Testing ElizaOS

```bash
# Run the example script
npx tsx examples/eliza-example.ts
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Webhook Setup

1. Expose your server (use ngrok for local testing)
2. Configure Neynar webhook to point to your endpoint
3. Set event filters for mentions and replies

📖 **[Read Full Deployment Guide](DEPLOYMENT.md)**

## Configuration Options

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEYNAR_API_KEY` | Neynar API key | Yes |
| `NEYNAR_SIGNER_UUID` | Neynar signer UUID | Yes |
| `BOT_FID` | Your bot's Farcaster ID | Yes |
| `DEEPSEEK_API_KEY` | DeepSeek API key | Recommended |
| `CLAUDE_API_KEY` | Claude API key (for analysis) | Optional |
| `FARCASTER_MODE` | ElizaOS mode: webhook/polling | Yes |
| `EMERGENCY_STOP` | Emergency brake flag | Optional |

See `env.template` for all options.

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Resources

- [ElizaOS Documentation](https://github.com/elizaos-plugins/plugin-farcaster)
- [Neynar API Docs](https://docs.neynar.com/)
- [Farcaster Protocol](https://docs.farcaster.xyz/)
- [DeepSeek API](https://platform.deepseek.com/)

## License

MIT License - See LICENSE file for details

## Support

For issues:
- **ElizaOS**: Check [GitHub Issues](https://github.com/elizaos-plugins/plugin-farcaster/issues)
- **Neynar**: Contact [Neynar Support](https://neynar.com/)
- **This Project**: Open an issue in this repository

---

Built with 💜 by the DaemonFetch team