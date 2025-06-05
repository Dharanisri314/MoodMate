import express from 'express'
import * as moodController from '../controllers/moodController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Protect all routes
router.use(protect)

// Create a new mood entry
router.post('/', moodController.createMood)

// Get all mood entries (with optional filtering)
router.get('/', moodController.getMoods)

// Get recent mood entries
router.get('/recent', moodController.getRecentMoods)

// Get mood statistics
router.get('/stats', moodController.getMoodStats)

// Get mood statistics by timeframe
router.get('/stats/:timeframe', moodController.getMoodStatsByTimeframe)

// Get a specific mood entry
router.get('/:id', moodController.getMood)

// Update a mood entry
router.put('/:id', moodController.updateMood)

// Delete a mood entry
router.delete('/:id', moodController.deleteMood)

export default router