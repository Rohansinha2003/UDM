import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'
import gemLogo from '../../assets/gem-new-logo-v6.png'
import apiService from '../../services/api'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'General'
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
    
    // Clear error when user starts typing
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
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      // Call registration API
      const response = await apiService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        department: formData.department
      })
      
      if (response.success) {
        // Store token and user data in localStorage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        console.log('Registration successful!', response.data)
        
        // Redirect to home page
        navigate('/home')
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ 
        general: error.message || 'Registration failed. Please try again.' 
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
            <h3>User Registration</h3>
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
            <h1>Create New Account</h1>
            <p>Register for IREPS User Depot Module</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'error' : ''}
                placeholder="Enter your username"
                disabled={isLoading}
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
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
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={isLoading}
                className="form-select"
              >
                <option value="General">General</option>
                <option value="Procurement">Procurement</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
              </select>
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
                {isLoading ? 'Creating Account...' : 'Register'}
              </button>
              <button 
                type="button" 
                className="home-button"
                onClick={() => navigate('/')}
              >
                Back to Login
              </button>
            </div>
            
            <div className="security-notes">
              <p className="case-sensitive">Username and Email must be unique</p>
              <p className="ip-logged">Password must be at least 6 characters long</p>
            </div>
          </form>
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

export default Register
