import { useState } from 'react'
import { FiSend } from 'react-icons/fi'
import '../styles/MoodForm.css'

const moodOptions = [
  { value: 5, emoji: '😁', label: 'Great' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 2, emoji: '😕', label: 'Bad' },
  { value: 1, emoji: '😢', label: 'Awful' }
]

const MoodForm = ({ onSubmit, initialMood = null }) => {
  const [selectedMood, setSelectedMood] = useState(initialMood ? initialMood.value : null)
  const [notes, setNotes] = useState(initialMood ? initialMood.notes : '')
  const [activities, setActivities] = useState(initialMood ? initialMood.activities : [])
  const [error, setError] = useState('')
  
  const handleMoodSelect = (value) => {
    setSelectedMood(value)
    setError('')
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!selectedMood) {
      setError('Please select a mood')
      return
    }
    
    const moodData = {
      value: selectedMood,
      notes,
      activities,
      date: new Date().toISOString()
    }
    
    onSubmit(moodData)
  }
  
  return (
    <form className="mood-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3 className="form-section-title">How are you feeling today?</h3>
        <div className="mood-selector">
          {moodOptions.map((mood) => (
            <div 
              key={mood.value}
              className={`mood-option ${selectedMood === mood.value ? 'selected' : ''}`}
              onClick={() => handleMoodSelect(mood.value)}
            >
              <span className={`mood-emoji ${selectedMood === mood.value ? 'selected' : ''}`}>
                {mood.emoji}
              </span>
              <span className="mood-label">{mood.label}</span>
            </div>
          ))}
        </div>
        {error && <p className="form-error">{error}</p>}
      </div>
      
      <div className="form-section">
        <h3 className="form-section-title">Add notes (optional)</h3>
        <textarea
          className="form-textarea"
          placeholder="What's on your mind today?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
        />
      </div>
      
      <button type="submit" className="form-submit">
        <FiSend />
        <span>Save Mood</span>
      </button>
    </form>
  )
}

export default MoodForm