import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { format } from 'date-fns'
import { FiCalendar, FiTrendingUp, FiPlusCircle } from 'react-icons/fi'
import axios from 'axios'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const [recentMoods, setRecentMoods] = useState([])
  const [stats, setStats] = useState({ average: 0, entries: 0 })
  const [loading, setLoading] = useState(true)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [moodsRes, statsRes] = await Promise.all([
          axios.get(`${apiUrl}/moods/recent`),
          axios.get(`${apiUrl}/moods/stats`)
        ])
        
        setRecentMoods(moodsRes.data)
        setStats(statsRes.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [apiUrl])
  
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
  
  if (loading) {
    return <div className="loading-container">Loading dashboard...</div>
  }
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-greeting">Hello, {user?.name}</h1>
        <p className="dashboard-date">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
      </div>
      
      <div className="dashboard-cards">
        <div className="dashboard-card mood-card">
          <div className="card-header">
            <div className="card-icon">
              <FiPlusCircle />
            </div>
            <h3 className="card-title">How are you feeling today?</h3>
          </div>
          <p>Track your mood and keep your mental health journey going.</p>
          <Link to="/track" className="button card-button">
            Log Your Mood
          </Link>
        </div>
        
        <div className="dashboard-card history-card">
          <div className="card-header">
            <div className="card-icon">
              <FiCalendar />
            </div>
            <h3 className="card-title">Your Mood History</h3>
          </div>
          <p>You've logged {stats.entries} mood entries so far.</p>
          <Link to="/history" className="button card-button">
            View History
          </Link>
        </div>
        
        <div className="dashboard-card stats-card">
          <div className="card-header">
            <div className="card-icon">
              <FiTrendingUp />
            </div>
            <h3 className="card-title">Mood Insights</h3>
          </div>
          <p>Your average mood: {stats.average.toFixed(1)} {getMoodEmoji(Math.round(stats.average))}</p>
          <Link to="/stats" className="button card-button">
            View Stats
          </Link>
        </div>
      </div>
      
      {recentMoods.length > 0 && (
        <div className="recent-moods">
          <h2 className="section-title">Recent Entries</h2>
          <div className="mood-list">
            {recentMoods.map(mood => (
              <div key={mood._id} className="mood-item">
                <div className="mood-item-header">
                  <span className="mood-emoji">{getMoodEmoji(mood.value)}</span>
                  <span className="mood-date">{format(new Date(mood.date), 'MMM d, yyyy')}</span>
                </div>
                {mood.notes && <p className="mood-notes">{mood.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard