import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import MoodForm from '../components/MoodForm'
import { FiCheck } from 'react-icons/fi'
import '../styles/MoodTracker.css'

const MoodTracker = () => {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  
  const handleSubmit = async (moodData) => {
    try {
      setSubmitting(true)
      setError('')
      
      await axios.post(`${apiUrl}/moods`, moodData)
      
      setSuccess(true)
      
      // Redirect to dashboard after success message
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save mood')
      setSuccess(false)
    } finally {
      setSubmitting(false)
    }
  }
  
  return (
    <div className="mood-tracker-container">
      <div className="page-header">
        <h1 className="page-title">Track Your Mood</h1>
        <p className="page-description">
          How are you feeling today? Track your mood to gain insights about your emotional patterns.
        </p>
      </div>
      
      {success ? (
        <div className="success-message">
          <FiCheck className="success-icon" />
          <h3>Mood Logged Successfully!</h3>
          <p>Redirecting you to the dashboard...</p>
        </div>
      ) : (
        <>
          {error && <div className="error-message">{error}</div>}
          <div className="mood-form-card">
            <MoodForm onSubmit={handleSubmit} />
          </div>
        </>
      )}
    </div>
  )
}

export default MoodTracker