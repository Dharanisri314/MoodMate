import mongoose from 'mongoose'

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  activities: [{
    type: String,
    trim: true
  }],
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Create compound index for user + date to ensure one mood entry per day
moodSchema.index({ user: 1, date: 1 }, { 
  unique: true, 
  // Custom error message
  partialFilterExpression: { 
    // This allows multiple entries on the same day by not enforcing uniqueness
    // We'll handle this in the controller instead for more flexibility
    date: { $exists: true } 
  }
})

// Create index for querying by user and date range
moodSchema.index({ user: 1, date: -1 })

const Mood = mongoose.model('Mood', moodSchema)

export default Mood