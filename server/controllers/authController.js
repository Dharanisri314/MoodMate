import User from '../models/User.js'
import { generateToken } from '../middleware/auth.js'

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    
    // Check if user exists
    const userExists = await User.findOne({ email })
    
    if (userExists) {
      return res.status(400).json({
        message: 'User already exists'
      })
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password
    })
    
    // Generate JWT token
    const token = generateToken(user._id)
    
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    
    // Check if user exists
    const user = await User.findOne({ email }).select('+password')
    
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      })
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password)
    
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials'
      })
    }
    
    // Generate JWT token
    const token = generateToken(user._id)
    
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      message: 'Logged out successfully'
    })
  } catch (error) {
    next(error)
  }
}