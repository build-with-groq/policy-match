"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, CheckCircle, AlertCircle, X, Shield } from "lucide-react"
import { useUpload, usePolicies } from "@/hooks/use-api"
import { FILE_CONFIG } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface DocumentUploadProps {
  onUploadSuccess: () => void
  className?: string
}

export function DocumentUpload({ onUploadSuccess, className }: DocumentUploadProps) {
  const { policies } = usePolicies()
  const { uploadDocument, uploading, error } = useUpload()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>("")
  const [dragOver, setDragOver] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleChooseFileClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  const handleUpload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!selectedFile || !selectedPolicyId) return

    try {
      await uploadDocument(selectedFile, selectedPolicyId)
      setUploadSuccess(true)
      setTimeout(() => {
        setUploadSuccess(false)
        setSelectedFile(null)
        setSelectedPolicyId("")
        onUploadSuccess()
      }, 2000)
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }

  const removeFile = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedFile(null)
    setUploadSuccess(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const selectedPolicy = policies.find((p) => p.policy_id === selectedPolicyId)

  return (
    <div className={cn("space-y-6", className)}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Customer document uploaded successfully! Analysis will begin shortly.
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">Select Policy Framework</h3>
            <p className="text-sm text-blue-700">Choose which policy to analyze the document against</p>
          </div>
        </div>

        <Select value={selectedPolicyId} onValueChange={setSelectedPolicyId}>
          <SelectTrigger className="w-full bg-white border-blue-200">
            <SelectValue placeholder="Choose a policy framework..." />
          </SelectTrigger>
          <SelectContent>
            {policies.map((policy) => (
              <SelectItem key={policy.policy_id} value={policy.policy_id}>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{policy.title}</span>
                  <span className="text-sm text-slate-500">({policy.category})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedPolicy && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium text-slate-900">Selected: {selectedPolicy.title}</span>
              <span className="text-slate-500">• {selectedPolicy.rules.length} rules</span>
            </div>
          </div>
        )}
      </Card>

      <Card
        className={cn(
          "border-2 border-dashed transition-all duration-300 relative overflow-hidden",
          dragOver
            ? "border-blue-400 bg-blue-50"
            : selectedFile
              ? "border-green-400 bg-green-50"
              : "border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-white",
          !selectedPolicyId && "opacity-50 pointer-events-none",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          {!selectedFile ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center">
                <Upload className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Customer Document</h3>
              <p className="text-slate-600 mb-6">Drag and drop your customer document here, or click to browse</p>

              <input
                ref={fileInputRef}
                type="file"
                accept={FILE_CONFIG.ACCEPTED_TYPES}
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />

              <Button
                type="button"
                onClick={handleChooseFileClick}
                disabled={!selectedPolicyId}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                Choose File
              </Button>
              <p className="text-sm text-slate-500 mt-4">
                Supports {FILE_CONFIG.SUPPORTED_EXTENSIONS.join(", ")} files up to {FILE_CONFIG.MAX_SIZE_MB}MB
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Customer Document Ready</h3>
                <Button variant="ghost" size="sm" onClick={removeFile} className="h-6 w-6 p-0 hover:bg-red-100">
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <p className="text-slate-600 mb-2">
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
              {selectedPolicy && (
                <p className="text-sm text-slate-500 mb-6">
                  Will be analyzed against: <span className="font-medium text-blue-600">{selectedPolicy.title}</span>
                </p>
              )}

              {uploading ? (
                <div className="space-y-4">
                  <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-slate-600">Uploading and analyzing customer document...</p>
                  <Progress value={66} className="w-full max-w-xs mx-auto" />
                </div>
              ) : (
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedPolicyId}
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    Start Analysis
                  </Button>
                  <Button variant="outline" onClick={removeFile}>
                    Choose Different File
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {!selectedPolicyId && policies.length > 0 && (
        <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">Please select a policy framework first to enable document upload.</p>
        </div>
      )}
    </div>
  )
}
