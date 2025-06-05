import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi'
import '../styles/Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          MoodMate
        </Link>
        
        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <NavLink to="/" className="navbar-link" onClick={closeMenu} end>
            Dashboard
          </NavLink>
          <NavLink to="/track" className="navbar-link" onClick={closeMenu}>
            Track Mood
          </NavLink>
          <NavLink to="/history" className="navbar-link" onClick={closeMenu}>
            History
          </NavLink>
          <NavLink to="/status" className="navbar-link" onClick={closeMenu}>
            Status
          </NavLink>
        </div>
        
        <div className="navbar-actions">
          <div className="navbar-user">
            <FiUser className="navbar-user-icon" />
            <span className="navbar-username">{user?.name}</span>
          </div>
          <button className="navbar-logout" onClick={handleLogout}>
            <FiLogOut />
            <span className="navbar-logout-text">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar