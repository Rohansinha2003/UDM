import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'
import gemLogo from '../../assets/gem-new-logo-v6.png'
import apiService from '../../services/api'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/home')
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username) {
      newErrors.username = 'User Name is required'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setIsLoading(true)
    
    try {
      // Call real API for authentication
      const response = await apiService.login(formData.username, formData.password)
      
      if (response.success) {
        // Store token and user data in localStorage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        console.log('Login successful!', response.data)
        
        // Redirect to home page
        navigate('/home')
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ 
        general: error.message || 'Login failed. Please check your credentials.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="ireps-container">
      {/* Header Section */}
      <header className="ireps-header">
        <div className="header-top">
          <div className="header-left">
            <div className="emblem-section">
              <div className="logo-section">
                <div className="gem-logo">
                  <img src={gemLogo} alt="GeM Logo" className="gem-logo-img" />
                  <div className="gem-text">GeM</div>
                  <div className="gem-subtitle">Government e Marketplace</div>
                  <div className="gem-tagline">Efficient Transparent Inclusive</div>
                </div>
                <div className="ireps-logo">
                  <div className="ireps-text">IREPS</div>
                  <div className="ireps-subtitle">Indian Railways E-Procurement System</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="header-center">
            <h1>Government eMarketplace</h1>
            <h2>Indian Railways E-Procurement System</h2>
            <h3>User Depot Module</h3>
          </div>
          
          <div className="header-right">
            <div className="accessibility-options">
              <span className="font-size">A-</span>
              <span className="font-size active">A</span>
              <span className="font-size">A+</span>
              <div className="theme-toggle">
                <span className="moon">🌙</span>
                <span className="sun">☀️</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="header-nav">
          <div className="nav-item">
            <span className="home-icon">🏠</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ireps-main">
        <div className="login-card">
          <div className="login-header">
            <h1>Authenticate Yourself</h1>
            <p>(For Consignee Stores Users)</p>
            <div className="test-badge">
              <span className="test-label">Test IREPS Applet</span>
              <span className="new-tag">NEW</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">User Name</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            {errors.general && (
              <div className="error-message general-error">
                {errors.general}
              </div>
            )}
            
            <div className="form-buttons">
              <button 
                type="submit" 
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              <button type="button" className="home-button">Home</button>
            </div>
            
            <div className="security-notes">
              <p className="case-sensitive">User Name and Password are Case Sensitive</p>
              <p className="ip-logged">For security reason we have logged your system IP.</p>
            </div>
          </form>
          
          <div className="login-footer">
            <p>Don't have an account? <a href="#" onClick={() => navigate('/register')}>Register here</a></p>
          </div>
          
          <div className="additional-options">
            <div className="option-left">
              <h4>Change your Password</h4>
              <a href="#" className="option-link">• Click Here To Reset Password Using DSC</a>
            </div>
            <div className="option-right">
              <h4>Change your Signing Certificate</h4>
              <a href="#" className="option-link">• Click Here To Change your Signing Certificate</a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="ireps-footer">
        <div className="footer-left">
          <p>Developed by CRIS profileName= immsnode4</p>
        </div>
        <div className="footer-right">
          <a href="#">About IREPS</a>
          <a href="#">Disclaimer</a>
          <a href="#">Privacy Statement</a>
          <a href="#">RTI</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">CopyRight</a>
          <a href="#">Feedback</a>
        </div>
      </footer>
    </div>
  )
}

export default Login