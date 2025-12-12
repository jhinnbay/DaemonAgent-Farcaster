# ElizaOS Integration Checklist

Use this checklist to get ElizaOS up and running in your DaemonFetch project.

## ✅ Installation Checklist

### Step 1: Dependencies
- [ ] Run `pnpm install`
- [ ] Verify `@elizaos/plugin-farcaster` is installed
- [ ] Verify `@elizaos/core` is installed

### Step 2: Environment Configuration
- [ ] Copy `env.template` to `.env.local`
- [ ] Add `NEYNAR_API_KEY`
- [ ] Add `NEYNAR_SIGNER_UUID`
- [ ] Add `BOT_FID`
- [ ] Set `FARCASTER_FID` (same as BOT_FID)
- [ ] Set `FARCASTER_NEYNAR_API_KEY` (same as NEYNAR_API_KEY)
- [ ] Set `FARCASTER_SIGNER_UUID` (same as NEYNAR_SIGNER_UUID)
- [ ] Set `FARCASTER_MODE` to `webhook` or `polling`
- [ ] (Optional) Add `OPENAI_API_KEY` for AI features
- [ ] (Optional) Add `DEEPSEEK_API_KEY` for custom bot
- [ ] (Optional) Add `CLAUDE_API_KEY` for daemon analysis

### Step 3: Test Local Setup
- [ ] Run `pnpm dev`
- [ ] Server starts without errors
- [ ] Visit `http://localhost:3000`
- [ ] Check `http://localhost:3000/api/eliza` returns status

### Step 4: Test ElizaOS Service
- [ ] Run `pnpm run eliza:status` (should show not initialized)
- [ ] Run `pnpm run eliza:init` (should initialize successfully)
- [ ] Run `pnpm run eliza:status` (should show initialized)
- [ ] Run `pnpm run eliza:example` (should execute without errors)

### Step 5: Test API Endpoints
- [ ] GET `/api/eliza` returns health status
- [ ] POST `/api/eliza` with `{"action": "initialize"}` works
- [ ] POST `/api/eliza` with `{"action": "cast", "text": "test"}` works (if not in dry run)
- [ ] Check your Farcaster account for the test cast

## 🔧 Configuration Checklist

### Character Configuration
- [ ] Review `lib/eliza-character.json`
- [ ] Customize `bio` if needed
- [ ] Adjust `style` rules if needed
- [ ] Add/modify `postExamples`
- [ ] Verify personality matches your needs

### Webhook Configuration (if using webhook mode)
- [ ] Install ngrok: `npm install -g ngrok`
- [ ] Run `ngrok http 3000`
- [ ] Copy ngrok URL
- [ ] Go to Neynar webhook dashboard
- [ ] Create new webhook
- [ ] Set target URL: `https://your-ngrok-url/farcaster/webhook`
- [ ] Select event types: `cast.created`
- [ ] Set filters: mentioned users and parent cast authors
- [ ] Save webhook
- [ ] Test by mentioning your bot on Farcaster

### Custom Bot Configuration (optional)
- [ ] Review `lib/azura-persona.json`
- [ ] Verify custom webhook logic in `app/api/webhook/route.ts`
- [ ] Test daemon analysis: mention bot with "show me my daemon"

## 📚 Documentation Review

- [ ] Read [QUICK_START.md](QUICK_START.md)
- [ ] Read [ELIZA_INTEGRATION.md](ELIZA_INTEGRATION.md)
- [ ] Review [ELIZA_SETUP_SUMMARY.md](ELIZA_SETUP_SUMMARY.md)
- [ ] Check `.cursorrules` for development guidelines
- [ ] Review `examples/eliza-example.ts` for usage patterns

## 🚀 Production Deployment Checklist

### Pre-Deployment
- [ ] Set all environment variables in production
- [ ] Test build: `pnpm build`
- [ ] Build succeeds without errors
- [ ] Test production mode locally: `pnpm start`
- [ ] Verify ElizaOS initializes in production mode

### Deployment Platform (Vercel)
- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Add all environment variables in Vercel dashboard
- [ ] Deploy to Vercel
- [ ] Verify deployment succeeds
- [ ] Check production URL works
- [ ] Test API endpoints on production

### Webhook Setup (Production)
- [ ] Update Neynar webhook URL to production URL
- [ ] Format: `https://your-domain.com/farcaster/webhook`
- [ ] Test webhook by mentioning bot
- [ ] Verify bot responds in production
- [ ] Monitor logs for errors

### Post-Deployment
- [ ] Test ElizaOS initialization on production
- [ ] Test posting casts from production
- [ ] Monitor webhook event processing
- [ ] Check error logs
- [ ] Verify rate limiting works
- [ ] Test emergency stop flag if needed

## 🐛 Troubleshooting Checklist

### Service Won't Initialize
- [ ] Check environment variables are set
- [ ] Verify API credentials are valid
- [ ] Check console logs for error messages
- [ ] Ensure `FARCASTER_FID` is a number
- [ ] Verify `FARCASTER_SIGNER_UUID` format is correct

### Casts Not Posting
- [ ] Verify `FARCASTER_DRY_RUN=false`
- [ ] Check `FARCASTER_SIGNER_UUID` is correct
- [ ] Ensure API key has posting permissions
- [ ] Verify FID matches the signer
- [ ] Check Neynar API status
- [ ] Review API error messages in logs

### Webhook Not Working
- [ ] Verify ngrok is running (local) or URL is correct (prod)
- [ ] Check Neynar webhook configuration
- [ ] Verify webhook filters include your bot
- [ ] Check event types are correct (`cast.created`)
- [ ] Review server logs for incoming requests
- [ ] Test webhook with Neynar's test feature

### Build Errors
- [ ] Run `pnpm install` to ensure dependencies are correct
- [ ] Check TypeScript errors: `npx tsc --noEmit`
- [ ] Verify all imports are correct
- [ ] Check for missing dependencies
- [ ] Review error messages in build output

### Runtime Errors
- [ ] Check browser console for errors
- [ ] Review server logs
- [ ] Verify API endpoints return expected responses
- [ ] Check network tab in browser devtools
- [ ] Test with different browsers
- [ ] Clear browser cache and restart dev server

## 🔄 Migration Checklist (From Custom to ElizaOS)

### Phase 1: Dual System Testing
- [ ] Run both systems in parallel
- [ ] Compare response quality
- [ ] Test ElizaOS with real interactions
- [ ] Verify character personality matches
- [ ] Document any differences

### Phase 2: Character Adjustment
- [ ] Fine-tune `lib/eliza-character.json`
- [ ] Test adjusted responses
- [ ] Compare with original persona
- [ ] Iterate until responses match
- [ ] Get user feedback

### Phase 3: Gradual Migration
- [ ] Route specific interactions to ElizaOS
- [ ] Monitor performance and errors
- [ ] Gradually increase ElizaOS usage
- [ ] Keep custom webhook as backup
- [ ] Monitor for issues

### Phase 4: Full Migration
- [ ] Route all interactions to ElizaOS
- [ ] Monitor for 24-48 hours
- [ ] Verify all features work
- [ ] Address any issues
- [ ] Remove/disable custom implementation
- [ ] Update documentation

## 📊 Monitoring Checklist

### What to Monitor
- [ ] ElizaOS service health
- [ ] Cast posting success rate
- [ ] Webhook event processing
- [ ] Response times
- [ ] Error rates
- [ ] Rate limiting triggers
- [ ] Emergency stop activations

### Monitoring Tools
- [ ] Check `/api/eliza` health endpoint regularly
- [ ] Set up logging aggregation (optional)
- [ ] Monitor Vercel logs (if deployed)
- [ ] Watch Neynar webhook dashboard
- [ ] Track bot mentions and responses
- [ ] Monitor API usage/quotas

## 🎯 Success Criteria

Your ElizaOS integration is successful when:

- [ ] ✅ Service initializes without errors
- [ ] ✅ Bot can post casts successfully
- [ ] ✅ Bot responds to mentions
- [ ] ✅ Bot maintains character personality
- [ ] ✅ Webhook events are processed correctly
- [ ] ✅ No duplicate responses
- [ ] ✅ Rate limiting works properly
- [ ] ✅ All tests pass
- [ ] ✅ Production deployment is stable
- [ ] ✅ Documentation is complete

## 📝 Notes

### Useful Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                 # Build for production
pnpm start                 # Start production server

# ElizaOS
pnpm run eliza:status      # Check service status
pnpm run eliza:init        # Initialize service
pnpm run eliza:example     # Run example script

# Testing
curl http://localhost:3000/api/eliza
curl -X POST http://localhost:3000/api/eliza -d '{"action":"initialize"}'
```

### Environment Variable Summary

**Required:**
- `NEYNAR_API_KEY`
- `NEYNAR_SIGNER_UUID`
- `BOT_FID`
- `FARCASTER_FID`
- `FARCASTER_NEYNAR_API_KEY`
- `FARCASTER_SIGNER_UUID`
- `FARCASTER_MODE`

**Optional:**
- `OPENAI_API_KEY`
- `DEEPSEEK_API_KEY`
- `CLAUDE_API_KEY`
- `FARCASTER_DRY_RUN`
- `EMERGENCY_STOP`

### Support Resources

- [Quick Start Guide](QUICK_START.md)
- [Integration Guide](ELIZA_INTEGRATION.md)
- [Setup Summary](ELIZA_SETUP_SUMMARY.md)
- [ElizaOS GitHub](https://github.com/elizaos-plugins/plugin-farcaster)
- [Neynar Docs](https://docs.neynar.com/)

---

**Last Updated**: December 12, 2024

**Version**: 1.0.0
