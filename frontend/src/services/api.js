const API_BASE_URL = 'http://localhost:3001/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Get auth headers with token
  getAuthHeaders() {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      method: 'GET',
      headers: this.getAuthHeaders(),
      mode: 'cors',
      credentials: 'include',
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Authentication methods
  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    })
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    })
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }
}

export default new ApiService()
