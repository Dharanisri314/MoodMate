import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content container">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout