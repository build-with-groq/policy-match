"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Shield, Settings, User, LogOut, Bell, Search } from "lucide-react"
import { SystemStatus } from "@/components/system-status"

export function TopNavigation() {
  const [notifications] = useState(2)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-professional">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">PolicyMatch</h1>
            <p className="text-xs text-slate-500">Compliance Analysis</p>
          </div>
        </div>

        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents, policies, or clauses..."
              className={`w-80 h-9 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                isSearchFocused ? "bg-white shadow-elevated" : ""
              }`}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SystemStatus />

        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 hover:bg-slate-100 transition-colors duration-200"
        >
          <Bell className="h-4 w-4 text-slate-600" />
          {notifications > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
              {notifications}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 hover:bg-slate-100 transition-colors duration-200">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback className="bg-slate-200 text-slate-700 text-sm font-medium">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white border-slate-200 shadow-deep" align="end">
            <div className="p-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                  <AvatarFallback className="bg-slate-200 text-slate-700 font-medium">JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-900">John Doe</p>
                  <p className="text-sm text-slate-500">Compliance Officer</p>
                </div>
              </div>
            </div>
            <DropdownMenuItem className="hover:bg-slate-50 focus:bg-slate-50">
              <User className="mr-3 h-4 w-4 text-slate-500" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-50 focus:bg-slate-50">
              <Settings className="mr-3 h-4 w-4 text-slate-500" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem className="hover:bg-red-50 focus:bg-red-50 text-red-600">
              <LogOut className="mr-3 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
