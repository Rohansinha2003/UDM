const API_BASE_URL = 'http://localhost:5000/api'

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
      headers: this.getAuthHeaders(),
      ...options
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

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
