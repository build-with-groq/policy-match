"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Key, AlertCircle, CheckCircle, ExternalLink, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface ApiKeyManagerProps {
  onApiKeyChange?: (apiKey: string) => void
  showInHeader?: boolean
}

export function ApiKeyManager({ onApiKeyChange, showInHeader = false }: ApiKeyManagerProps) {
  const [apiKey, setApiKey] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tempApiKey, setTempApiKey] = useState<string>("")
  const [isDemo, setIsDemo] = useState(true)

  useEffect(() => {
    const storedKey = localStorage.getItem("groq_api_key")
    if (storedKey) {
      setApiKey(storedKey)
      setIsDemo(false)
      onApiKeyChange?.(storedKey)
    }
  }, [onApiKeyChange])

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem("groq_api_key", tempApiKey.trim())
      setApiKey(tempApiKey.trim())
      setIsDemo(false)
      onApiKeyChange?.(tempApiKey.trim())
      toast.success("API key saved successfully")
      setIsDialogOpen(false)
      setTempApiKey("")
    } else {
      toast.error("Please enter a valid API key")
    }
  }

  const handleRemoveApiKey = () => {
    localStorage.removeItem("groq_api_key")
    setApiKey("")
    setIsDemo(true)
    onApiKeyChange?.("")
    toast.info("API key removed, using demo mode")
    setIsDialogOpen(false)
  }

  const openApiKeyDialog = () => {
    setTempApiKey(apiKey)
    setIsDialogOpen(true)
  }

  if (showInHeader) {
    return (
      <>
        <Button
          variant={isDemo ? "outline" : "ghost"}
          size="sm"
          onClick={openApiKeyDialog}
          className={`flex items-center gap-2 ${
            isDemo
              ? "border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700"
              : "text-green-700 hover:bg-green-50"
          }`}
        >
          {isDemo ? (
            <>
              <Sparkles className="w-4 h-4" />
              Demo Mode
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              API Key Active
            </>
          )}
        </Button>

        <ApiKeyDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          apiKey={apiKey}
          tempApiKey={tempApiKey}
          onTempApiKeyChange={setTempApiKey}
          onSave={handleSaveApiKey}
          onRemove={handleRemoveApiKey}
        />
      </>
    )
  }

  return (
    <div className="space-y-4">
      <Alert className={isDemo ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{isDemo ? "Demo Mode Active" : "API Key Configured"}</AlertTitle>
        <AlertDescription>
          {isDemo
            ? "You're using the free demo with rate limits. Add your Groq API key for unlimited usage."
            : "Your Groq API key is active. You have unlimited API access."}
        </AlertDescription>
      </Alert>

      <div className="flex items-center gap-3">
        <Button onClick={openApiKeyDialog} variant="outline" className="flex items-center gap-2">
          <Key className="w-4 h-4" />
          {apiKey ? "Update API Key" : "Add API Key"}
        </Button>
        {apiKey && (
          <Button onClick={handleRemoveApiKey} variant="ghost" className="text-red-600 hover:text-red-700">
            Remove Key
          </Button>
        )}
      </div>

      <ApiKeyDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        apiKey={apiKey}
        tempApiKey={tempApiKey}
        onTempApiKeyChange={setTempApiKey}
        onSave={handleSaveApiKey}
        onRemove={handleRemoveApiKey}
      />
    </div>
  )
}

interface ApiKeyDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  apiKey: string
  tempApiKey: string
  onTempApiKeyChange: (key: string) => void
  onSave: () => void
  onRemove: () => void
}

function ApiKeyDialog({
  isOpen,
  onOpenChange,
  apiKey,
  tempApiKey,
  onTempApiKeyChange,
  onSave,
  onRemove,
}: ApiKeyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Groq API Key Configuration
          </DialogTitle>
          <DialogDescription>
            Add your Groq API key to remove rate limits and get unlimited access to PolicyMatch.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="gsk_..."
              value={tempApiKey}
              onChange={(e) => onTempApiKeyChange(e.target.value)}
              className="font-mono"
            />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Get your API key</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Don't have an API key yet?</p>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-groq-primary hover:underline"
              >
                Get your free API key from Groq Console
                <ExternalLink className="w-3 h-3" />
              </a>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {apiKey && (
            <Button variant="ghost" onClick={onRemove} className="text-red-600 hover:text-red-700 sm:mr-auto">
              Remove Key
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} className="bg-groq-primary hover:bg-groq-primary-hover">
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
