export type UserRole = 'USER' | 'ADMIN'

export interface User {
  id: string
  username: string
  email: string
  avatarUrl?: string | null
  role: UserRole
  bio?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type Quality = '240p' | '360p' | '480p' | '720p' | '1080p' | '4k'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: any
}

export interface PaginatedResponse<T = any> extends ApiResponse<any> {
  pagination?: {
    total: number
    page: number
    perPage: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}
