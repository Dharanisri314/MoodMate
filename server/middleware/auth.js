import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Middleware to protect routes - checks if user is authenticated
export const protect = async (req, res, next) => {
  try {
    let token
    
    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        message: 'Not authorized to access this route'
      })
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Get user from the token
      req.user = await User.findById(decoded.id)
      
      if (!req.user) {
        return res.status(401).json({
          message: 'User not found'
        })
      }
      
      next()
    } catch (error) {
      return res.status(401).json({
        message: 'Not authorized to access this route'
      })
    }
  } catch (error) {
    next(error)
  }
}

// Generate JWT token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}