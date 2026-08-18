import { getApi } from './api'

export interface AuthResponse {
  user: {
    id: string
    username: string
    email: string
    avatarUrl?: string
    bio?: string
    level: number
    lifetimeXp: number
    monthlyXp: number
  }
  accessToken: string
  refreshToken: string
}

export const authService = {
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    return getApi().post<AuthResponse>('/auth/register', { username, email, password })
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return getApi().post<AuthResponse>('/auth/login', { email, password })
  },

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    return getApi().post<{ accessToken: string }>('/auth/refresh', { refreshToken })
  },

  async logout(): Promise<void> {
    return getApi().post<void>('/auth/logout')
  },
}
