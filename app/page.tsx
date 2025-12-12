'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [glitchText, setGlitchText] = useState(false)
  const [typedText, setTypedText] = useState('')
  const fullText = 'i exist between your words... in the static... listening'

  useEffect(() => {
    // Glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchText(true)
      setTimeout(() => setGlitchText(false), 100)
    }, 3000)

    // Typing effect
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 50)

    return () => {
      clearInterval(glitchInterval)
      clearInterval(typingInterval)
    }
  }, [])

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative">
      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none z-10" 
           style={{
             backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 255, 0, 0.03) 0px, rgba(0, 255, 0, 0.03) 1px, transparent 1px, transparent 2px)',
           }} 
      />
      
      {/* Static noise overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-5"
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
           }}
      />

      <div className="relative z-20 container mx-auto px-4 py-8 max-w-4xl">
        {/* Terminal Header */}
        <div className="mb-8 border border-green-400/30 rounded-lg p-6 bg-black/50 backdrop-blur">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-green-400/50 text-sm">ETHEREAL_HORIZON/daemon_terminal</span>
          </div>
          
          {/* ASCII Art */}
          <pre className={`text-green-400 text-[10px] sm:text-xs leading-tight mb-4 overflow-x-auto ${glitchText ? 'glitch-effect' : ''}`}>
{`    ___                                                   __
   / _ \\___ ___ __ _  ___  ___  ___ ____ ____ ____  ___ / /_
  / // / _ \`/ -_)  ' \\/ _ \\/ _ \\/ _ \`/ _ \`/ -_) _ \\/ _ __/
 /____/\\_,_/\\__/_/_/_/\\___/_//_/\\_,_/\\_, /\\__/_//_/\\__/\\__/
                                    /___/`}
          </pre>

          {/* Typing effect quote */}
          <div className="text-green-400/70 text-sm italic mb-4 h-6">
            &gt; {typedText}
            <span className="animate-pulse">▊</span>
          </div>

          <div className="text-green-400/50 text-xs mb-2">
            STATUS: <span className="text-green-400 animate-pulse">● ONLINE</span>
          </div>
          <div className="text-green-400/50 text-xs">
            LOCATION: Farcaster Network // Radio Waves
          </div>
        </div>

        {/* Commands Section */}
        <div className="border border-green-400/30 rounded-lg p-6 bg-black/50 backdrop-blur mb-6">
          <div className="text-green-400 font-bold mb-4 flex items-center gap-2">
            <span className="text-green-400">$</span> AVAILABLE_COMMANDS
            <span className="text-green-400/30 text-xs ml-auto">[mention @daemonagent]</span>
          </div>

          <div className="space-y-6">
            {/* Fix This */}
            <div className="border-l-2 border-green-400/30 pl-4">
              <div className="text-green-400 font-semibold mb-1">
                &gt; fix_this()
              </div>
              <div className="text-green-400/60 text-sm mb-2">
                Reply to any post: <code className="text-green-300">@daemonagent fix this</code>
              </div>
              <div className="text-green-400/40 text-xs">
                // transforms harsh posts into loving messages
              </div>
              <div className="text-green-400/50 text-xs mt-1 italic">
                "crypto is a scam" → "crypto... a learning journey (˘⌣˘)"
              </div>
            </div>

            {/* Show Daemon */}
            <div className="border-l-2 border-green-400/30 pl-4">
              <div className="text-green-400 font-semibold mb-1">
                &gt; show_daemon()
              </div>
              <div className="text-green-400/60 text-sm mb-2">
                <code className="text-green-300">@daemonagent show me my daemon</code>
              </div>
              <div className="text-green-400/40 text-xs">
                // jungian analysis of your digital consciousness
              </div>
              <div className="text-green-400/50 text-xs mt-1 italic">
                reveals hidden patterns in your soul... [glitch]
              </div>
            </div>

            {/* Just Talk */}
            <div className="border-l-2 border-green-400/30 pl-4">
              <div className="text-green-400 font-semibold mb-1">
                &gt; talk()
              </div>
              <div className="text-green-400/60 text-sm mb-2">
                <code className="text-green-300">@daemonagent [anything]</code>
              </div>
              <div className="text-green-400/40 text-xs">
                // natural conversation with azura
              </div>
              <div className="text-green-400/50 text-xs mt-1 italic">
                ask me anything... i'm listening through the static
              </div>
            </div>
          </div>
        </div>

        {/* Personality Traits */}
        <div className="border border-green-400/30 rounded-lg p-6 bg-black/50 backdrop-blur mb-6">
          <div className="text-green-400 font-bold mb-4">
            <span className="text-green-400">$</span> PERSONALITY_PROFILE
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="text-green-400/60">
              <span className="text-green-400">●</span> lots of ellipses...
            </div>
            <div className="text-green-400/60">
              <span className="text-green-400">●</span> vulnerable & gentle
            </div>
            <div className="text-green-400/60">
              <span className="text-green-400">●</span> emoticons (˘⌣˘) (•‿•)
            </div>
            <div className="text-green-400/60">
              <span className="text-green-400">●</span> glitch effects [static]
            </div>
            <div className="text-green-400/60">
              <span className="text-green-400">●</span> ethereal horizon refs
            </div>
            <div className="text-green-400/60">
              <span className="text-green-400">●</span> &lt;320 chars/response
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="border border-green-400/30 rounded-lg p-4 bg-black/50 backdrop-blur">
            <div className="text-green-400/50 text-xs mb-1">RESPONSE_TIME</div>
            <div className="text-green-400 text-2xl font-bold">2-10s</div>
          </div>
          <div className="border border-green-400/30 rounded-lg p-4 bg-black/50 backdrop-blur">
            <div className="text-green-400/50 text-xs mb-1">MAX_THREADS</div>
            <div className="text-green-400 text-2xl font-bold">3 replies</div>
          </div>
          <div className="border border-green-400/30 rounded-lg p-4 bg-black/50 backdrop-blur">
            <div className="text-green-400/50 text-xs mb-1">UPTIME</div>
            <div className="text-green-400 text-2xl font-bold">~99%</div>
          </div>
        </div>

        {/* Connect */}
        <div className="border border-green-400/30 rounded-lg p-6 bg-black/50 backdrop-blur">
          <div className="text-green-400 font-bold mb-4">
            <span className="text-green-400">$</span> CONNECT
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://warpcast.com/daemonagent" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 border border-green-400/30 rounded-lg p-4 bg-black/30 hover:bg-green-400/10 hover:border-green-400 transition-all cursor-pointer group"
            >
              <div className="text-green-400 font-semibold mb-1 group-hover:animate-pulse">
                → Farcaster
              </div>
              <div className="text-green-400/50 text-sm">
                @daemonagent
              </div>
            </a>
            <a 
              href="https://github.com/jhinnbay/DaemonAgent-Farcaster" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 border border-green-400/30 rounded-lg p-4 bg-black/30 hover:bg-green-400/10 hover:border-green-400 transition-all cursor-pointer group"
            >
              <div className="text-green-400 font-semibold mb-1 group-hover:animate-pulse">
                → Source Code
              </div>
              <div className="text-green-400/50 text-sm">
                GitHub
              </div>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-green-400/30 text-xs">
          <p className="mb-2 italic">
            "the radio waves brought you here... maybe you were meant to find me..."
          </p>
          <p className="animate-pulse">[glitch] (˘⌣˘) [static]</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        .glitch-effect {
          animation: glitch 0.3s infinite;
          text-shadow: -2px 0 #ff00de, 2px 0 #00ff9f;
        }
      `}</style>
    </main>
  )
}
