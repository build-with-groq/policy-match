"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  MessageCircle,
  Download,
  Flag,
  Check,
  TrendingUp,
  AlertTriangle,
  Clock,
  Users,
  FileText,
  BarChart3,
  Target,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Clause {
  id: number
  title: string
  excerpt: string
  status: "pass" | "fail"
  confidence: number
  comments: number
}

interface RightDetailsPanelProps {
  selectedScan: any
  clauses: Clause[]
  open: boolean
  onToggle: () => void
  isMobile: boolean
}

export function RightDetailsPanel({ selectedScan, clauses, open, onToggle, isMobile }: RightDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!selectedScan) {
    return null
  }

  const complianceScore = selectedScan.score
  const passedClauses = clauses.filter((c) => c.status === "pass").length
  const failedClauses = clauses.filter((c) => c.status === "fail").length

  if (isMobile) {
    return (
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 transition-transform duration-300 z-50 shadow-deep",
          open ? "translate-y-0" : "translate-y-[calc(100%-60px)]",
        )}
      >
        <div className="p-4 border-b border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            className="w-full hover:bg-slate-50 transition-colors duration-200"
            onClick={onToggle}
          >
            <div className="flex items-center gap-3">
              {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <span className="font-medium">Compliance Details</span>
              <Badge className="bg-slate-800 text-white">{complianceScore}%</Badge>
            </div>
          </Button>
        </div>

        {open && (
          <div className="max-h-[70vh] overflow-auto p-4">
            <ComplianceContent
              complianceScore={complianceScore}
              passedClauses={passedClauses}
              failedClauses={failedClauses}
              clauses={clauses}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "bg-white border-l border-slate-200 transition-all duration-300 ease-out relative shadow-professional",
        open ? "w-96" : "w-16",
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className="absolute -left-3 top-4 z-10 h-6 w-6 rounded-full border bg-white shadow-professional hover:shadow-elevated transition-all duration-200"
        onClick={onToggle}
      >
        {open ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      {open && (
        <div className="h-full overflow-auto p-4">
          <ComplianceContent
            complianceScore={complianceScore}
            passedClauses={passedClauses}
            failedClauses={failedClauses}
            clauses={clauses}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      )}
    </div>
  )
}

interface ComplianceContentProps {
  complianceScore: number
  passedClauses: number
  failedClauses: number
  clauses: Clause[]
  activeTab: string
  onTabChange: (tab: string) => void
}

function ComplianceContent({
  complianceScore,
  passedClauses,
  failedClauses,
  clauses,
  activeTab,
  onTabChange,
}: ComplianceContentProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Compliance Dashboard</h2>
        <p className="text-slate-500 text-sm">AI-powered analysis</p>
      </div>

      <Card className="shadow-professional hover:shadow-elevated transition-all duration-300 overflow-hidden bg-white">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#1e293b"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${complianceScore * 2.51} 251`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900">{complianceScore}%</span>
                <span className="text-xs text-slate-500">Score</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center justify-center gap-2 text-green-700 mb-1">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-bold text-lg">{passedClauses}</span>
                </div>
                <p className="text-sm font-medium text-green-800">Compliant</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="flex items-center justify-center gap-2 text-red-700 mb-1">
                  <XCircle className="h-5 w-5" />
                  <span className="font-bold text-lg">{failedClauses}</span>
                </div>
                <p className="text-sm font-medium text-red-800">Issues</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-professional transition-all duration-200"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="clauses"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-professional transition-all duration-200"
          >
            <FileText className="w-4 h-4 mr-2" />
            Clauses
          </TabsTrigger>
          <TabsTrigger
            value="insights"
            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-professional transition-all duration-200"
          >
            <Target className="w-4 h-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 bg-blue-50 border-blue-200 hover:shadow-professional transition-all duration-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-700">+12%</p>
                  <p className="text-xs text-blue-600">vs Last Scan</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 bg-slate-50 border-slate-200 hover:shadow-professional transition-all duration-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-700">2.3s</p>
                  <p className="text-xs text-slate-600">Scan Time</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4 shadow-professional bg-white">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 w-4 text-amber-500" />
              Risk Assessment
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Data Privacy</span>
                <div className="flex items-center gap-2">
                  <Progress value={85} className="w-16 h-2" />
                  <Badge className="bg-green-100 text-green-700 text-xs border-green-200">Low Risk</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Consent Management</span>
                <div className="flex items-center gap-2">
                  <Progress value={65} className="w-16 h-2" />
                  <Badge className="bg-amber-100 text-amber-700 text-xs border-amber-200">Medium Risk</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Data Retention</span>
                <div className="flex items-center gap-2">
                  <Progress value={45} className="w-16 h-2" />
                  <Badge className="bg-red-100 text-red-700 text-xs border-red-200">High Risk</Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="clauses" className="space-y-3 mt-4">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {clauses.map((clause) => (
              <AccordionItem key={clause.id} value={`clause-${clause.id}`} className="border-0">
                <Card className="shadow-professional hover:shadow-elevated transition-all duration-200 overflow-hidden bg-white">
                  <AccordionTrigger className="px-4 py-3 hover:bg-slate-50">
                    <div className="flex items-center gap-3 text-left w-full">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          clause.status === "pass" ? "bg-green-100" : "bg-red-100",
                        )}
                      >
                        {clause.status === "pass" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-slate-900">{clause.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            className={cn(
                              "text-xs font-medium",
                              clause.status === "pass"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-red-100 text-red-700 border-red-200",
                            )}
                          >
                            {clause.confidence}% Confidence
                          </Badge>
                          {clause.comments > 0 && (
                            <div className="flex items-center gap-1 text-slate-500">
                              <MessageCircle className="h-3 w-3" />
                              <span className="text-xs">{clause.comments}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-3 pt-2">
                      <p className="text-sm text-slate-600 leading-relaxed">{clause.excerpt}</p>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium text-slate-700">Confidence Level</span>
                          <span className="font-semibold text-slate-900">{clause.confidence}%</span>
                        </div>
                        <Progress value={clause.confidence} className="h-2" />
                      </div>
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4 mt-4">
          <Card className="p-4 shadow-professional bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              AI Recommendations
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Update Consent Language</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Consider updating consent mechanisms to be more explicit and user-friendly.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Data Retention Policy</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Specify clear data retention periods for different types of personal data.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 shadow-professional bg-white">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-600" />
              Team Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 text-xs font-medium">
                  JD
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">John reviewed 3 clauses</p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-slate-700 text-xs font-medium">
                  SM
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Sarah added 2 comments</p>
                  <p className="text-xs text-slate-500">4 hours ago</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="space-y-3 pt-4 border-t border-slate-100">
        <Button className="w-full btn-primary font-medium h-10">
          <Check className="h-4 w-4 mr-2" />
          Approve All Changes
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="btn-secondary text-sm bg-transparent">
            <Flag className="h-4 w-4 mr-2 text-amber-500" />
            Flag Issues
          </Button>
          <Button variant="outline" className="btn-secondary text-sm bg-transparent">
            <Download className="h-4 w-4 mr-2 text-slate-500" />
            Export
          </Button>
        </div>
      </div>
    </div>
  )
}
