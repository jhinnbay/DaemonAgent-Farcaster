# 🚀 DaemonFetch Local Deployment Guide

## ✅ Server Status
The development server is now running at: **http://localhost:3000**

## 🔧 Setup Instructions

### 1. Environment Configuration
You need to create a `.env.local` file with your API keys:

```bash
# Copy the template
cp env.template .env.local

# Edit with your actual API keys
nano .env.local
```

### 2. Required API Keys

#### Neynar API (Required)
- **NEYNAR_API_KEY**: Get from https://neynar.com/
- **NEYNAR_SIGNER_UUID**: Get from https://neynar.com/

#### Claude API (Required for Jung-style analysis)
- **CLAUDE_API_KEY**: Get from https://console.anthropic.com/

#### OpenAI API (Optional - for other endpoints)
- **OPENAI_API_KEY**: Get from https://platform.openai.com/

### 3. Testing the Application

1. **Open your browser** and go to: http://localhost:3000
2. **Click "Summon Prey"** to fetch users from the /politics channel
3. **Click "Cast Daemon"** to analyze the selected user's psychological patterns
4. **Check the console** for detailed logs of the process

### 4. API Endpoints Available

- **GET** `/` - Main application interface
- **POST** `/api/summon-prey` - Fetches random user from politics channel
- **POST** `/api/cast-daemon` - Analyzes user and posts Jungian response
- **POST** `/api/webhook` - Handles Farcaster webhook events
- **POST** `/api/search-casts` - Search for political casts
- **POST** `/api/analyze-user` - Analyze specific user
- **POST** `/api/generate-response` - Generate introspective response
- **POST** `/api/post-reply` - Post reply to cast

### 5. Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

### 6. Troubleshooting

#### Common Issues:

1. **"NEYNAR_API_KEY not configured"**
   - Make sure your `.env.local` file exists and has the correct API key

2. **"Failed to fetch channel feed"**
   - Check your Neynar API key is valid and has proper permissions

3. **"Failed to generate analysis"**
   - Verify your Claude API key is correct and has credits

4. **Port already in use**
   - Kill the process: `lsof -ti:3000 | xargs kill -9`
   - Or use a different port: `pnpm dev -- -p 3001`

### 7. Testing Without API Keys

If you don't have API keys yet, you can still:
- View the UI at http://localhost:3000
- See the application structure
- Test the frontend components

The API calls will fail gracefully with error messages.

### 8. Next Steps

1. **Get API Keys**: Sign up for Neynar and Claude APIs
2. **Configure Environment**: Add your keys to `.env.local`
3. **Test the Flow**: Try the complete summon → analyze → post cycle
4. **Deploy**: When ready, deploy to Vercel or your preferred platform

## 🎯 Current Status
- ✅ Dependencies installed
- ✅ Development server running
- ✅ Application accessible at http://localhost:3000
- ⏳ Waiting for API key configuration
