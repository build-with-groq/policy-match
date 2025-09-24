"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ExternalLink, Key, Zap } from "lucide-react"
import { toast } from "sonner"

interface RateLimitDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  errorMessage: string
  onApiKeySubmit: (apiKey: string) => void
}

export function RateLimitDialog({ isOpen, onOpenChange, errorMessage, onApiKeySubmit }: RateLimitDialogProps) {
  const [apiKey, setApiKey] = useState("")

  const handleSubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem("groq_api_key", apiKey.trim())
      onApiKeySubmit(apiKey.trim())
      toast.success("API key saved! Retrying your request...")
      onOpenChange(false)
      setApiKey("")
    } else {
      toast.error("Please enter a valid API key")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-3 text-orange-600">
            <Zap className="w-6 h-6" />
            <DialogTitle className="text-xl">Rate Limit Reached</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {errorMessage || "You've reached the demo usage limit. Add your Groq API key to continue."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              The free demo has usage limits to prevent abuse. With your own API key, you'll have:
              <ul className="mt-2 ml-4 list-disc space-y-1">
                <li>Unlimited document analysis</li>
                <li>No rate limits</li>
                <li>Priority processing</li>
                <li>Full access to all features</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="rate-limit-api-key">Enter Your Groq API Key</Label>
            <Input
              id="rate-limit-api-key"
              type="password"
              placeholder="gsk_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit()
                }
              }}
            />
            <p className="text-sm text-muted-foreground">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm font-medium mb-2">Don't have an API key?</p>
            <p className="text-sm text-muted-foreground mb-3">
              Get your free API key from Groq in less than a minute:
            </p>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-groq-primary hover:underline"
            >
              <Key className="w-4 h-4" />
              Get Free API Key from Groq Console
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Try Again Later
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-groq-primary hover:bg-groq-primary-hover"
            disabled={!apiKey.trim()}
          >
            Add API Key & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
