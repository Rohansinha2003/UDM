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
      console.log('Making API request to:', url)
      console.log('Request config:', config)
      
      const response = await fetch(url, config)
      
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API error response:', errorData)
        
        // Handle authentication errors
        if (response.status === 401) {
          // Clear invalid token
          localStorage.removeItem('token')
          // Redirect to login if not already there
          if (window.location.pathname !== '/') {
            window.location.href = '/'
          }
          throw new Error('Authentication required. Please log in again.')
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API response data:', data)
      return data
    } catch (error) {
      console.error('API request failed:', error)
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.')
      }
      
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

  // Product methods
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/products${queryString ? `?${queryString}` : ''}`)
  }

  async getProduct(id) {
    return this.request(`/products/${id}`)
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    })
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    })
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    })
  }

  async getProductStats() {
    return this.request('/products/stats/overview')
  }

  // Entry methods
  async getEntries(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/entries${queryString ? `?${queryString}` : ''}`)
  }

  async getEntriesByProduct(productId, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/entries/product/${productId}${queryString ? `?${queryString}` : ''}`)
  }

  async getEntry(id) {
    return this.request(`/entries/${id}`)
  }

  async createEntry(entryData) {
    return this.request('/entries', {
      method: 'POST',
      body: JSON.stringify(entryData)
    })
  }

  async updateEntry(id, entryData) {
    return this.request(`/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entryData)
    })
  }

  async deleteEntry(id) {
    return this.request(`/entries/${id}`, {
      method: 'DELETE'
    })
  }

  async getEntryStats() {
    return this.request('/entries/stats/overview')
  }
}

export default new ApiService()
