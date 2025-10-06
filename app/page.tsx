export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Azura Daemon Bot</h1>
        <p className="text-gray-300 mb-8">Headless Farcaster bot for daemon analysis</p>
        <div className="bg-slate-800 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-white mb-4">API Endpoints</h2>
          <ul className="text-gray-300 space-y-2">
            <li><code className="bg-slate-700 px-2 py-1 rounded">POST /api/webhook</code> - Farcaster webhook</li>
            <li><code className="bg-slate-700 px-2 py-1 rounded">POST /api/analyze-daemon</code> - Daemon analysis</li>
            <li><code className="bg-slate-700 px-2 py-1 rounded">GET /api/health</code> - Health check</li>
          </ul>
        </div>
        <p className="text-gray-400 mt-6">Mention <code className="bg-slate-700 px-2 py-1 rounded">@daemonagent</code> on Farcaster</p>
      </div>
    </main>
  )
}
