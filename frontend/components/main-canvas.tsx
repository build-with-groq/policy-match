"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  FileText,
  Maximize2,
  Share2,
  BookOpen,
  Eye,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle,
  Info,
  Upload,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Clause {
  id: number
  title: string
  excerpt: string
  status: "pass" | "fail"
  confidence: number
  comments: number
  severity?: "high" | "medium" | "low"
  suggestions?: string[]
}

interface MainCanvasProps {
  selectedScan: any
  clauses: Clause[]
  className?: string
}

export function MainCanvas({ selectedScan, clauses, className }: MainCanvasProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [viewMode, setViewMode] = useState<"document" | "analysis">("document")
  const [selectedClause, setSelectedClause] = useState<number | null>(null)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)

  if (!selectedScan) {
    return (
      <div className={cn("flex-1 flex items-center justify-center bg-slate-50", className)}>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">No Document Selected</h3>
          <p className="text-slate-600 mb-6">
            Select a document from your library or upload a new policy document to begin compliance analysis.
          </p>
          <div className="flex gap-3 justify-center">
            <Button className="btn-primary">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
            <Button variant="outline" className="btn-secondary bg-transparent">
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Library
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex-1 flex flex-col bg-slate-50", className)}>
      <div className="bg-white border-b border-slate-200 p-4 shadow-professional">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{selectedScan.name}</h2>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Eye className="w-4 h-4" />
                  <span>Last viewed 2 hours ago</span>
                  <Badge className="bg-green-100 text-green-700 text-xs border-green-200">Analyzed</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 rounded-lg p-1">
              <Button
                variant={viewMode === "document" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("document")}
                className={cn(
                  "rounded-md transition-all duration-200",
                  viewMode === "document"
                    ? "bg-white text-slate-900 shadow-professional"
                    : "text-slate-600 hover:text-slate-900",
                )}
              >
                <FileText className="w-4 h-4 mr-2" />
                Document
              </Button>
              <Button
                variant={viewMode === "analysis" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("analysis")}
                className={cn(
                  "rounded-md transition-all duration-200",
                  viewMode === "analysis"
                    ? "bg-white text-slate-900 shadow-professional"
                    : "text-slate-600 hover:text-slate-900",
                )}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Analysis
              </Button>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <Button variant="ghost" size="sm" onClick={handleZoomOut} className="hover:bg-white">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <div className="px-3 py-1 bg-white rounded-md shadow-sm min-w-[60px] text-center">
                <span className="text-sm font-medium text-slate-700">{zoom}%</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleZoomIn} className="hover:bg-white">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <div className="w-px h-6 bg-slate-300 mx-1"></div>
              <Button variant="ghost" size="sm" onClick={handleRotate} className="hover:bg-white">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-white">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="btn-secondary bg-transparent">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button className="btn-primary">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium text-slate-700">
              {clauses.filter((c) => c.status === "pass").length} Compliant Clauses
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-medium text-slate-700">
              {clauses.filter((c) => c.status === "fail").length} Issues Found
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span className="font-medium text-slate-700">
              {clauses.reduce((sum, c) => sum + c.comments, 0)} Comments
            </span>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Overall Score:</span>
              <Badge className="bg-slate-800 text-white font-semibold">{selectedScan.score}%</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {viewMode === "document" ? (
            <Card className="shadow-deep hover:shadow-elevated transition-all duration-300 overflow-hidden bg-white">
              <div
                className="relative bg-white min-h-[800px] transition-transform duration-300"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin: "center top",
                }}
              >
                <div className="p-8 space-y-6">
                  <div className="text-center border-b border-slate-200 pb-6">
                    <h1 className="text-3xl font-bold text-slate-900 mb-3">Privacy Policy</h1>
                    <p className="text-slate-600 text-lg">Last updated: January 15, 2024</p>
                    <div className="flex justify-center gap-3 mt-4">
                      <Badge className="bg-slate-100 text-slate-700 border-slate-200">Version 2.1</Badge>
                      <Badge className="bg-green-100 text-green-700 border-green-200">GDPR Compliant</Badge>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">AI Analyzed</Badge>
                    </div>
                  </div>

                  {clauses.map((clause, index) => (
                    <div
                      key={clause.id}
                      className={cn(
                        "p-6 rounded-lg border-2 transition-all duration-300 relative overflow-hidden cursor-pointer hover-lift",
                        clause.status === "pass"
                          ? "bg-green-50 border-green-200 hover:border-green-300"
                          : "bg-red-50 border-red-200 hover:border-red-300",
                        selectedClause === clause.id && "ring-2 ring-blue-500 scale-[1.02]",
                      )}
                      onClick={() => setSelectedClause(selectedClause === clause.id ? null : clause.id)}
                    >
                      <div className="absolute -top-2 -right-2">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-professional",
                            clause.status === "pass" ? "bg-green-500 text-white" : "bg-red-500 text-white",
                          )}
                        >
                          {clause.status === "pass" ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                        </div>
                      </div>

                      {clause.severity && (
                        <div className="absolute top-3 left-3">
                          <Badge
                            className={cn(
                              "text-xs font-semibold",
                              clause.severity === "high"
                                ? "bg-red-500 text-white"
                                : clause.severity === "medium"
                                  ? "bg-amber-500 text-white"
                                  : "bg-blue-500 text-white",
                            )}
                          >
                            {clause.severity.toUpperCase()}
                          </Badge>
                        </div>
                      )}

                      <div className="pt-4">
                        <h3 className="font-semibold text-slate-900 mb-3 text-lg flex items-center gap-3">
                          <span className="text-xl">{clause.status === "pass" ? "✅" : "❌"}</span>
                          {clause.title}
                        </h3>

                        <p className="text-slate-700 leading-relaxed mb-4">{clause.excerpt}</p>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-xl font-bold text-slate-800 mb-1">{clause.confidence}%</div>
                            <div className="text-sm text-slate-500">Confidence</div>
                            <Progress value={clause.confidence} className="h-2 mt-2" />
                          </div>

                          <div className="text-center">
                            <div className="text-xl font-bold text-slate-600 mb-1">{clause.comments}</div>
                            <div className="text-sm text-slate-500">Comments</div>
                          </div>

                          <div className="text-center">
                            <div className="flex justify-center gap-2 mb-1">
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-green-100">
                                <ThumbsUp className="w-3 h-3 text-green-600" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-red-100">
                                <ThumbsDown className="w-3 h-3 text-red-600" />
                              </Button>
                            </div>
                            <div className="text-sm text-slate-500">Feedback</div>
                          </div>
                        </div>

                        {clause.suggestions && selectedClause === clause.id && (
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 fade-in">
                            <div className="flex items-center gap-2 mb-3">
                              <Info className="w-4 h-4 text-blue-600" />
                              <h4 className="font-medium text-blue-900">AI Suggestions</h4>
                            </div>
                            <ul className="space-y-2">
                              {clause.suggestions.map((suggestion, idx) => (
                                <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="p-6 shadow-professional bg-white">
                <h3 className="text-xl font-semibold mb-6 text-slate-900">Compliance Analysis Summary</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {clauses.filter((c) => c.status === "pass").length}
                    </div>
                    <div className="text-slate-600">Compliant Clauses</div>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-2">
                      {clauses.filter((c) => c.status === "fail").length}
                    </div>
                    <div className="text-slate-600">Issues Found</div>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-slate-700">{selectedScan.score}%</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-700 mb-2">Score</div>
                    <div className="text-slate-600">Overall Compliance</div>
                  </div>
                </div>
              </Card>

              <div className="grid gap-4">
                {clauses.map((clause) => (
                  <Card
                    key={clause.id}
                    className="p-4 shadow-professional hover:shadow-elevated transition-all duration-200 bg-white"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          clause.status === "pass" ? "bg-green-100" : "bg-red-100",
                        )}
                      >
                        {clause.status === "pass" ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-2">{clause.title}</h4>
                        <p className="text-slate-600 mb-3">{clause.excerpt}</p>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-500">Confidence:</span>
                            <Badge
                              className={cn(
                                "font-semibold",
                                clause.confidence >= 90
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : clause.confidence >= 70
                                    ? "bg-amber-100 text-amber-700 border-amber-200"
                                    : "bg-red-100 text-red-700 border-red-200",
                              )}
                            >
                              {clause.confidence}%
                            </Badge>
                          </div>

                          {clause.comments > 0 && (
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-slate-500" />
                              <span className="text-sm text-slate-600 font-medium">
                                {clause.comments} comment{clause.comments !== 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
