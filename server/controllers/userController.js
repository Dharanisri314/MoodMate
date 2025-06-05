import User from '../models/User.js'

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }
    
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body
    
    // Find user
    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }
    
    // Update fields
    if (name) user.name = name
    if (email) user.email = email
    
    // Save updated user
    await user.save()
    
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    // Find user with password
    const user = await User.findById(req.user._id).select('+password')
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }
    
    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword)
    
    if (!isMatch) {
      return res.status(401).json({
        message: 'Current password is incorrect'
      })
    }
    
    // Update password
    user.password = newPassword
    await user.save()
    
    res.status(200).json({
      message: 'Password updated successfully'
    })
  } catch (error) {
    next(error)
  }
}