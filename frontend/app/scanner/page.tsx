"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, ArrowLeft, Menu, X, Upload, Users, Settings } from "lucide-react"
import Link from "next/link"
import { SystemStatus } from "@/components/system-status"
import { PolicyManagement } from "@/components/policy-management"
import { DocumentUpload } from "@/components/document-upload"
import { DocumentsList } from "@/components/documents-list"
import { DocumentDetails } from "@/components/document-details"
import type { Document } from "@/lib/api"

export default function ScannerPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [activeTab, setActiveTab] = useState("upload")
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = () => {
    setActiveTab("documents")
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-slate-900">PolicyMatch</span>
              </Link>

              <div className="hidden md:block ml-8">
                <SystemStatus />
              </div>
            </div>

            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 py-4">
              <div className="space-y-4">
                <SystemStatus />
                <Link href="/" className="block">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
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
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white border border-slate-200">
            <TabsTrigger
              value="policies"
              className="flex items-center gap-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
            >
              <Settings className="w-4 h-4" />
              Policy Management
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="flex items-center gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
            >
              <Users className="w-4 h-4" />
              Customer Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="policies" className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Policy Framework Management</h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Create and manage compliance policy frameworks that will be used to analyze customer documents
              </p>
            </div>
            <PolicyManagement />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Customer Document Analysis</h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Upload customer documents to analyze compliance against your policy frameworks
              </p>
            </div>
            <DocumentUpload onUploadSuccess={handleUploadSuccess} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Customer Document Library</h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
    </div>
  )
}
