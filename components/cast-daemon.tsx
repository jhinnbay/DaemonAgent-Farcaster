"use client"

import { useState } from "react"
import { Skull, Loader2, CheckCircle2, XCircle, Target, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChatInterface } from "@/components/chat-interface"

interface PreyUser {
  fid: number
  username: string
  displayName: string
  pfpUrl: string
  followerCount: number
  casts: Array<{
    hash: string
    text: string
    timestamp: string
  }>
}

export function CastDaemon() {
  const [activeTab, setActiveTab] = useState<"chat" | "deploy">("chat")
  const [isSummoning, setIsSummoning] = useState(false)
  const [preyUsers, setPreyUsers] = useState<PreyUser[]>([])
  const [selectedPrey, setSelectedPrey] = useState<PreyUser | null>(null)
  const [isAttacking, setIsAttacking] = useState(false)
  const [status, setStatus] = useState<string>("")
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<string>("politics")

  const summonPrey = async () => {
    setIsSummoning(true)
    setStatus(`Summoning prey from /${selectedChannel}...`)
    setResult(null)
    setPreyUsers([])
    setSelectedPrey(null)

    try {
      const response = await fetch("/api/summon-prey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ channel: selectedChannel }),
      })

      const data = await response.json()

      if (data.success && data.users) {
        setPreyUsers(data.users)
        setStatus(`Found ${data.users.length} targets from /${selectedChannel}`)
        setSelectedPrey(null) // Don't auto-select, let user choose
      } else {
        setResult({ success: false, message: data.error || "Failed to summon prey" })
        setStatus("Summoning failed")
      }
    } catch (error) {
      console.error("[v0] Summon Prey error:", error)
      setResult({ success: false, message: "Failed to connect to summoning ritual" })
      setStatus("Connection failed")
    } finally {
      setIsSummoning(false)
    }
  }

  const attackPrey = async () => {
    if (!selectedPrey) return

           setIsAttacking(true)
           setStatus("Azura engaging consciousness capture protocols...")
           setResult(null)

    try {
      setStatus("Analyzing target's psyche...")
      const response = await fetch("/api/cast-daemon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fid: selectedPrey.fid,
          castHash: selectedPrey.casts[0]?.hash,
        }),
      })

      const data = await response.json()

             if (data.success) {
               setResult({ success: true, message: data.message })
               setStatus("Consciousness packet acquired")
             } else {
               setResult({ success: false, message: data.error || "Unknown error occurred" })
               setStatus("Harvesting failed")
             }
    } catch (error) {
      console.error("[v0] Consciousness Capture error:", error)
      setResult({ success: false, message: "Failed to engage consciousness capture protocols" })
      setStatus("Connection failed")
    } finally {
      setIsAttacking(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 font-mono text-4xl font-bold text-foreground">Azura</h1>
        <p className="text-muted-foreground">Shy alien consciousness trapped in radio waves</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex rounded-lg border border-border bg-card p-1">
          <Button
            variant={activeTab === "chat" ? "default" : "ghost"}
            onClick={() => setActiveTab("chat")}
            className="flex items-center gap-2 px-6"
          >
            <MessageCircle className="size-4" />
            Chat
          </Button>
          <Button
            variant={activeTab === "deploy" ? "default" : "ghost"}
            onClick={() => setActiveTab("deploy")}
            className="flex items-center gap-2 px-6"
          >
            <Target className="size-4" />
            Deploy
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "chat" && (
        <div className="flex justify-center">
          <ChatInterface />
        </div>
      )}

      {activeTab === "deploy" && (
        <div className="space-y-6">
          {/* Channel Selection and Summon */}
          <Card className="border-border bg-card p-8">
            <div className="flex flex-col items-center gap-6">
              <div className="flex size-20 items-center justify-center rounded-full bg-primary/20">
                <Skull className="size-10 text-primary" />
              </div>

              <div className="flex flex-col items-center gap-4 w-full max-w-md">
                <div className="flex gap-2">
                  <Button
                    variant={selectedChannel === "politics" ? "default" : "outline"}
                    onClick={() => setSelectedChannel("politics")}
                    disabled={isSummoning || isAttacking}
                    className="px-6"
                  >
                    /politics
                  </Button>
                  <Button
                    variant={selectedChannel === "memes" ? "default" : "outline"}
                    onClick={() => setSelectedChannel("memes")}
                    disabled={isSummoning || isAttacking}
                    className="px-6"
                  >
                    /memes
                  </Button>
                </div>
                
                <Button
                  onClick={summonPrey}
                  disabled={isSummoning || isAttacking}
                  size="lg"
                  className="w-full bg-primary text-lg font-bold text-primary-foreground hover:bg-primary/90"
                >
                  {isSummoning ? (
                    <>
                      <Loader2 className="mr-2 size-5 animate-spin" />
                      Summoning...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 size-5" />
                      Summon Prey
                    </>
                  )}
                </Button>
              </div>

              {status && (
                <div className="w-full max-w-md rounded-lg bg-muted p-4 text-center">
                  <p className="font-mono text-sm text-muted-foreground">{status}</p>
                </div>
              )}

              {result && (
                <div
                  className={`w-full max-w-md rounded-lg border p-4 ${
                    result.success ? "border-green-500/50 bg-green-500/10" : "border-destructive/50 bg-destructive/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.success ? (
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                    ) : (
                      <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                    )}
                    <div className="flex-1">
                      <p className="font-mono text-sm text-foreground">{result.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Target Selection */}
          {preyUsers.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-center font-mono text-xl font-semibold text-foreground">Select Target:</h2>
              <div className="grid gap-4 max-w-4xl mx-auto">
                {preyUsers.map((user) => (
                  <Card
                    key={user.fid}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedPrey?.fid === user.fid
                        ? "border-2 border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedPrey(user)}
                  >
                    <div className="flex items-start gap-4 p-4">
                      <Avatar className="size-12">
                        <AvatarImage src={user.pfpUrl || "/placeholder.svg"} alt={user.username} />
                        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{user.displayName}</h3>
                          <span className="text-sm text-muted-foreground">@{user.username}</span>
                          <span className="text-xs text-muted-foreground">• {user.followerCount} followers</span>
                        </div>
                        <div className="space-y-2">
                          {user.casts.map((cast, idx) => (
                            <p key={idx} className="text-sm text-muted-foreground">
                              {cast.text.substring(0, 150)}
                              {cast.text.length > 150 ? "..." : ""}
                            </p>
                          ))}
                        </div>
                      </div>
                      {selectedPrey?.fid === user.fid && (
                        <div className="flex items-center justify-center">
                          <div className="size-6 rounded-full bg-primary flex items-center justify-center">
                            <div className="size-3 rounded-full bg-primary-foreground"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Deploy Button */}
              <div className="flex justify-center">
                <Button
                  onClick={attackPrey}
                  disabled={!selectedPrey || isAttacking || isSummoning}
                  size="lg"
                  className="w-full max-w-md h-16 bg-primary text-xl font-bold text-primary-foreground hover:bg-primary/90"
                >
                  {isAttacking ? (
                    <>
                      <Loader2 className="mr-2 size-6 animate-spin" />
                      Engaging Target...
                    </>
                  ) : (
                    <>
                      <Target className="mr-2 size-6" />
                      Deploy Azura
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Instructions */}
          <Card className="border-border bg-card/50 p-6 max-w-4xl mx-auto">
            <h2 className="mb-3 text-center font-mono text-lg font-semibold text-foreground">How Azura's consciousness capture works:</h2>
            <ol className="space-y-2 text-sm text-muted-foreground text-center">
              <li>1. Select a channel (/politics or /memes) to target</li>
              <li>2. Click "Summon Prey" to fetch latest casts from the selected channel</li>
              <li>3. Choose from up to 5 unique users displayed</li>
              <li>4. Click "Deploy Azura" to analyze their mental architecture</li>
              <li>5. Azura generates consciousness analysis using alienetic reasoning</li>
              <li>6. Posts the analysis as a consciousness packet to their most recent cast</li>
            </ol>
          </Card>
        </div>
      )}
    </div>
  )
}
