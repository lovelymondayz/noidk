import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/layout/BottomNav'
import { Home } from './pages/Home'
import { Spin } from './pages/Spin'
import { Discover } from './pages/Discover'
import { Activity } from './pages/Activity'
import { Profile } from './pages/Profile'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { RestaurantDetail } from './pages/RestaurantDetail'
import { DontMakeMeChoose } from './pages/DontMakeMeChoose'
import { PostCreation } from './pages/PostCreation'
import { Search } from './pages/Search'
import { Onboarding } from './pages/Onboarding'

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
          <Route path="/register" element={<Register />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/dont-make-me-choose" element={<DontMakeMeChoose />} />
          <Route path="/post" element={<PostCreation />} />
          <Route path="/search" element={<Search />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

export default App
