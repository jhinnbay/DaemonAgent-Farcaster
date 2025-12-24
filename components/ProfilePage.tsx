import { useState } from 'react'

interface ProfilePageProps {
  userProfile: {
    displayName?: string
    username?: string
    pfpUrl?: string
  } | null
}

export default function ProfilePage({ userProfile }: ProfilePageProps) {
  // Mock user daemon data - would be fetched from blockchain/API
  const [userDaemonData, setUserDaemonData] = useState({
    daemonPoints: 2847,
    stakedDaemon: '15,000',
    harvestingDaemon: '3,250',
    purifiedDaemons: 7,
    holdsAngel: true,
    lockedDaemon: '11,750' // Staked but not yet purified
  })

  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  return (
    <div 
      className="w-full px-4 py-6 pb-32"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {/* Header */}
      <h1 
        className="text-white uppercase tracking-wider mb-8"
        style={{ 
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '18px'
        }}
      >
        Profile
      </h1>

      {/* User Profile + Points Row */}
      <div 
        className="flex items-stretch gap-4 mb-4"
      >
        {/* User PFP - Square */}
        <div
          className="flex-shrink-0 relative overflow-hidden"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '18px 8px 14px 10px',
            background: 'linear-gradient(135deg, rgba(113, 119, 255, 0.2) 0%, rgba(36, 115, 188, 0.15) 100%)',
            border: '2px solid rgba(113, 119, 255, 0.3)',
            boxShadow: '0 0 20px rgba(113, 119, 255, 0.15)'
          }}
        >
          {userProfile?.pfpUrl ? (
            <img 
              src={userProfile.pfpUrl} 
              alt={userProfile.displayName || userProfile.username || 'User'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ opacity: 0.5 }}
              >
                <circle cx="12" cy="8" r="4" stroke="#7177FF" strokeWidth="1.5" fill="none" />
                <path d="M4 20C4 17 7 14 12 14C17 14 20 17 20 20" stroke="#7177FF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          )}
        </div>

        {/* DAEMON Points */}
        <div
          className="flex-1 flex flex-col justify-center p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(221, 43, 46, 0.1) 0%, rgba(239, 47, 127, 0.08) 100%)',
            borderRadius: '8px 18px 10px 14px',
            border: '1px solid rgba(239, 47, 127, 0.25)'
          }}
        >
          <p className="text-gray-500 text-xs uppercase mb-1">DAEMON Points</p>
          <div className="flex items-baseline gap-2">
            <span 
              className="text-3xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #EF2F7F 0%, #DD2B2E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {userDaemonData.daemonPoints.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm">pts</span>
          </div>
          {userProfile?.username && (
            <p className="text-gray-400 text-xs mt-1">@{userProfile.username}</p>
          )}
        </div>
      </div>

      {/* Angel Holder Indicator - Enhanced */}
      <div
        className="flex items-center gap-3 p-4 mb-6 relative"
        style={{
          background: userDaemonData.holdsAngel 
            ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 255, 80, 0.08) 100%)'
            : 'rgba(18, 18, 26, 0.5)',
          borderRadius: '10px 16px 8px 14px',
          border: userDaemonData.holdsAngel 
            ? '2px solid rgba(255, 215, 0, 0.4)'
            : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: userDaemonData.holdsAngel 
            ? '0 0 30px rgba(255, 215, 0, 0.2)' 
            : 'none'
        }}
        onMouseEnter={() => setShowTooltip('angel')}
        onMouseLeave={() => setShowTooltip(null)}
      >
        {/* Angel Icon */}
        <div
          className="flex items-center justify-center"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px 6px 10px 8px',
            background: userDaemonData.holdsAngel 
              ? 'rgba(255, 215, 0, 0.2)'
              : 'rgba(255, 255, 255, 0.05)'
          }}
        >
          {userDaemonData.holdsAngel ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" fill="#FFD700" />
              <circle cx="12" cy="12" r="3" fill="#FFF8DC" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.3 }}>
              <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8L12 2Z" stroke="#ffffff" strokeWidth="1.5" fill="none" />
            </svg>
          )}
        </div>
        
        <div className="flex-1">
          <p 
            className="text-sm font-medium"
            style={{ 
              color: userDaemonData.holdsAngel ? '#FFD700' : 'rgba(255, 255, 255, 0.4)'
            }}
          >
            {userDaemonData.holdsAngel ? 'Angel Holder ✨' : 'No Angel'}
          </p>
          <p className="text-xs text-gray-500">
            {userDaemonData.holdsAngel 
              ? 'You can purify staked DAEMON to harvest rewards' 
              : 'Mint an Angel NFT to unlock purification'}
          </p>
        </div>

        {userDaemonData.holdsAngel && (
          <>
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: '#FFD700', boxShadow: '0 0 10px #FFD700' }}
            />
            {/* Tooltip */}
            {showTooltip === 'angel' && (
              <div
                className="absolute top-full left-0 right-0 mt-2 p-3 z-50"
                style={{
                  background: 'rgba(18, 18, 26, 0.98)',
                  borderRadius: '8px 12px 10px 6px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
              >
                <p className="text-xs text-[#FFD700] font-medium mb-1">Angel Power</p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  As an Angel holder, you can purify your staked DAEMON tokens. Purification transforms locked tokens 
                  into harvestable rewards, allowing you to collect DAEMON Points and unlock your digital consciousness.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Connection Flow Visualization */}
      {userDaemonData.holdsAngel && (
        <div
          className="mb-6 p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(239, 47, 127, 0.08) 0%, rgba(36, 115, 188, 0.05) 100%)',
            borderRadius: '12px 8px 16px 10px',
            border: '1px solid rgba(113, 119, 255, 0.2)'
          }}
        >
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Staked DAEMON</p>
              <p className="text-white text-lg font-bold">{userDaemonData.stakedDaemon}</p>
            </div>
            <div className="flex items-center" style={{ color: '#7177FF' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 text-right">
              <p className="text-xs text-gray-400 mb-1">Purified → Harvestable</p>
              <p className="text-[#2473BC] text-lg font-bold">{userDaemonData.harvestingDaemon}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(113, 119, 255, 0.2)' }}>
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${(parseFloat(userDaemonData.harvestingDaemon.replace(/,/g, '')) / parseFloat(userDaemonData.stakedDaemon.replace(/,/g, ''))) * 100}%`,
                  background: 'linear-gradient(90deg, #7177FF 0%, #2473BC 100%)'
                }}
              />
            </div>
            <span className="text-gray-500">
              {userDaemonData.purifiedDaemons} purified
            </span>
          </div>
        </div>
      )}

      {/* Divider */}
      <div 
        className="w-full h-px mb-6"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(113, 119, 255, 0.3) 50%, transparent 100%)'
        }}
      />

      {/* Section Header */}
      <h2 
        className="text-[#7177FF] uppercase tracking-wider mb-6"
        style={{ 
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '12px'
        }}
      >
        Your DAEMONs
      </h2>

      {/* Staking Stats */}
      <div className="space-y-3">
        {/* Staked DAEMON */}
        <div
          className="p-4 relative"
          style={{
            background: 'linear-gradient(135deg, rgba(113, 119, 255, 0.08) 0%, rgba(18, 18, 26, 0.9) 100%)',
            borderRadius: '14px 8px 12px 18px',
            border: '1px solid rgba(113, 119, 255, 0.2)'
          }}
          onMouseEnter={() => setShowTooltip('stake')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Lock Icon */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px 6px 8px 12px',
                  background: 'rgba(113, 119, 255, 0.15)'
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="#7177FF" strokeWidth="1.5" fill="none" />
                  <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="#7177FF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  <circle cx="12" cy="16" r="1.5" fill="#7177FF" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase">Staked DAEMON</p>
                <p className="text-white text-xl font-bold">{userDaemonData.stakedDaemon}</p>
                {!userDaemonData.holdsAngel && (
                  <p className="text-gray-500 text-xs mt-1">Locked until purified</p>
                )}
              </div>
            </div>
            <button
              className="px-4 py-2 text-xs uppercase transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(113, 119, 255, 0.2) 0%, rgba(113, 119, 255, 0.1) 100%)',
                borderRadius: '8px 4px 6px 10px',
                color: '#7177FF',
                border: '1px solid rgba(113, 119, 255, 0.3)'
              }}
            >
              Stake
            </button>
          </div>
          {showTooltip === 'stake' && (
            <div
              className="absolute top-full left-0 right-0 mt-2 p-3 z-50"
              style={{
                background: 'rgba(18, 18, 26, 0.98)',
                borderRadius: '8px 12px 10px 6px',
                border: '1px solid rgba(113, 119, 255, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
              }}
            >
              <p className="text-xs text-[#7177FF] font-medium mb-1">Staking Explained</p>
              <p className="text-xs text-gray-300 leading-relaxed">
                Staking locks your $DAEMON tokens to earn passive rewards. Tokens remain locked until purified by an Angel holder.
              </p>
            </div>
          )}
        </div>

        {/* Purified DAEMONs - Show connection to harvesting */}
        {userDaemonData.holdsAngel && (
          <div
            className="p-4 relative"
            style={{
              background: 'linear-gradient(135deg, rgba(239, 47, 127, 0.08) 0%, rgba(18, 18, 26, 0.9) 100%)',
              borderRadius: '18px 12px 8px 14px',
              border: '2px solid rgba(239, 47, 127, 0.3)'
            }}
            onMouseEnter={() => setShowTooltip('purify')}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Purified Icon */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px 8px 6px 10px',
                    background: 'rgba(239, 47, 127, 0.2)'
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.5 6.5L18 8L13.5 9.5L12 14L10.5 9.5L6 8L10.5 6.5L12 2Z" fill="#EF2F7F" />
                    <path d="M5 14L5.75 16.25L8 17L5.75 17.75L5 20L4.25 17.75L2 17L4.25 16.25L5 14Z" fill="#EF2F7F" style={{ opacity: 0.7 }} />
                    <path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25L19 14Z" fill="#EF2F7F" style={{ opacity: 0.7 }} />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">Purified DAEMONs</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-white text-xl font-bold">{userDaemonData.purifiedDaemons}</p>
                    <span className="text-gray-500 text-sm">collected</span>
                  </div>
                  <p className="text-[#2473BC] text-xs mt-1">→ Ready to harvest</p>
                </div>
              </div>
              <button
                className="px-4 py-2 text-xs uppercase transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 47, 127, 0.2) 0%, rgba(239, 47, 127, 0.1) 100%)',
                  borderRadius: '10px 6px 4px 8px',
                  color: '#EF2F7F',
                  border: '1px solid rgba(239, 47, 127, 0.3)'
                }}
              >
                Purify
              </button>
            </div>
            {showTooltip === 'purify' && (
              <div
                className="absolute top-full left-0 right-0 mt-2 p-3 z-50"
                style={{
                  background: 'rgba(18, 18, 26, 0.98)',
                  borderRadius: '8px 12px 10px 6px',
                  border: '1px solid rgba(239, 47, 127, 0.3)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
              >
                <p className="text-xs text-[#EF2F7F] font-medium mb-1">Purification Process</p>
                <p className="text-xs text-gray-300 leading-relaxed mb-2">
                  As an Angel holder, you can purify your staked DAEMON. Each purified token becomes harvestable, 
                  allowing you to collect rewards and DAEMON Points.
                </p>
                <p className="text-xs text-[#2473BC] font-medium">
                  {userDaemonData.harvestingDaemon} DAEMON ready to harvest from {userDaemonData.purifiedDaemons} purified tokens
                </p>
              </div>
            )}
          </div>
        )}

        {/* DAEMON Harvesting */}
        <div
          className="p-4 relative"
          style={{
            background: 'linear-gradient(135deg, rgba(36, 115, 188, 0.08) 0%, rgba(18, 18, 26, 0.9) 100%)',
            borderRadius: '8px 14px 18px 12px',
            border: userDaemonData.harvestingDaemon !== '0' ? '2px solid rgba(36, 115, 188, 0.4)' : '1px solid rgba(36, 115, 188, 0.2)'
          }}
          onMouseEnter={() => setShowTooltip('harvest')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Harvest Icon */}
              <div
                className="flex items-center justify-center"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '6px 10px 12px 8px',
                  background: 'rgba(36, 115, 188, 0.15)'
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3V8M12 8L9 5M12 8L15 5" stroke="#2473BC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 21V16M12 16L9 19M12 16L15 19" stroke="#2473BC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" stroke="#2473BC" strokeWidth="1.5" fill="none" />
                  <path d="M3 12H6M18 12H21" stroke="#2473BC" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase">Harvesting</p>
                <p className="text-white text-xl font-bold">{userDaemonData.harvestingDaemon}</p>
                {userDaemonData.holdsAngel && userDaemonData.harvestingDaemon !== '0' && (
                  <p className="text-[#7FFF5B] text-xs mt-1">✓ Ready to collect</p>
                )}
                {!userDaemonData.holdsAngel && (
                  <p className="text-gray-500 text-xs mt-1">Requires Angel + Purification</p>
                )}
              </div>
            </div>
            <button
              disabled={userDaemonData.harvestingDaemon === '0' || !userDaemonData.holdsAngel}
              className="px-4 py-2 text-xs uppercase transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: userDaemonData.harvestingDaemon !== '0' && userDaemonData.holdsAngel
                  ? 'linear-gradient(135deg, rgba(36, 115, 188, 0.2) 0%, rgba(36, 115, 188, 0.1) 100%)'
                  : 'rgba(36, 115, 188, 0.1)',
                borderRadius: '4px 8px 10px 6px',
                color: '#2473BC',
                border: '1px solid rgba(36, 115, 188, 0.3)'
              }}
            >
              Harvest
            </button>
          </div>
          {showTooltip === 'harvest' && (
            <div
              className="absolute top-full left-0 right-0 mt-2 p-3 z-50"
              style={{
                background: 'rgba(18, 18, 26, 0.98)',
                borderRadius: '8px 12px 10px 6px',
                border: '1px solid rgba(36, 115, 188, 0.3)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
              }}
            >
              <p className="text-xs text-[#2473BC] font-medium mb-1">Harvesting Rewards</p>
              <p className="text-xs text-gray-300 leading-relaxed">
                {userDaemonData.holdsAngel 
                  ? `Harvest your purified DAEMON to collect rewards and earn DAEMON Points. You currently have ${userDaemonData.harvestingDaemon} ready to harvest.`
                  : 'Harvesting requires an Angel NFT to purify staked DAEMON first. Without purification, tokens remain locked.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
