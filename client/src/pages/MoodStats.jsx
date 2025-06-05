import { useState, useEffect } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import axios from 'axios'
import { format, startOfWeek, addDays } from 'date-fns'
import { FiTrendingUp, FiPieChart, FiCalendar } from 'react-icons/fi'
import '../styles/MoodStats.css'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const MoodStats = () => {
  const [timeframe, setTimeframe] = useState('week')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${apiUrl}/moods/stats/${timeframe}`)
        setStats(response.data)
        setError('')
      } catch (err) {
        setError('Failed to fetch mood statistics')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [apiUrl, timeframe])
  
  const getLineChartData = () => {
    if (!stats || !stats.timeline) return null
    
    const labels = stats.timeline.map(item => format(new Date(item.date), 'MMM d'))
    const data = stats.timeline.map(item => item.value)
    
    return {
      labels,
      datasets: [
        {
          label: 'Mood Rating',
          data,
          fill: true,
          backgroundColor: 'rgba(74, 144, 226, 0.2)',
          borderColor: 'rgba(74, 144, 226, 1)',
          tension: 0.4,
          pointBackgroundColor: 'rgba(74, 144, 226, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    }
  }
  
  const getBarChartData = () => {
    if (!stats || !stats.distribution) return null
    
    const labels = ['Awful', 'Bad', 'Okay', 'Good', 'Great']
    const data = [
      stats.distribution[1] || 0,
      stats.distribution[2] || 0,
      stats.distribution[3] || 0,
      stats.distribution[4] || 0,
      stats.distribution[5] || 0
    ]
    
    return {
      labels,
      datasets: [
        {
          label: 'Frequency',
          data,
          backgroundColor: [
            'rgba(244, 67, 54, 0.7)',
            'rgba(255, 152, 0, 0.7)',
            'rgba(255, 193, 7, 0.7)',
            'rgba(76, 175, 80, 0.7)',
            'rgba(33, 150, 243, 0.7)'
          ],
          borderColor: [
            'rgba(244, 67, 54, 1)',
            'rgba(255, 152, 0, 1)',
            'rgba(255, 193, 7, 1)',
            'rgba(76, 175, 80, 1)',
            'rgba(33, 150, 243, 1)'
          ],
          borderWidth: 1
        }
      ]
    }
  }
  
  const getWeekdayData = () => {
    if (!stats || !stats.weekday) return null
    
    // Get weekday labels starting from Sunday
    const startDate = startOfWeek(new Date())
    const weekdayLabels = Array.from({ length: 7 }, (_, i) => 
      format(addDays(startDate, i), 'EEE')
    )
    
    // Map data to match weekday order
    const data = weekdayLabels.map((_, index) => 
      stats.weekday[index + 1] || 0
    )
    
    return {
      labels: weekdayLabels,
      datasets: [
        {
          label: 'Average Mood by Day',
          data,
          backgroundColor: 'rgba(157, 101, 201, 0.7)',
          borderColor: 'rgba(157, 101, 201, 1)',
          borderWidth: 1
        }
      ]
    }
  }
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 4
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  }
  
  const distributionOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false
      }
    }
  }
  
  if (loading) {
    return <div className="loading-container">Loading mood statistics...</div>
  }
  
  const lineChartData = getLineChartData()
  const barChartData = getBarChartData()
  const weekdayData = getWeekdayData()
  
  return (
    <div className="mood-stats">
      <div className="page-header">
        <h1 className="page-title">Mood Statistics</h1>
        <p className="page-description">
          Analyze your mood patterns and gain insights into your emotional well-being.
        </p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="stats-controls">
        <div className="timeframe-selector">
          <button 
            className={`timeframe-button ${timeframe === 'week' ? 'active' : ''}`}
            onClick={() => setTimeframe('week')}
          >
            Week
          </button>
          <button 
            className={`timeframe-button ${timeframe === 'month' ? 'active' : ''}`}
            onClick={() => setTimeframe('month')}
          >
            Month
          </button>
          <button 
            className={`timeframe-button ${timeframe === 'year' ? 'active' : ''}`}
            onClick={() => setTimeframe('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      <div className="stats-summary">
        <div className="summary-card">
          <div className="summary-icon">😊</div>
          <div className="summary-content">
            <h3 className="summary-title">Average Mood</h3>
            <p className="summary-value">{stats?.average.toFixed(1)}/5.0</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <h3 className="summary-title">Entries</h3>
            <p className="summary-value">{stats?.count || 0}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon">⭐</div>
          <div className="summary-content">
            <h3 className="summary-title">Most Common</h3>
            <p className="summary-value">
              {stats?.mostCommon ? `${stats.mostCommon}/5.0` : 'N/A'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-card">
          <div className="chart-header">
            <FiTrendingUp className="chart-icon" />
            <h3 className="chart-title">Mood Timeline</h3>
          </div>
          <div className="chart-container">
            {lineChartData ? (
              <Line data={lineChartData} options={chartOptions} height={300} />
            ) : (
              <p className="no-data">Not enough data to display timeline.</p>
            )}
          </div>
        </div>
        
        <div className="charts-row">
          <div className="chart-card">
            <div className="chart-header">
              <FiPieChart className="chart-icon" />
              <h3 className="chart-title">Mood Distribution</h3>
            </div>
            <div className="chart-container">
              {barChartData ? (
                <Bar data={barChartData} options={distributionOptions} height={300} />
              ) : (
                <p className="no-data">Not enough data to display distribution.</p>
              )}
            </div>
          </div>
          
          <div className="chart-card">
            <div className="chart-header">
              <FiCalendar className="chart-icon" />
              <h3 className="chart-title">Mood by Day of Week</h3>
            </div>
            <div className="chart-container">
              {weekdayData ? (
                <Bar data={weekdayData} options={chartOptions} height={300} />
              ) : (
                <p className="no-data">Not enough data to display weekday stats.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MoodStats