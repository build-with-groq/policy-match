"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  CheckCircle,
  AlertTriangle,
  Eye,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
  Users,
  Shield,
} from "lucide-react"
import { useDocuments } from "@/hooks/use-api"
import { ApiClient, type Document } from "@/lib/api"
import { cn } from "@/lib/utils"

interface DocumentsListProps {
  onDocumentSelect?: (document: Document) => void
  selectedDocument?: Document | null
  className?: string
}

export function DocumentsList({ onDocumentSelect, selectedDocument, className }: DocumentsListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const { documents, loading, error, pagination, refetch } = useDocuments(currentPage, 10)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDeleteDocument = async (documentId: string) => {
    try {
      setDeletingId(documentId)
      await ApiClient.deleteDocument(documentId)
      refetch()
    } catch (error) {
      console.error("Failed to delete document:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusColor = (document: Document) => {
    if (document.is_compliant) return "green"
    if (document.is_human_review_required) return "amber"
    return "red"
  }

  const getStatusIcon = (document: Document) => {
    if (document.is_compliant) return <CheckCircle className="w-4 h-4" />
    return <AlertTriangle className="w-4 h-4" />
  }

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm text-slate-600">Loading customer documents...</span>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="h-2 bg-slate-200 rounded w-full"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("space-y-4", className)}>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load customer documents: {error}
            <Button variant="outline" size="sm" onClick={refetch} className="ml-2 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <Card className={cn("p-8 text-center border-dashed border-2 border-slate-300", className)}>
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">No Customer Documents Found</h3>
        <p className="text-slate-600">Upload your first customer document to get started with compliance analysis.</p>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-900">Customer Documents ({pagination.total})</h3>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Customer Files
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        {documents.map((document) => (
          <Card
            key={document.document_id}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedDocument?.document_id === document.document_id
                ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                : "hover:border-slate-300",
            )}
            onClick={() => onDocumentSelect?.(document)}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  getStatusColor(document) === "green"
                    ? "bg-green-100"
                    : getStatusColor(document) === "amber"
                      ? "bg-amber-100"
                      : "bg-red-100",
                )}
              >
                <div
                  className={cn(
                    getStatusColor(document) === "green"
                      ? "text-green-600"
                      : getStatusColor(document) === "amber"
                        ? "text-amber-600"
                        : "text-red-600",
                  )}
                >
                  {getStatusIcon(document)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-slate-900 truncate">{document.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        <Shield className="w-3 h-3 mr-1" />
                        {document.policy_title}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {document.extension}
                      </Badge>
                      {document.is_human_review_required && (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">Review Required</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Delete Customer Document</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-slate-600">
                            Are you sure you want to delete "{document.title}"? This action cannot be undone.
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteDocument(document.document_id)}
                              disabled={deletingId === document.document_id}
                              className="flex-1"
                            >
                              {deletingId === document.document_id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">Compliance Score</span>
                    <span
                      className={cn(
                        "font-semibold",
                        document.compliance_percentage >= 80
                          ? "text-green-600"
                          : document.compliance_percentage >= 60
                            ? "text-amber-600"
                            : "text-red-600",
                      )}
                    >
                      {document.compliance_percentage}%
                    </span>
                  </div>
                  <Progress value={document.compliance_percentage} className="h-2" />
                </div>

                {document.violations.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">
                      {document.violations.length} Violation{document.violations.length !== 1 ? "s" : ""} Found:
                    </p>
                    <div className="space-y-1">
                      {document.violations.slice(0, 2).map((violation, index) => (
                        <p key={index} className="text-xs text-red-700 bg-red-50 p-2 rounded border border-red-200">
                          {violation}
                        </p>
                      ))}
                      {document.violations.length > 2 && (
                        <p className="text-xs text-slate-500">
                          +{document.violations.length - 2} more violation
                          {document.violations.length - 2 !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {document.is_compliant && (
                  <div className="bg-green-50 border border-green-200 rounded p-2">
                    <p className="text-sm text-green-800 font-medium">✅ Customer document is fully compliant</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {pagination.total > pagination.pageSize && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} customer documents
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
