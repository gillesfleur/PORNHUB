import { 
  ApiResponse, 
  PaginatedResponse, 
  AuthTokens, 
  LoginRequest, 
  RegisterRequest 
} from '../../types/api'

/**
 * Client API centralisé pour le frontend
 */
class ApiClient {
  private baseUrl: string = '/api'
  private isRefreshing = false
  private refreshSubscribers: ((token: string) => void)[] = []

  /**
   * Méthode de base pour effectuer des requêtes fetch
   */
  private async request<T>(
    method: string,
    url: string,
    body?: any,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    }

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(fullUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      })

      // Gestion du Refresh Token (401 Unauthorized)
      if (response.status === 401 && !url.includes('/auth/refresh') && !url.includes('/auth/login')) {
        if (!this.isRefreshing) {
          this.isRefreshing = true
          try {
            const tokens = await this.refreshToken()
            if (tokens) {
              this.isRefreshing = false
              this.onTokenRefreshed(tokens.accessToken)
              return this.request<T>(method, url, body, options, retryCount)
            }
          } catch (refreshError) {
            this.isRefreshing = false
            this.logout()
            throw refreshError
          }
        } else {
          // Attendre que le token soit rafraîchi par une autre requête
          return new Promise((resolve) => {
            this.subscribeTokenRefresh((token) => {
              resolve(this.request<T>(method, url, body, options, retryCount))
            })
          })
        }
      }

      // Gestion des autres erreurs
      if (!response.ok) {
        if (response.status === 403) {
          console.error('[API_FORBIDDEN] Accès non autorisé')
        } else if (response.status === 404) {
          console.warn(`[API_NOT_FOUND] ${fullUrl}`)
          return null as any
        } else if (response.status >= 500) {
          console.error('[API_SERVER_ERROR] Erreur serveur')
        }
        
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erreur HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      // Retry automatique une fois en cas d'erreur réseau
      if (retryCount === 0 && (error.name === 'TypeError' || error.message.includes('fetch'))) {
        return this.request<T>(method, url, body, options, 1)
      }
      throw error
    }
  }

  private subscribeTokenRefresh(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb)
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token))
    this.refreshSubscribers = []
  }

  // --- AUTH ---

  async login(data: LoginRequest): Promise<AuthTokens> {
    const res = await this.request<ApiResponse<AuthTokens>>('POST', '/auth/login', data)
    if (res.success && res.data) {
      localStorage.setItem('accessToken', res.data.accessToken)
      localStorage.setItem('refreshToken', res.data.refreshToken)
      return res.data
    }
    throw new Error(res.error || 'Login failed')
  }

  async register(data: RegisterRequest): Promise<AuthTokens> {
    const res = await this.request<ApiResponse<AuthTokens>>('POST', '/auth/register', data)
    if (res.success && res.data) {
      localStorage.setItem('accessToken', res.data.accessToken)
      localStorage.setItem('refreshToken', res.data.refreshToken)
      return res.data
    }
    throw new Error(res.error || 'Registration failed')
  }

  async refreshToken(): Promise<AuthTokens | null> {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) return null

    const res = await this.request<ApiResponse<AuthTokens>>('POST', '/auth/refresh', { refreshToken })
    if (res.success && res.data) {
      localStorage.setItem('accessToken', res.data.accessToken)
      return res.data
    }
    return null
  }

  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    this.request('POST', '/auth/logout').catch(() => {})
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  async getMe(): Promise<ApiResponse> {
    return this.request('GET', '/auth/me')
  }

  async updateMe(data: any): Promise<ApiResponse> {
    return this.request('PUT', '/auth/me', data)
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    return this.request('PUT', '/auth/me/password', { currentPassword, newPassword })
  }

  async deleteAccount(confirmation: boolean): Promise<ApiResponse> {
    return this.request('DELETE', '/auth/me', { confirmation })
  }

  // --- VIDEOS ---

  async getVideos(params?: any): Promise<PaginatedResponse> {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return this.request('GET', `/videos${query}`)
  }

  async getPopularVideos(params?: any): Promise<PaginatedResponse> {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return this.request('GET', `/videos/popular${query}`)
  }

  async getRecentVideos(params?: any): Promise<PaginatedResponse> {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return this.request('GET', `/videos/recent${query}`)
  }

  async getTopRatedVideos(params?: any): Promise<PaginatedResponse> {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return this.request('GET', `/videos/top-rated${query}`)
  }

  async getTrendingVideos(params?: any): Promise<PaginatedResponse> {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return this.request('GET', `/videos/trending${query}`)
  }

  async getVideo(slug: string): Promise<ApiResponse> {
    return this.request('GET', `/videos/${slug}`)
  }

  async getRelatedVideos(slug: string): Promise<ApiResponse> {
    return this.request('GET', `/videos/${slug}/related`)
  }

  async voteVideo(slug: string, type: 'like' | 'dislike'): Promise<ApiResponse> {
    return this.request('POST', `/videos/${slug}/vote`, { type })
  }

  async toggleFavorite(slug: string): Promise<ApiResponse> {
    return this.request('POST', `/videos/${slug}/favorite`)
  }

  async recordHistory(slug: string, data?: any): Promise<ApiResponse> {
    return this.request('POST', `/videos/${slug}/history`, data)
  }

  async reportVideo(slug: string, data: any): Promise<ApiResponse> {
    return this.request('POST', `/videos/${slug}/report`, data)
  }

  // --- CATEGORIES ---

  async getCategories(): Promise<ApiResponse> {
    return this.request('GET', '/categories')
  }

  async getCategory(slug: string, params?: any): Promise<ApiResponse> {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return this.request('GET', `/categories/${slug}${query}`)
  }

  // --- TAGS ---

  async getTags(params?: any): Promise<ApiResponse> {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return this.request('GET', `/tags${query}`)
  }

  async getPopularTags(): Promise<ApiResponse> {
    return this.request('GET', '/tags/popular')
  }

  async getTag(slug: string, params?: any): Promise<ApiResponse> {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return this.request('GET', `/tags/${slug}${query}`)
  }

  // --- ACTORS ---

  async getActors(params?: any): Promise<ApiResponse> {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return this.request('GET', `/actors${query}`)
  }

  async getActor(slug: string): Promise<ApiResponse> {
    return this.request('GET', `/actors/${slug}`)
  }

  async toggleSubscription(actorId: string): Promise<ApiResponse> {
    return this.request('POST', `/actors/${actorId}/subscribe`)
  }

  async getSubscriptions(): Promise<ApiResponse> {
    return this.request('GET', '/me/subscriptions')
  }

  // --- SEARCH ---

  async search(query: string, params?: any): Promise<PaginatedResponse> {
    const searchParams = new URLSearchParams({ q: query, ...params })
    return this.request('GET', `/search?${searchParams}`)
  }

  async searchSuggest(query: string): Promise<ApiResponse> {
    return this.request('GET', `/search/suggest?q=${encodeURIComponent(query)}`)
  }

  // --- USER SPACE ---

  async getFavorites(params?: any): Promise<PaginatedResponse> {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return this.request('GET', `/me/favorites${query}`)
  }

  async getHistory(params?: any): Promise<ApiResponse> {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return this.request('GET', `/me/history${query}`)
  }

  async clearHistory(): Promise<ApiResponse> {
    return this.request('DELETE', '/me/history')
  }

  async getPlaylists(): Promise<ApiResponse> {
    return this.request('GET', '/me/playlists')
  }

  async createPlaylist(data: any): Promise<ApiResponse> {
    return this.request('POST', '/me/playlists', data)
  }

  async getPlaylist(id: string): Promise<ApiResponse> {
    return this.request('GET', `/me/playlists/${id}`)
  }

  async updatePlaylist(id: string, data: any): Promise<ApiResponse> {
    return this.request('PUT', `/me/playlists/${id}`, data)
  }

  async deletePlaylist(id: string): Promise<ApiResponse> {
    return this.request('DELETE', `/me/playlists/${id}`)
  }

  async addToPlaylist(playlistId: string, videoId: string): Promise<ApiResponse> {
    return this.request('POST', `/me/playlists/${playlistId}/videos`, { videoId })
  }

  async removeFromPlaylist(playlistId: string, videoId: string): Promise<ApiResponse> {
    return this.request('DELETE', `/me/playlists/${playlistId}/videos/${videoId}`)
  }

  async getMyStats(): Promise<ApiResponse> {
    return this.request('GET', '/me/stats')
  }

  // --- COMMENTS ---

  async getComments(videoSlug: string, params?: any): Promise<PaginatedResponse> {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return this.request('GET', `/videos/${videoSlug}/comments${query}`)
  }

  async createComment(data: any): Promise<ApiResponse> {
    return this.request('POST', '/comments', data)
  }

  async updateComment(id: string, content: string): Promise<ApiResponse> {
    return this.request('PUT', `/comments/${id}`, { content })
  }

  async deleteComment(id: string): Promise<ApiResponse> {
    return this.request('DELETE', `/comments/${id}`)
  }

  async voteComment(id: string, type: 'like' | 'dislike'): Promise<ApiResponse> {
    return this.request('POST', `/comments/${id}/vote`, { type })
  }

  // --- ADS ---

  async getActiveAds(): Promise<ApiResponse> {
    return this.request('GET', '/ads/active')
  }

  // --- ADMIN ---

  get admin() {
    return {
      getStats: () => this.request<ApiResponse>('GET', '/admin/stats'),
      getActivity: () => this.request<ApiResponse>('GET', '/admin/activity'),
      getVideos: (params?: any) => {
        const query = params ? `?${new URLSearchParams(params)}` : ''
        return this.request<PaginatedResponse>('GET', `/admin/videos${query}`)
      },
      createVideo: (data: any) => this.request<ApiResponse>('POST', '/admin/videos', data),
      updateVideo: (id: string, data: any) => this.request<ApiResponse>('PUT', `/admin/videos/${id}`, data),
      deleteVideo: (id: string) => this.request<ApiResponse>('DELETE', `/admin/videos/${id}`),
      getUsers: (params?: any) => {
        const query = params ? `?${new URLSearchParams(params)}` : ''
        return this.request<PaginatedResponse>('GET', `/admin/users${query}`)
      },
      updateUser: (id: string, data: any) => this.request<ApiResponse>('PUT', `/admin/users/${id}`, data),
      deleteUser: (id: string) => this.request<ApiResponse>('DELETE', `/admin/users/${id}`),
      getCategories: () => this.request<ApiResponse>('GET', '/admin/categories'),
      createCategory: (data: any) => this.request<ApiResponse>('POST', '/admin/categories', data),
      updateCategory: (id: string, data: any) => this.request<ApiResponse>('PUT', `/admin/categories/${id}`, data),
      deleteCategory: (id: string) => this.request<ApiResponse>('DELETE', `/admin/categories/${id}`),
      getTags: (params?: any) => {
        const query = params ? `?${new URLSearchParams(params)}` : ''
        return this.request<PaginatedResponse>('GET', `/admin/tags${query}`)
      },
      deleteTag: (id: string) => this.request<ApiResponse>('DELETE', `/admin/tags/${id}`),
      mergeTags: (data: any) => this.request<ApiResponse>('POST', '/admin/tags/merge', data),
      getComments: (params?: any) => {
        const query = params ? `?${new URLSearchParams(params)}` : ''
        return this.request<PaginatedResponse>('GET', `/admin/comments${query}`)
      },
      updateCommentStatus: (id: string, status: string) => this.request<ApiResponse>('PUT', `/admin/comments/${id}/status`, { status }),
      getReports: (params?: any) => {
        const query = params ? `?${new URLSearchParams(params)}` : ''
        return this.request<PaginatedResponse>('GET', `/admin/reports${query}`)
      },
      resolveReport: (id: string) => this.request<ApiResponse>('PUT', `/admin/reports/${id}`, { status: 'resolved' }),
      getAds: () => this.request<ApiResponse>('GET', '/admin/ads'),
      createAd: (data: any) => this.request<ApiResponse>('POST', '/admin/ads', data),
      updateAd: (id: string, data: any) => this.request<ApiResponse>('PUT', `/admin/ads/${id}`, data),
      deleteAd: (id: string) => this.request<ApiResponse>('DELETE', `/admin/ads/${id}`),
      getSettings: () => this.request<ApiResponse>('GET', '/admin/settings'),
      updateSettings: (data: any) => this.request<ApiResponse>('PUT', '/admin/settings', data),
      getSources: () => this.request<ApiResponse>('GET', '/admin/sources'),
      syncSource: (id: string) => this.request<ApiResponse>('POST', `/admin/sources/${id}/sync`),
      testSource: (id: string) => this.request<ApiResponse>('GET', `/admin/sources/${id}/test`),
      getSourceLogs: (id: string) => this.request<ApiResponse>('GET', `/admin/sources/${id}/logs`),
    }
  }
}

export const api = new ApiClient()
