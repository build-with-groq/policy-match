"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ApiClient, ApiError, type Policy, type Document } from "@/lib/api"
import { UI_CONFIG } from "@/lib/constants"

export function useHealthCheck() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await ApiClient.checkHealth()
        setIsHealthy(true)
      } catch (error) {
        setIsHealthy(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, UI_CONFIG.HEALTH_CHECK_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  return { isHealthy, isLoading }
}

export function usePolicies(
  page = UI_CONFIG.PAGINATION.DEFAULT_PAGE,
  pageSize = UI_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
) {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: UI_CONFIG.PAGINATION.DEFAULT_PAGE as number,
    pageSize: UI_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE as number,
    total: 0,
  })

  const fetchPolicies = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await ApiClient.getPolicies(page, pageSize)
      setPolicies(response.data.policies)
      setPagination({
        page: response.data.page,
        pageSize: response.data.page_size,
        total: response.data.total,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch policies")
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    fetchPolicies()
  }, [fetchPolicies])

  return { policies, loading, error, pagination, refetch: fetchPolicies }
}

export function useDocuments(
  page = UI_CONFIG.PAGINATION.DEFAULT_PAGE,
  pageSize = UI_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: UI_CONFIG.PAGINATION.DEFAULT_PAGE as number,
    pageSize: UI_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE as number,
    total: 0,
  })

  const shouldFetchRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchDocuments = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    if (!shouldFetchRef.current) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await ApiClient.getDocuments(page, pageSize)

      if (abortControllerRef.current?.signal.aborted) {
        return
      }

      setDocuments(response.data.documents)
      setPagination({
        page: response.data.page,
        pageSize: response.data.page_size,
        total: response.data.total,
      })
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) {
        return
      }
      setError(err instanceof Error ? err.message : "Failed to fetch documents")
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false)
      }
    }
  }, [page, pageSize])

  useEffect(() => {
    shouldFetchRef.current = true
    fetchDocuments()

    return () => {
      shouldFetchRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchDocuments])

  const refetch = useCallback(() => {
    shouldFetchRef.current = true
    fetchDocuments()
  }, [fetchDocuments])

  return { documents, loading, error, pagination, refetch }
}

export function useUpload(onRateLimitError?: (message: string) => void) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadDocument = async (file: File, policyId: string) => {
    try {
      setUploading(true)
      setError(null)
      const response = await ApiClient.uploadDocument(file, policyId)
      return response
    } catch (err) {
      if (err instanceof ApiError && err.isRateLimit) {
        // Handle rate limit error specially
        onRateLimitError?.(err.message)
        const errorMessage = "Rate limit reached. Please add your API key to continue."
        setError(errorMessage)
        throw err
      }
      const errorMessage = err instanceof Error ? err.message : "Upload failed"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const uploadPolicy = async (file: File, title: string, category: string) => {
    try {
      setUploading(true)
      setError(null)
      const response = await ApiClient.uploadPolicy(file, title, category)
      return response
    } catch (err) {
      if (err instanceof ApiError && err.isRateLimit) {
        onRateLimitError?.(err.message)
        const errorMessage = "Rate limit reached. Please add your API key to continue."
        setError(errorMessage)
        throw err
      }
      const errorMessage = err instanceof Error ? err.message : "Upload failed"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  return { uploadDocument, uploadPolicy, uploading, error }
}
