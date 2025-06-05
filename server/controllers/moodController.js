import Mood from '../models/Mood.js'

// @desc    Create a new mood entry
// @route   POST /api/moods
// @access  Private
export const createMood = async (req, res, next) => {
  try {
    const { value, notes, activities, date } = req.body
    
    // Format date to start of day to ensure one entry per day
    const moodDate = date ? new Date(date) : new Date()
    moodDate.setHours(0, 0, 0, 0)
    
    // Check if entry already exists for this day
    const existingMood = await Mood.findOne({
      user: req.user._id,
      date: {
        $gte: moodDate,
        $lt: new Date(moodDate.getTime() + 24 * 60 * 60 * 1000)
      }
    })
    
    if (existingMood) {
      // Update existing mood instead of creating new one
      existingMood.value = value
      existingMood.notes = notes
      existingMood.activities = activities
      
      await existingMood.save()
      
      return res.status(200).json(existingMood)
    }
    
    // Create new mood entry
    const mood = await Mood.create({
      user: req.user._id,
      value,
      notes,
      activities,
      date: moodDate
    })
    
    res.status(201).json(mood)
  } catch (error) {
    next(error)
  }
}

// @desc    Get all mood entries for current user
// @route   GET /api/moods
// @access  Private
export const getMoods = async (req, res, next) => {
  try {
    const { year, month, limit = 100, page = 1 } = req.query
    
    // Build date filter if year/month provided
    let dateFilter = {}
    
    if (year && month) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0)
      
      dateFilter = {
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }
    }
    
    // Get moods with pagination
    const moods = await Mood.find({
      user: req.user._id,
      ...dateFilter
    })
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
    
    res.status(200).json(moods)
  } catch (error) {
    next(error)
  }
}

// @desc    Get recent mood entries
// @route   GET /api/moods/recent
// @access  Private
export const getRecentMoods = async (req, res, next) => {
  try {
    const moods = await Mood.find({
      user: req.user._id
    })
      .sort({ date: -1 })
      .limit(5)
    
    res.status(200).json(moods)
  } catch (error) {
    next(error)
  }
}

// @desc    Get mood statistics
// @route   GET /api/moods/stats
// @access  Private
export const getMoodStats = async (req, res, next) => {
  try {
    // Get all moods for the user
    const moods = await Mood.find({
      user: req.user._id
    })
    
    // Calculate statistics
    let totalValue = 0
    const distribution = {}
    
    moods.forEach(mood => {
      totalValue += mood.value
      
      // Count distribution
      distribution[mood.value] = (distribution[mood.value] || 0) + 1
    })
    
    // Find most common mood
    let mostCommon = null
    let maxCount = 0
    
    Object.entries(distribution).forEach(([value, count]) => {
      if (count > maxCount) {
        mostCommon = parseInt(value)
        maxCount = count
      }
    })
    
    const stats = {
      count: moods.length,
      average: moods.length > 0 ? totalValue / moods.length : 0,
      mostCommon,
      distribution
    }
    
    res.status(200).json(stats)
  } catch (error) {
    next(error)
  }
}

// @desc    Get mood statistics by timeframe
// @route   GET /api/moods/stats/:timeframe
// @access  Private
export const getMoodStatsByTimeframe = async (req, res, next) => {
  try {
    const { timeframe } = req.params
    
    // Calculate date range based on timeframe
    const endDate = new Date()
    let startDate = new Date()
    
    switch (timeframe) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(endDate.getDate() - 7)
    }
    
    // Get moods within date range
    const moods = await Mood.find({
      user: req.user._id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 })
    
    // Calculate statistics
    let totalValue = 0
    const distribution = {}
    const weekdayAvg = {}
    const weekdayCount = {}
    
    // Prepare timeline data
    const timeline = moods.map(mood => {
      const date = new Date(mood.date)
      
      // Track total for average
      totalValue += mood.value
      
      // Track distribution
      distribution[mood.value] = (distribution[mood.value] || 0) + 1
      
      // Track weekday average
      const weekday = date.getDay() + 1 // 1 (Sunday) to 7 (Saturday)
      weekdayAvg[weekday] = (weekdayAvg[weekday] || 0) + mood.value
      weekdayCount[weekday] = (weekdayCount[weekday] || 0) + 1
      
      return {
        date: date.toISOString(),
        value: mood.value
      }
    })
    
    // Calculate weekday averages
    const weekday = {}
    Object.keys(weekdayAvg).forEach(day => {
      weekday[day] = weekdayAvg[day] / weekdayCount[day]
    })
    
    // Find most common mood
    let mostCommon = null
    let maxCount = 0
    
    Object.entries(distribution).forEach(([value, count]) => {
      if (count > maxCount) {
        mostCommon = parseInt(value)
        maxCount = count
      }
    })
    
    const stats = {
      count: moods.length,
      average: moods.length > 0 ? totalValue / moods.length : 0,
      mostCommon,
      distribution,
      weekday,
      timeline
    }
    
    res.status(200).json(stats)
  } catch (error) {
    next(error)
  }
}

// @desc    Get a specific mood entry
// @route   GET /api/moods/:id
// @access  Private
export const getMood = async (req, res, next) => {
  try {
    const mood = await Mood.findOne({
      _id: req.params.id,
      user: req.user._id
    })
    
    if (!mood) {
      return res.status(404).json({
        message: 'Mood entry not found'
      })
    }
    
    res.status(200).json(mood)
  } catch (error) {
    next(error)
  }
}

// @desc    Update a mood entry
// @route   PUT /api/moods/:id
// @access  Private
export const updateMood = async (req, res, next) => {
  try {
    const { value, notes, activities } = req.body
    
    const mood = await Mood.findOne({
      _id: req.params.id,
      user: req.user._id
    })
    
    if (!mood) {
      return res.status(404).json({
        message: 'Mood entry not found'
      })
    }
    
    // Update fields
    if (value !== undefined) mood.value = value
    if (notes !== undefined) mood.notes = notes
    if (activities !== undefined) mood.activities = activities
    
    await mood.save()
    
    res.status(200).json(mood)
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a mood entry
// @route   DELETE /api/moods/:id
// @access  Private
export const deleteMood = async (req, res, next) => {
  try {
    const mood = await Mood.findOne({
      _id: req.params.id,
      user: req.user._id
    })
    
    if (!mood) {
      return res.status(404).json({
        message: 'Mood entry not found'
      })
    }
    
    await mood.deleteOne()
    
    res.status(200).json({
      message: 'Mood entry deleted'
    })
  } catch (error) {
    next(error)
  }
}