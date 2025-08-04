"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, FileText, Upload, Loader2, Shield, Edit, Trash2, Save, X } from "lucide-react"
import { usePolicies, useUpload } from "@/hooks/use-api"
import { ApiClient, type Policy } from "@/lib/api"
import { cn } from "@/lib/utils"

interface PolicySelectorProps {
  selectedPolicy: Policy | null
  onPolicySelect: (policy: Policy) => void
  className?: string
}

export function PolicySelector({ selectedPolicy, onPolicySelect, className }: PolicySelectorProps) {
  const { policies, loading, error, refetch } = usePolicies()
  const { uploadPolicy, uploading } = useUpload()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newPolicyData, setNewPolicyData] = useState({
    title: "",
    category: "",
    file: null as File | null,
  })
  const [editingRule, setEditingRule] = useState<{ policyId: string; ruleId: string; text: string } | null>(null)
  const [deletingPolicy, setDeletingPolicy] = useState<string | null>(null)
  const [deletingRule, setDeletingRule] = useState<{ policyId: string; ruleId: string } | null>(null)

  const handleCreatePolicy = async () => {
    if (!newPolicyData.file || !newPolicyData.title || !newPolicyData.category) {
      return
    }

    try {
      await uploadPolicy(newPolicyData.file, newPolicyData.title, newPolicyData.category)
      setShowCreateDialog(false)
      setNewPolicyData({ title: "", category: "", file: null })
      refetch()
    } catch (error) {
      console.error("Failed to create policy:", error)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setNewPolicyData((prev) => ({ ...prev, file }))
    }
  }

  const handleDeletePolicy = async (policyId: string) => {
    try {
      setDeletingPolicy(policyId)
      await ApiClient.deletePolicy(policyId)
      refetch()
      if (selectedPolicy?.policy_id === policyId) {
        onPolicySelect(policies.find((p) => p.policy_id !== policyId) || policies[0])
      }
    } catch (error) {
      console.error("Failed to delete policy:", error)
    } finally {
      setDeletingPolicy(null)
    }
  }

  const handleDeleteRule = async (policyId: string, ruleId: string) => {
    try {
      setDeletingRule({ policyId, ruleId })
      await ApiClient.deleteRule(policyId, ruleId)
      refetch()
    } catch (error) {
      console.error("Failed to delete rule:", error)
    } finally {
      setDeletingRule(null)
    }
  }

  const handleUpdateRule = async () => {
    if (!editingRule) return

    try {
      await ApiClient.updateRule(editingRule.policyId, editingRule.ruleId, {
        rule_text: editingRule.text,
      })
      setEditingRule(null)
      refetch()
    } catch (error) {
      console.error("Failed to update rule:", error)
    }
  }

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm text-slate-600">Loading policy frameworks...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("space-y-4", className)}>
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-sm text-red-700">Failed to load policies: {error}</p>
          <Button variant="outline" size="sm" onClick={refetch} className="mt-2 bg-transparent">
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-slate-900">Policy Frameworks</h3>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Policy Framework</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Policy Title</Label>
                <Input
                  id="title"
                  value={newPolicyData.title}
                  onChange={(e) => setNewPolicyData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Consumer Credit Policy"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newPolicyData.category}
                  onChange={(e) => setNewPolicyData((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Credit, Mortgage, Cards"
                />
              </div>
              <div>
                <Label htmlFor="file">Policy Document</Label>
                <Input id="file" type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange} />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCreatePolicy}
                  disabled={uploading || !newPolicyData.file || !newPolicyData.title || !newPolicyData.category}
                  className="flex-1"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Create Policy
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {policies.length === 0 ? (
        <Card className="p-8 text-center border-dashed border-2 border-slate-300">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Policy Frameworks Found</h3>
          <p className="text-slate-600 mb-4">Create your first policy framework to get started.</p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Policy Framework
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {policies.map((policy) => (
            <Card
              key={policy.policy_id}
              className={cn(
                "transition-all duration-200 hover:shadow-md",
                selectedPolicy?.policy_id === policy.policy_id
                  ? "ring-2 ring-green-500 bg-green-50 border-green-200"
                  : "hover:border-slate-300",
              )}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 cursor-pointer" onClick={() => onPolicySelect(policy)}>
                    <h4 className="font-semibold text-slate-900 mb-1">{policy.title}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {policy.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {policy.extension}
                      </Badge>
                      {selectedPolicy?.policy_id === policy.policy_id && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">Selected</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">
                      {policy.rules.length} rule{policy.rules.length !== 1 ? "s" : ""} • Uploaded{" "}
                      {new Date(policy.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Delete Policy Framework</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-slate-600">
                          Are you sure you want to delete "{policy.title}"? This will also delete all associated rules.
                          This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            onClick={() => handleDeletePolicy(policy.policy_id)}
                            disabled={deletingPolicy === policy.policy_id}
                            className="flex-1"
                          >
                            {deletingPolicy === policy.policy_id ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Policy
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {policy.rules.length > 0 && (
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="rules" className="border-0">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <FileText className="w-4 h-4" />
                          View Compliance Rules ({policy.rules.length})
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2">
                        <div className="space-y-2">
                          {policy.rules.map((rule) => (
                            <div key={rule.rule_id} className="bg-slate-50 rounded p-3 border border-slate-200">
                              <div className="flex items-start justify-between gap-2">
                                {editingRule?.ruleId === rule.rule_id ? (
                                  <div className="flex-1 space-y-2">
                                    <textarea
                                      value={editingRule.text}
                                      onChange={(e) =>
                                        setEditingRule((prev) => (prev ? { ...prev, text: e.target.value } : null))
                                      }
                                      className="w-full p-2 text-sm border border-slate-300 rounded resize-none"
                                      rows={3}
                                    />
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={handleUpdateRule}>
                                        <Save className="w-3 h-3 mr-1" />
                                        Save
                                      </Button>
                                      <Button variant="outline" size="sm" onClick={() => setEditingRule(null)}>
                                        <X className="w-3 h-3 mr-1" />
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-sm text-slate-700 flex-1">{rule.rule_text}</p>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 hover:bg-blue-50"
                                        onClick={() =>
                                          setEditingRule({
                                            policyId: policy.policy_id,
                                            ruleId: rule.rule_id,
                                            text: rule.rule_text,
                                          })
                                        }
                                      >
                                        <Edit className="w-3 h-3 text-blue-500" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 hover:bg-red-50"
                                        onClick={() => handleDeleteRule(policy.policy_id, rule.rule_id)}
                                        disabled={
                                          deletingRule?.policyId === policy.policy_id &&
                                          deletingRule?.ruleId === rule.rule_id
                                        }
                                      >
                                        {deletingRule?.policyId === policy.policy_id &&
                                        deletingRule?.ruleId === rule.rule_id ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <Trash2 className="w-3 h-3 text-red-500" />
                                        )}
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
