import TokenomicsCycle from './TokenomicsCycle'

// DAEMON Token Contract
const DAEMON_CONTRACT = '0x715389db05be6279bb69012242ba8380d2439b07'

export default function TokenPage() {
  return (
    <div 
      className="w-full px-4 py-6 pb-32"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {/* Tokenomics Cycle */}
      <TokenomicsCycle />

      {/* Token Info Section */}
      <h2 
        className="text-[#7177FF] uppercase tracking-wider mb-6 mt-8"
        style={{ 
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '12px'
        }}
      >
        About $DAEMON
      </h2>

      <div
        className="p-5 mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(18, 18, 26, 0.9) 0%, rgba(12, 12, 18, 0.95) 100%)',
          borderRadius: '14px 10px 18px 8px',
          border: '1px solid rgba(113, 119, 255, 0.15)'
        }}
      >
        <p 
          className="text-gray-300 text-sm leading-relaxed mb-4"
        >
          $DAEMON powers the Daemon ecosystem through a gamified tokenomics cycle. Buy tokens, stake them to earn rewards, 
          and if you hold an Angel NFT, you can purify your staked DAEMON to make it harvestable. Harvest to collect DAEMON Points 
          and grow your digital consciousness.
        </p>
        <p 
          className="text-gray-400 text-xs"
        >
          Network: Base • Token Type: ERC-20
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <a
          href={`https://basescan.org/token/${DAEMON_CONTRACT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-4 transition-all hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(36, 115, 188, 0.1) 0%, rgba(18, 18, 26, 0.9) 100%)',
            borderRadius: '10px 6px 12px 14px',
            border: '1px solid rgba(36, 115, 188, 0.2)',
            textDecoration: 'none'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="#2473BC" strokeWidth="1.5" fill="none" />
            <path d="M12 7V12L15 15" stroke="#2473BC" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[#2473BC] text-xs uppercase">Basescan</span>
        </a>

        <a
          href={`https://dexscreener.com/base/${DAEMON_CONTRACT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-4 transition-all hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(127, 255, 91, 0.08) 0%, rgba(18, 18, 26, 0.9) 100%)',
            borderRadius: '6px 14px 10px 12px',
            border: '1px solid rgba(127, 255, 91, 0.2)',
            textDecoration: 'none'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 17L9 11L13 15L21 7" stroke="#7FFF5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 7H21V11" stroke="#7FFF5B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[#7FFF5B] text-xs uppercase">Chart</span>
        </a>
      </div>

      {/* Pattern Image */}
      <div className="w-full mb-8">
        <img 
          src="/pattern2.png" 
          alt="Pattern" 
          className="w-full h-auto"
          style={{
            borderRadius: '12px 8px 16px 10px',
            opacity: 0.8
          }}
        />
      </div>

    </div>
  )
}
