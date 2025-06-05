import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import axios from 'axios'
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import '../styles/MoodHistory.css'

const MoodHistory = () => {
  const [moods, setMoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        setLoading(true)
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth() + 1 // JavaScript months are 0-indexed
        
        const response = await axios.get(`${apiUrl}/moods?year=${year}&month=${month}`)
        setMoods(response.data)
        setError('')
      } catch (err) {
        setError('Failed to fetch mood history')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMoods()
  }, [apiUrl, currentMonth])
  
  const previousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }
  
  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }
  
  const getMoodEmoji = (value) => {
    const emojis = {
      1: '😢',
      2: '😕',
      3: '😐',
      4: '🙂',
      5: '😁'
    }
    return emojis[value] || '😐'
  }
  
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)
    
    // Calculate days from previous month to fill the first week
    const daysFromPrevMonth = firstDay.getDay()
    
    // Total days in calendar view (max 42 - six weeks)
    const totalDays = 42
    
    const days = []
    
    // Add days from previous month
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()
    
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
        mood: null
      })
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      const dateStr = format(date, 'yyyy-MM-dd')
      
      // Find mood for this day
      const moodForDay = moods.find(mood => {
        const moodDate = new Date(mood.date)
        return format(moodDate, 'yyyy-MM-dd') === dateStr
      })
      
      days.push({
        date,
        isCurrentMonth: true,
        mood: moodForDay
      })
    }
    
    // Add days from next month to fill remaining spaces
    const remainingDays = totalDays - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        mood: null
      })
    }
    
    return days
  }
  
  if (loading) {
    return <div className="loading-container">Loading mood history...</div>
  }
  
  const calendarDays = getCalendarDays()
  
  return (
    <div className="mood-history">
      <div className="page-header">
        <h1 className="page-title">Mood History</h1>
        <p className="page-description">
          Review your past mood entries and reflect on your emotional journey.
        </p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="calendar-container">
        <div className="calendar-header">
          <button 
            className="calendar-nav-button" 
            onClick={previousMonth}
            aria-label="Previous month"
          >
            <FiChevronLeft />
          </button>
          <h2 className="calendar-title">
            <FiCalendar className="calendar-icon" />
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button 
            className="calendar-nav-button" 
            onClick={nextMonth}
            aria-label="Next month"
          >
            <FiChevronRight />
          </button>
        </div>
        
        <div className="calendar-grid">
          <div className="calendar-days">
            <div className="calendar-day-name">Sun</div>
            <div className="calendar-day-name">Mon</div>
            <div className="calendar-day-name">Tue</div>
            <div className="calendar-day-name">Wed</div>
            <div className="calendar-day-name">Thu</div>
            <div className="calendar-day-name">Fri</div>
            <div className="calendar-day-name">Sat</div>
          </div>
          
          <div className="calendar-dates">
            {calendarDays.map((day, index) => (
              <div 
                key={index}
                className={`calendar-date ${
                  day.isCurrentMonth ? 'current-month' : 'other-month'
                } ${
                  day.mood ? 'has-mood' : ''
                }`}
              >
                <div className="date-number">{day.date.getDate()}</div>
                {day.mood && (
                  <div className="date-mood">
                    <span className="mood-emoji-small">{getMoodEmoji(day.mood.value)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mood-entries">
        <h2 className="section-title">Entries This Month</h2>
        
        {moods.length === 0 ? (
          <p className="no-entries">No mood entries for this month.</p>
        ) : (
          <div className="entry-list">
            {moods.map(mood => (
              <div key={mood._id} className="entry-card">
                <div className="entry-header">
                  <span className="entry-emoji">{getMoodEmoji(mood.value)}</span>
                  <span className="entry-date">{format(new Date(mood.date), 'EEEE, MMMM do')}</span>
                </div>
                {mood.notes && (
                  <div className="entry-notes">
                    <p>{mood.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MoodHistory