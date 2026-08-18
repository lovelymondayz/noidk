const API_URL = '/api'

class ApiClient {
  private baseUrl: string
  private getToken: () => string | null

  constructor(baseUrl: string, getToken: () => string | null) {
    this.baseUrl = baseUrl
    this.getToken = getToken
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error?.error?.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  get<T>(path: string) {
    return this.request<T>(path)
  }

  post<T>(path: string, data?: unknown) {
    return this.request<T>(path, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  patch<T>(path: string, data?: unknown) {
    return this.request<T>(path, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' })
  }
}

let apiClient: ApiClient | null = null

export function initializeApi(getToken: () => string | null) {
  apiClient = new ApiClient(API_URL, getToken)
  return apiClient
}

export function getApi(): ApiClient {
  if (!apiClient) throw new Error('API client not initialized')
  return apiClient
}

export { API_URL }
