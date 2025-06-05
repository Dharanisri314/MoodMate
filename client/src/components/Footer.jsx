import '../styles/Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-logo">MoodMate</div>
          <p className="footer-tagline">Track your mood journey</p>
        </div>
        <div className="footer-copyright">
          &copy; {currentYear} MoodMate. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer