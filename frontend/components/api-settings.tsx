"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Key, CheckCircle, AlertCircle, ExternalLink, Sparkles, Copy, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export function ApiSettings() {
  const [apiKey, setApiKey] = useState<string>("")
  const [tempApiKey, setTempApiKey] = useState<string>("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const storedKey = localStorage.getItem("groq_api_key")
    if (storedKey) {
      setApiKey(storedKey)
      setTempApiKey(storedKey)
    }
  }, [])

  const handleSave = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem("groq_api_key", tempApiKey.trim())
      setApiKey(tempApiKey.trim())
      setIsEditing(false)
      toast.success("API key saved successfully")
    } else {
      toast.error("Please enter a valid API key")
    }
  }

  const handleRemove = () => {
    localStorage.removeItem("groq_api_key")
    setApiKey("")
    setTempApiKey("")
    setIsEditing(false)
    toast.info("API key removed, using demo mode")
  }

  const handleCancel = () => {
    setTempApiKey(apiKey)
    setIsEditing(false)
  }

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      toast.success("API key copied to clipboard")
    }
  }

  const maskApiKey = (key: string) => {
    if (!key) return ""
    return `${key.substring(0, 7)}...${key.substring(key.length - 4)}`
  }

  const isDemo = !apiKey

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">API Configuration</CardTitle>
            <CardDescription>Manage your Groq API key for PolicyMatch</CardDescription>
          </div>
          <Badge variant={isDemo ? "secondary" : "default"} className="h-8 px-3">
            {isDemo ? (
              <>
                <Sparkles className="w-4 h-4 mr-1" />
                Demo Mode
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                API Key Active
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <Alert className={isDemo ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Current Status</AlertTitle>
          <AlertDescription>
            {isDemo ? (
              <>
                You're currently using the free demo with rate limits. The demo proxy allows limited usage based on IP
                address and other factors. Add your own Groq API key for unlimited access.
              </>
            ) : (
              <>
                Your Groq API key is configured. You have unlimited access to all PolicyMatch features without rate
                limits.
              </>
            )}
          </AlertDescription>
        </Alert>

        {/* API Key Management */}
        {!isEditing && apiKey ? (
          <div className="space-y-4">
            <div>
              <Label>Current API Key</Label>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 font-mono text-sm p-2 bg-muted rounded-md flex items-center justify-between">
                  <span>{showApiKey ? apiKey : maskApiKey(apiKey)}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="h-7 w-7 p-0"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={copyApiKey} className="h-7 w-7 p-0">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Key className="w-4 h-4 mr-2" />
                Change API Key
              </Button>
              <Button onClick={handleRemove} variant="ghost" className="text-red-600 hover:text-red-700">
                Remove API Key
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-key-input">API Key</Label>
              <Input
                id="api-key-input"
                type="password"
                placeholder="gsk_..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="font-mono mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Your API key is stored locally in your browser and never sent to our servers.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={!tempApiKey.trim()} className="bg-groq-primary hover:bg-groq-primary-hover">
                <Key className="w-4 h-4 mr-2" />
                Save API Key
              </Button>
              {isEditing && (
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Get API Key Section */}
        <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Key className="w-4 h-4" />
            How to Get Your API Key
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Visit the Groq Console</li>
            <li>Sign up or log in to your account</li>
            <li>Navigate to the API Keys section</li>
            <li>Create a new API key</li>
            <li>Copy and paste it here</li>
          </ol>
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-groq-primary hover:underline"
          >
            Get Your Free API Key
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                Demo Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Limited requests per IP</li>
                <li>• Rate limits apply</li>
                <li>• Good for testing</li>
                <li>• No API key required</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                With API Key
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Unlimited requests</li>
                <li>• No rate limits</li>
                <li>• Full production use</li>
                <li>• Priority processing</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
