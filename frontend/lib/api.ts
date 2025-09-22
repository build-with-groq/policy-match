const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
const API_VERSION = "v1"

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/${API_VERSION}/health`,
  DOCUMENT: `${API_BASE_URL}/api/${API_VERSION}/document`,
  POLICY: `${API_BASE_URL}/api/${API_VERSION}/policy`,
  POLICIES: `${API_BASE_URL}/api/${API_VERSION}/policies`,
  DOCUMENTS: `${API_BASE_URL}/api/${API_VERSION}/documents`,
  DELETE_DOCUMENT: (id: string) => `${API_BASE_URL}/api/${API_VERSION}/document/${id}`,
  DELETE_POLICY: (id: string) => `${API_BASE_URL}/api/${API_VERSION}/policy/${id}`,
  DELETE_RULE: (policyId: string, ruleId: string) =>
    `${API_BASE_URL}/api/${API_VERSION}/policy/${policyId}/rule/${ruleId}`,
  UPDATE_RULE: (policyId: string, ruleId: string) =>
    `${API_BASE_URL}/api/${API_VERSION}/policy/${policyId}/rule/${ruleId}`,
} as const

export interface Policy {
  policy_id: string
  title: string
  category: string
  extension: string
  rules: Array<{
    rule_id: string
    rule_text: string
  }>
  uploaded_at: string
}

export interface Document {
  document_id: string
  title: string
  policy_title: string
  path: string
  extension: string
  violations: string[]
  is_compliant: boolean
  is_human_review_required: boolean
  compliance_percentage: number
}

export interface Rule {
  rule_id: string
  rule_text: string
  title?: string
  category?: string
}

export interface ApiResponse<T> {
  data: T
  message: string
}

export interface PaginatedResponse<T> {
  data: {
    policies?: T[]
    documents?: T[]
    page_size: number
    page: number
    total: number
  }
  message: string
}

export interface PoliciesResponse {
  data: {
    policies: Policy[]
    page_size: number
    page: number
    total: number
  }
  message: string
}

export interface DocumentsResponse {
  data: {
    documents: Document[]
    page_size: number
    page: number
    total: number
  }
  message: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public isRateLimit: boolean = false
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiClient {
  private static getApiKey(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('groq_api_key')
    }
    return null
  }

  private static async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const apiKey = this.getApiKey()
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      }
      if (apiKey) {
        (headers as Record<string, string>)["X-API-Key"] = apiKey
      }

      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (response.status === 429) {
        const errorText = await response.text()
        throw new ApiError(
          errorText || "Rate limit exceeded. Please add your Groq API key to continue.",
          429,
          true
        )
      }

      if (!response.ok) {
        const errorText = await response.text()
        throw new ApiError(
          errorText || `HTTP error! status: ${response.status}`,
          response.status
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      console.error("API request failed:", error)
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        500
      )
    }
  }

  private static async uploadRequest<T>(url: string, formData: FormData): Promise<T> {
    try {
      // Add API key to headers if available
      const apiKey = this.getApiKey()
      const headers: HeadersInit = {}
      
      if (apiKey) {
        headers["X-API-Key"] = apiKey
      }

      const response = await fetch(url, {
        method: "POST",
        body: formData,
        headers,
      })

      if (response.status === 429) {
        const errorText = await response.text()
        throw new ApiError(
          errorText || "Rate limit exceeded. Please add your Groq API key to continue.",
          429,
          true
        )
      }

      if (!response.ok) {
        const errorText = await response.text()
        throw new ApiError(
          errorText || `HTTP error! status: ${response.status}`,
          response.status
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      console.error("Upload request failed:", error)
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error occurred",
        500
      )
    }
  }

  static async checkHealth(): Promise<ApiResponse<string>> {
    return this.request(API_ENDPOINTS.HEALTH)
  }

  static async uploadDocument(file: File, policyId: string): Promise<ApiResponse<any>> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("policy_id", policyId)

    return this.uploadRequest(API_ENDPOINTS.DOCUMENT, formData)
  }

  static async uploadPolicy(file: File, title: string, category: string): Promise<ApiResponse<any>> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", title)
    formData.append("category", category)

    return this.uploadRequest(API_ENDPOINTS.POLICY, formData)
  }

  static async getPolicies(page = 1, pageSize = 10): Promise<PoliciesResponse> {
    return this.request(`${API_ENDPOINTS.POLICIES}?page=${page}&page_size=${pageSize}`)
  }

  static async getDocuments(page = 1, pageSize = 10): Promise<DocumentsResponse> {
    return this.request(`${API_ENDPOINTS.DOCUMENTS}?page=${page}&page_size=${pageSize}`)
  }

  static async deleteDocument(documentId: string): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DELETE_DOCUMENT(documentId), {
      method: "DELETE",
    })
  }

  static async deletePolicy(policyId: string): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DELETE_POLICY(policyId), {
      method: "DELETE",
    })
  }

  static async deleteRule(policyId: string, ruleId: string): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.DELETE_RULE(policyId, ruleId), {
      method: "DELETE",
    })
  }

  static async updateRule(policyId: string, ruleId: string, ruleData: Partial<Rule>): Promise<ApiResponse<any>> {
    return this.request(API_ENDPOINTS.UPDATE_RULE(policyId, ruleId), {
      method: "PATCH",
      body: JSON.stringify(ruleData),
    })
  }
}
