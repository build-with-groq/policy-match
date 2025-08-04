"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HelpCircle, Clock, Activity, Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="h-12 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-sm shadow-professional">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full status-dot status-success"></div>
            <Clock className="h-4 w-4 text-slate-500" />
            <span className="text-slate-700 font-medium">Last scan: 2 minutes ago</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-slate-100 text-slate-700 border-slate-200 font-medium px-2 py-1">
            <Activity className="w-3 h-3 mr-1" />
            OCR: 98.5%
          </Badge>
          <Badge className="bg-green-100 text-green-700 border-green-200 font-medium px-2 py-1">
            <Shield className="w-3 h-3 mr-1" />
            Secure
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors duration-200"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Help
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">PolicyMatch</span>
          <Badge variant="outline" className="text-xs bg-white border-slate-200 text-slate-600">
            v2.1.0
          </Badge>
        </div>
      </div>
    </footer>
  )
}
