"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Document } from "@/lib/api"

interface DocumentDetailsProps {
  document: Document
  className?: string
}

export function DocumentDetails({ document, className }: DocumentDetailsProps) {
  return (
    <Card className={cn("p-6 shadow-lg", className)}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">{document.title}</h2>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Shield className="w-3 h-3 mr-1" />
              {document.policy_title}
            </Badge>
            <Badge variant="outline">{document.extension}</Badge>
            <Badge
              className={cn(
                document.is_compliant
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-red-100 text-red-700 border-red-200",
              )}
            >
              {document.compliance_percentage}% Compliant
            </Badge>
            {document.is_human_review_required && (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">Review Required</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {document.violations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Compliance Violations ({document.violations.length})</h3>
          <div className="grid gap-3">
            {document.violations.map((violation, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-red-600">{index + 1}</span>
                  </div>
                  <p className="text-sm text-red-800 leading-relaxed">{violation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {document.is_compliant && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-1">Document is Fully Compliant</h3>
              <p className="text-green-700">
                This customer document meets all compliance requirements and is ready for processing.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
