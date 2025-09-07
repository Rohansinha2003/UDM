import React from 'react'
import { useNavigate } from 'react-router-dom'
import './home.css'
import apiService from '../../services/api'

const Home = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // Call logout API
      await apiService.logout()
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Clear local storage and redirect
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/')
    }
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="home-header">
        <div className="header-top">
          <div className="header-left">
            <div className="logo-section">
              <div className="gem-logo">
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
          
          <div className="header-center">
            <h1>Government eMarketplace</h1>
            <h2>Indian Railways E-Procurement System</h2>
            <h3>User Depot Module</h3>
          </div>
          
          <div className="header-right">
            <div className="user-info">
              <span className="welcome-text">Welcome, {user.username || 'User'}</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          </div>
        </div>
        
        <div className="header-nav">
          <div className="nav-item active">
            <span className="home-icon">🏠</span>
            <span>Home</span>
          </div>
          <div className="nav-item">
            <span className="dashboard-icon">📊</span>
            <span>Dashboard</span>
          </div>
          <div className="nav-item">
            <span className="procurement-icon">📋</span>
            <span>Procurement</span>
          </div>
          <div className="nav-item">
            <span className="reports-icon">📈</span>
            <span>Reports</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="home-main">
        <div className="welcome-section">
          <h1>Welcome to IREPS Dashboard</h1>
          <p>Indian Railways E-Procurement System - User Depot Module</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Dashboard</h3>
            <p>View your procurement dashboard and statistics</p>
            <button className="card-button"onClick={() => navigate("/dashboard")} >View Dashboard</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>Active Tenders</h3>
            <p>Browse and participate in active tenders</p>
            <button className="card-button">View Tenders</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📝</div>
            <h3>Create Tender</h3>
            <p>Create new procurement tenders</p>
            <button className="card-button">Create Tender</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📈</div>
            <h3>Reports</h3>
            <p>Generate and view procurement reports</p>
            <button className="card-button">View Reports</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>Vendors</h3>
            <p>Manage vendor information and registrations</p>
            <button className="card-button">Manage Vendors</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Configure your account and system settings</p>
            <button className="card-button">Settings</button>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <h4>Tender Submitted Successfully</h4>
                <p>Tender #IREPS-2024-001 submitted for Railway Equipment</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📧</div>
              <div className="activity-content">
                <h4>New Vendor Registration</h4>
                <p>ABC Industries registered for Electronics category</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📋</div>
              <div className="activity-content">
                <h4>Tender Evaluation Completed</h4>
                <p>Evaluation completed for Tender #IREPS-2024-002</p>
                <span className="activity-time">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="home-footer">
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

export default Home
