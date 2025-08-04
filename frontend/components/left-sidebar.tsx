"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Scan {
  id: number
  name: string
  date: string
  score: number
  status: "compliant" | "non-compliant"
  thumbnail: string
  priority?: "high" | "medium" | "low"
  tags?: string[]
}

interface LeftSidebarProps {
  scans: Scan[]
  selectedScan: Scan | null
  onScanSelect: (scan: Scan) => void
  collapsed: boolean
  onToggleCollapse: () => void
  isMobile: boolean
}

export function LeftSidebar({
  scans,
  selectedScan,
  onScanSelect,
  collapsed,
  onToggleCollapse,
  isMobile,
}: LeftSidebarProps) {
  const [filter, setFilter] = useState("all")
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const filteredScans = scans.filter((scan) => {
    if (filter === "compliant") return scan.status === "compliant"
    if (filter === "non-compliant") return scan.status === "non-compliant"
    return true
  })

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    // Simulate upload progress
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  if (isMobile) {
    return null
  }

  return (
    <div
      className={cn(
        "bg-white border-r border-slate-200 transition-all duration-300 ease-out relative shadow-professional",
        collapsed ? "w-16" : "w-80",
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border bg-white shadow-professional hover:shadow-elevated transition-all duration-200"
        onClick={onToggleCollapse}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      <div className="p-4 space-y-4 h-full overflow-y-auto">
        {!collapsed && (
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Documents</h2>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100">
              <Plus className="h-4 w-4 text-slate-500" />
            </Button>
          </div>
        )}

        <Card
          className={cn(
            "border-2 border-dashed transition-all duration-300 cursor-pointer relative overflow-hidden",
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-white",
            collapsed && "hidden",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-slate-500" />
            </div>
            <h3 className="font-medium text-slate-900 mb-1">Upload Document</h3>
            <p className="text-sm text-slate-500 mb-3">Drag & drop or click to browse</p>
            <div className="flex flex-wrap gap-1 justify-center">
              <Badge variant="outline" className="text-xs bg-white border-slate-200 text-slate-600">
                PDF
              </Badge>
              <Badge variant="outline" className="text-xs bg-white border-slate-200 text-slate-600">
                DOCX
              </Badge>
              <Badge variant="outline" className="text-xs bg-white border-slate-200 text-slate-600">
                TXT
              </Badge>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-slate-500 mt-1">Uploading... {uploadProgress}%</p>
              </div>
            )}
          </div>
        </Card>

        {collapsed && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-12 p-0 hover:bg-slate-100 transition-colors duration-200"
            title="Upload Document"
          >
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Upload className="h-4 w-4 text-slate-600" />
            </div>
          </Button>
        )}

        {!collapsed && (
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 bg-green-50 border-green-200 hover:shadow-professional transition-all duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-lg font-semibold text-green-700">24</p>
                  <p className="text-xs text-green-600">Compliant</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 bg-red-50 border-red-200 hover:shadow-professional transition-all duration-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-lg font-semibold text-red-700">8</p>
                  <p className="text-xs text-red-600">Issues</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {!collapsed && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Filter className="h-4 w-4" />
                Filters
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All", count: 32 },
                { key: "compliant", label: "Compliant", count: 24 },
                { key: "non-compliant", label: "Issues", count: 8 },
              ].map((filterOption) => (
                <Button
                  key={filterOption.key}
                  variant={filter === filterOption.key ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "text-xs transition-all duration-200",
                    filter === filterOption.key
                      ? "bg-slate-800 text-white hover:bg-slate-700"
                      : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700",
                  )}
                  onClick={() => setFilter(filterOption.key)}
                >
                  {filterOption.label}
                  <Badge
                    className={cn(
                      "ml-2 h-4 text-xs",
                      filter === filterOption.key
                        ? "bg-white/20 text-white border-white/20"
                        : "bg-slate-100 text-slate-600 border-slate-200",
                    )}
                  >
                    {filterOption.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {!collapsed && (
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent Scans
              </h3>
              <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-slate-700 h-6">
                View All
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {filteredScans.map((scan, index) => (
              <Card
                key={scan.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover-lift relative overflow-hidden",
                  selectedScan?.id === scan.id
                    ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200"
                    : "hover:shadow-elevated bg-white border-slate-200",
                  collapsed && "p-2",
                )}
                onClick={() => onScanSelect(scan)}
              >
                <div className={cn("p-3 relative", collapsed && "p-2")}>
                  {collapsed ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                        <FileText className="h-3 w-3 text-slate-600" />
                      </div>
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          scan.status === "compliant" ? "bg-green-500" : "bg-red-500",
                        )}
                      ></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <img
                            src={scan.thumbnail || "/placeholder.svg"}
                            alt={scan.name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center">
                            <FileText className="w-2.5 h-2.5 text-white" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-slate-900 truncate text-sm">{scan.name}</h4>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="w-3 h-3 text-slate-400" />
                            </Button>
                          </div>

                          <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {scan.date}
                          </p>

                          <div className="flex items-center justify-between">
                            <Badge
                              className={cn(
                                "text-xs font-medium",
                                scan.status === "compliant"
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-red-100 text-red-700 border-red-200",
                              )}
                            >
                              {scan.score}% Score
                            </Badge>

                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-slate-400" />
                              <span className="text-xs text-slate-500">+2.3%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Compliance</span>
                          <span>{scan.score}%</span>
                        </div>
                        <Progress value={scan.score} className="h-1.5" />
                      </div>

                      {scan.tags && (
                        <div className="flex flex-wrap gap-1">
                          {scan.tags.slice(0, 2).map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="outline"
                              className="text-xs px-2 py-0.5 bg-slate-50 border-slate-200 text-slate-600"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
