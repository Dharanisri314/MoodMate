import express from 'express'
import * as userController from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Protect all routes
router.use(protect)

// Get current user
router.get('/me', userController.getCurrentUser)

// Update user profile
router.put('/me', userController.updateProfile)

// Update user password
router.put('/password', userController.updatePassword)

export default router