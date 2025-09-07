const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId)
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user no longer exists'
      })
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      })
    }

    // Add user info to request
    req.userId = user._id
    req.user = user
    
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      })
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    })
  }
}

module.exports = auth
