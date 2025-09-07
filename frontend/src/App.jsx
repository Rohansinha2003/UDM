import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/pages/Login'
import Register from './components/pages/Register'
import Home from './components/pages/Home'
import './App.css'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
