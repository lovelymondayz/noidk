import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/layout/BottomNav'
import { Home } from './pages/Home'
import { Spin } from './pages/Spin'
import { Discover } from './pages/Discover'
import { Activity } from './pages/Activity'
import { Profile } from './pages/Profile'
import { Login } from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-orange-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spin" element={<Spin />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold text-orange-500">Register</h1></div>} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
