// import { Routes, Route, Navigate } from 'react-router-dom'
// import { useAuth } from './contexts/AuthContext'
// import Login from './pages/Login'
// import Register from './pages/Register'
// import Dashboard from './pages/Dashboard'
// import MoodTracker from './pages/MoodTracker'
// import MoodHistory from './pages/MoodHistory'
// import MoodStats from './pages/MoodStats'
// import Layout from './components/Layout'
// import './styles/App.css'

// // Protected route component
// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth()
  
//   if (loading) {
//     return <div className="loading-container">Loading...</div>
//   }
  
//   if (!user) {
//     return <Navigate to="/login" replace />
//   }
  
//   return children
// }

// function App() {
//   return (
//     <Routes>
//       <Route path="/login\" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/" element={
//         <ProtectedRoute>
//           <Layout />
//         </ProtectedRoute>
//       }>
//         <Route index element={<Dashboard />} />
//         <Route path="track" element={<MoodTracker />} />
//         <Route path="history" element={<MoodHistory />} />
//         <Route path="stats" element={<MoodStats />} />
//       </Route>
//       <Route path="*" element={<Navigate to="/\" replace />} />
//     </Routes>
//   )
// }

// export default App













import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MoodTracker from './pages/MoodTracker'
import MoodHistory from './pages/MoodHistory'
import MoodStats from './pages/MoodStats'
import Layout from './components/Layout'
import './styles/App.css'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="loading-container">Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="track" element={<MoodTracker />} />
        <Route path="history" element={<MoodHistory />} />
        <Route path="stats" element={<MoodStats />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
