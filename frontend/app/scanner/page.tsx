"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, ArrowLeft, Menu, X, Upload, Users, Settings } from "lucide-react"
import Link from "next/link"
import { PolicyManagement } from "@/components/policy-management"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentsList } from "@/components/documents-list"
import { DocumentDetails } from "@/components/document-details"
import { ApiKeyManager } from "@/components/api-key-manager"
import { RateLimitDialog } from "@/components/rate-limit-dialog"
import type { Document } from "@/lib/api"

export default function ScannerPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [activeTab, setActiveTab] = useState("upload")
  const [refreshKey, setRefreshKey] = useState(0)
  const [rateLimitError, setRateLimitError] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: "",
  })

  const handleUploadSuccess = () => {
    setActiveTab("documents")
    setRefreshKey((prev) => prev + 1)
  }

  const handleRateLimitError = (message: string) => {
    setRateLimitError({ isOpen: true, message })
  }

  const handleApiKeySubmit = (apiKey: string) => {
    // Refresh the page to retry with the new API key
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-groq-primary-light to-orange-50">
      <header className="bg-white/90 backdrop-blur-sm border-b border-groq-primary/10 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-groq-primary to-groq-primary-hover rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-groq-dark">PolicyMatch</span>
              </Link>
            </div>

            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            <div className="hidden md:flex items-center gap-3">
              <ApiKeyManager showInHeader={true} />
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-groq-dark hover:bg-groq-primary-light">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-groq-primary/10 py-4">
              <div className="space-y-4">
                <div className="px-2">
                  <ApiKeyManager showInHeader={true} />
                </div>
                <Link href="/" className="block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-groq-dark hover:bg-groq-primary-light"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm border border-groq-primary/10">
            <TabsTrigger
              value="policies"
              className="flex items-center gap-2 data-[state=active]:bg-groq-primary-light data-[state=active]:text-groq-primary"
            >
              <Settings className="w-4 h-4" />
              Policy Management
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="flex items-center gap-2 data-[state=active]:bg-groq-primary-light data-[state=active]:text-groq-primary"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="flex items-center gap-2 data-[state=active]:bg-groq-primary-light data-[state=active]:text-groq-primary"
            >
              <Users className="w-4 h-4" />
              Customer Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="policies" className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-groq-dark mb-4">Policy Framework Management</h1>
              <p className="text-lg text-groq-dark/70 max-w-2xl mx-auto">
                Create and manage compliance policy frameworks that will be used to analyze customer documents
              </p>
            </div>
            <PolicyManagement onRateLimitError={handleRateLimitError} />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-groq-dark mb-4">Customer Document Analysis</h1>
              <p className="text-lg text-groq-dark/70 max-w-2xl mx-auto">
                Upload customer documents to analyze compliance against your policy frameworks
              </p>
            </div>
            <DocumentUpload onUploadSuccess={handleUploadSuccess} onRateLimitError={handleRateLimitError} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-groq-dark mb-4">Customer Document Library</h1>
              <p className="text-lg text-groq-dark/70 max-w-2xl mx-auto">
                View and manage analyzed customer documents and their compliance status
              </p>
            </div>
            <DocumentsList
              key={refreshKey}
              onDocumentSelect={setSelectedDocument}
              selectedDocument={selectedDocument}
            />

            {selectedDocument && (
              <div className="mt-8">
                <DocumentDetails document={selectedDocument} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <RateLimitDialog
        isOpen={rateLimitError.isOpen}
        onOpenChange={(open) => setRateLimitError({ ...rateLimitError, isOpen: open })}
        errorMessage={rateLimitError.message}
        onApiKeySubmit={handleApiKeySubmit}
      />
    </div>
  )
}
