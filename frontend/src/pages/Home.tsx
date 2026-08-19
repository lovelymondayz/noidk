import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MoodFilter, BudgetFilter, DistanceFilter } from '../components/ui/Filters'
import { useFilterStore } from '../store/filterStore'
import { getApi } from '../services/api'
import { EmptyState } from '../components/ui/EmptyState'

const MOODS = [
  { emoji: '🍜', label: 'Comfort', value: 'comfort' },
  { emoji: '🍔', label: 'Fast', value: 'fast' },
  { emoji: '🍣', label: 'Fancy', value: 'fancy' },
  { emoji: '🌶️', label: 'Spicy', value: 'spicy' },
  { emoji: '☕', label: 'Chill', value: 'chill' },
  { emoji: '🍰', label: 'Dessert', value: 'dessert' },
  { emoji: '🥗', label: 'Healthy', value: 'healthy' },
  { emoji: '🎲', label: 'Surprise', value: 'surprise' },
]

const BUDGETS = [
  { emoji: '💸', label: 'Under Rp50K', value: 1 },
  { emoji: '💸💸', label: 'Rp50K–100K', value: 2 },
  { emoji: '💸💸💸', label: 'Rp100K–250K', value: 3 },
  { emoji: '💸💸💸💸', label: 'Anything', value: 4 },
]

const DISTANCES = [
  { emoji: '🚶', label: 'Walking', value: 1 },
  { emoji: '🛵', label: 'Under 5 km', value: 5 },
  { emoji: '🚗', label: 'Under 10 km', value: 10 },
  { emoji: '🌎', label: 'Anywhere', value: 50 },
]

interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  reviewCount: number
  priceRange: number
  address: string
  imageUrl: string
  latitude: number
  longitude: number
  distanceKm?: number
}

export function Home() {
  const navigate = useNavigate()
  const { mood, budget, distanceKm, setMood, setBudget, setDistance } = useFilterStore()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)

  // Request location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      return
    }

    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
        setLocationStatus('success')
      },
      (error) => {
        console.error('Geolocation error:', error)
        setLocationStatus('error')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }, [])

  // Fetch restaurants when location changes or filters change
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (mood) params.set('mood', mood)
        if (budget) params.set('budget', budget.toString())
        if (distanceKm) params.set('dist', distanceKm.toString())
        if (userLocation) {
          params.set('lat', userLocation.lat.toString())
          params.set('lon', userLocation.lon.toString())
        }

        const res = await getApi().get<{ data: { restaurants: Restaurant[] } }>(`/restaurants?${params.toString()}`)
        setRestaurants(res.data.restaurants || [])
      } catch (err) {
        console.error('Failed to fetch restaurants:', err)
        setRestaurants([])
      } finally {
        setLoading(false)
      }
    }
    fetchRestaurants()
  }, [mood, budget, distanceKm, userLocation])

  const handleSpin = () => {
    navigate('/spin', { state: { mood, budget, distanceKm, lat: userLocation?.lat, lon: userLocation?.lon } })
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-24">
      {/* Hero Section */}
      <div className="px-6 pt-12 pb-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-gray-900 mb-2"
        >
          Where are we eating?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-500 mb-8"
        >
          Don't think. We'll pick.
        </motion.p>

        {/* Location Status */}
        {locationStatus === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <span className="animate-spin">📡</span>
            <span>Finding your location...</span>
          </motion.div>
        )}
        {locationStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <span>📍</span>
            <span>Showing restaurants near you</span>
          </motion.div>
        )}
        {locationStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <span>🌎</span>
            <span>Showing all restaurants (location unavailable)</span>
          </motion.div>
        )}

        {/* Contextual Greeting */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-8"
        >
          <p className="text-sm text-gray-400 mb-1">
            {new Date().getHours() < 12 ? 'Good morning ☀️' : new Date().getHours() < 18 ? 'Good afternoon 🌤️' : 'Good evening 🌙'}
          </p>
          <p className="text-xl font-bold text-gray-800">
            What are we eating tonight?
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="px-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Mood</h3>
          <MoodFilter moods={MOODS} selected={mood} onSelect={setMood} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Budget</h3>
          <BudgetFilter budgets={BUDGETS} selected={budget} onSelect={setBudget} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Distance</h3>
          <DistanceFilter distances={DISTANCES} selected={distanceKm} onSelect={setDistance} />
        </motion.div>
      </div>

      {/* Trending Restaurants */}
      <div className="px-6 mt-8">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">🔥 Near You</h3>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="text-4xl"
            >
              🍽️
            </motion.div>
          </div>
        ) : restaurants.length === 0 ? (
          <EmptyState
            emoji="🔍"
            title="No restaurants found"
            description="Try adjusting your filters or expanding your distance range."
          />
        ) : (
          <div className="space-y-3">
            {restaurants.slice(0, 5).map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-lg bg-orange-100 flex items-center justify-center text-2xl">
                  🍽️
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{r.name}</h4>
                  <p className="text-sm text-gray-500">{r.cuisine} • {'💸'.repeat(r.priceRange)}</p>
                  {r.distanceKm !== undefined && (
                    <p className="text-xs text-orange-500 font-medium">📍 {r.distanceKm} km away</p>
                  )}
                </div>
                <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-full">
                  <span className="text-orange-500 text-sm">⭐</span>
                  <span className="font-bold text-orange-700 text-sm">{r.rating}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 mt-10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSpin}
          className="w-full bg-orange-500 text-white font-black text-xl py-5 rounded-2xl shadow-xl shadow-orange-500/30 active:shadow-md transition-shadow"
        >
          🎲 SPIN FOR ME
        </motion.button>
      </div>
    </div>
  )
}
