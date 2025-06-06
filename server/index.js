// index.js
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import moodRoutes from './routes/moodRoutes.js'

// Extra lines to fix path for .env (for ES module)
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env') }) // ✅ Ensure .env is loaded

console.log("✅ MONGODB_URI:", process.env.MONGODB_URI) // Debug log

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL
    : 'http://localhost:5173',  // For development
  credentials: true
}))


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/moods', moodRoutes)

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' })
})

// Global error handler
app.use((err, req, res, next) => { // ❌ Removed wrong "process" parameter
  console.error(err.stack)
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
