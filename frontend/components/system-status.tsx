"use client"
import { Activity, AlertCircle, CheckCircle } from "lucide-react"
import { useHealthCheck } from "@/hooks/use-api"

export function SystemStatus() {
  const { isHealthy, isLoading } = useHealthCheck()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-md">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
        <Activity className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700">Checking...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-md">
      <div className={`w-2 h-2 rounded-full ${isHealthy ? "bg-green-500" : "bg-red-500"}`}></div>
      {isHealthy ? (
        <CheckCircle className="w-4 h-4 text-green-600" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-600" />
      )}
      <span className="text-sm font-medium text-slate-700">{isHealthy ? "System Active" : "System Offline"}</span>
    </div>
  )
}
