import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 💡 Set your deployed backend URL directly here
  const apiUrl = 'https://moodmate-1-60ht.onrender.com/api'

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const response = await axios.get(`${apiUrl}/users/me`)
          setUser(response.data)
        }
      } catch (error) {
        console.error('Authentication error:', error)
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [apiUrl])

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, { email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      return user
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/register`, { name, email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      return user
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
