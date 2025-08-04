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
import { Plus, FileText, Upload, Loader2, Shield, Edit, Trash2, Save, X, Settings } from "lucide-react"
import { usePolicies, useUpload } from "@/hooks/use-api"
import { ApiClient } from "@/lib/api"
import { cn } from "@/lib/utils"

interface PolicyManagementProps {
  className?: string
}

export function PolicyManagement({ className }: PolicyManagementProps) {
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
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Policy Framework Management</h2>
            <p className="text-sm text-slate-600">Create and manage compliance policy frameworks</p>
          </div>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Policy Framework
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
                  className="flex-1 bg-green-600 hover:bg-green-700"
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
        <Card className="p-12 text-center border-dashed border-2 border-slate-300">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-2xl flex items-center justify-center">
            <Shield className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-xl font-medium text-slate-900 mb-3">No Policy Frameworks Found</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Create your first policy framework to start analyzing customer documents for compliance.
          </p>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Policy Framework
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {policies.map((policy) => (
            <Card key={policy.policy_id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
              <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-b border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{policy.title}</h3>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-green-100 text-green-700 border-green-200">{policy.category}</Badge>
                        <Badge variant="outline" className="bg-white">
                          {policy.extension}
                        </Badge>
                        <Badge variant="outline" className="bg-white">
                          {policy.rules.length} rules
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        Created {new Date(policy.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
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
              </div>

              {policy.rules.length > 0 && (
                <div className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="rules" className="border-0">
                      <AccordionTrigger className="py-3 hover:no-underline">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-medium text-slate-900">Compliance Rules</h4>
                            <p className="text-sm text-slate-600">{policy.rules.length} rules defined</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="space-y-4">
                          {policy.rules.map((rule, index) => (
                            <div key={rule.rule_id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                  <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                                </div>

                                <div className="flex-1">
                                  {editingRule?.ruleId === rule.rule_id ? (
                                    <div className="space-y-3">
                                      <textarea
                                        value={editingRule.text}
                                        onChange={(e) =>
                                          setEditingRule((prev) => (prev ? { ...prev, text: e.target.value } : null))
                                        }
                                        className="w-full p-3 text-sm border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={4}
                                        placeholder="Enter rule text..."
                                      />
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          onClick={handleUpdateRule}
                                          className="bg-blue-600 hover:bg-blue-700"
                                        >
                                          <Save className="w-3 h-3 mr-1" />
                                          Save Changes
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setEditingRule(null)}>
                                          <X className="w-3 h-3 mr-1" />
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="group">
                                      <p className="text-sm text-slate-700 leading-relaxed mb-3">{rule.rule_text}</p>
                                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 px-3 text-blue-600 hover:bg-blue-50"
                                          onClick={() =>
                                            setEditingRule({
                                              policyId: policy.policy_id,
                                              ruleId: rule.rule_id,
                                              text: rule.rule_text,
                                            })
                                          }
                                        >
                                          <Edit className="w-3 h-3 mr-1" />
                                          Edit
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-8 px-3 text-red-600 hover:bg-red-50"
                                          onClick={() => handleDeleteRule(policy.policy_id, rule.rule_id)}
                                          disabled={
                                            deletingRule?.policyId === policy.policy_id &&
                                            deletingRule?.ruleId === rule.rule_id
                                          }
                                        >
                                          {deletingRule?.policyId === policy.policy_id &&
                                          deletingRule?.ruleId === rule.rule_id ? (
                                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                          ) : (
                                            <Trash2 className="w-3 h-3 mr-1" />
                                          )}
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
