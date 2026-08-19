import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { useState, useEffect } from 'react'
import { getApi } from '../services/api'
import { EmptyState } from '../components/ui/EmptyState'

export function Profile() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [stats, setStats] = useState<any>(null)
  const [visits, setVisits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && user) {
      getApi().get<{ data: { stats: any, visits: any[] } }>(`/users/${user.id}`).then(res => {
        setStats(res.data.stats)
        setVisits(res.data.visits || [])
      }).catch(() => {}).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-orange-50 pb-24 px-6 pt-12">
        <EmptyState
          emoji="👤"
          title="Not logged in"
          description="Login or create an account to view your profile and food journey."
          action={{ label: 'Login', onClick: () => window.location.href = '/login' }}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 pb-24 px-6 pt-12 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-4xl"
        >
          👤
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-24 px-6 pt-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-orange-200 flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">@{user.username}</h1>
            <p className="text-gray-500">Food Scout · Level {user.level}</p>
            <p className="text-sm text-orange-500 font-medium mt-1">🔥 {user.lifetimeXp} XP total</p>
          </div>
        </div>
      </motion.div>

      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <span className="text-2xl font-black text-orange-500">{stats.totalVisits}</span>
            <p className="text-xs text-gray-500 mt-1">Visits</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <span className="text-2xl font-black text-orange-500">{stats.cuisinesTried}</span>
            <p className="text-xs text-gray-500 mt-1">Cuisines</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <span className="text-2xl font-black text-orange-500">{stats.wouldReturnCount}</span>
            <p className="text-xs text-gray-500 mt-1">Would Return</p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-sm mb-6"
      >
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Eats</h2>
        {visits.length === 0 ? (
          <EmptyState
            emoji="🍽️"
            title="No eats yet"
            description="Start exploring and marking restaurants as visited to build your food journey."
            action={{ label: 'Discover Places', onClick: () => window.location.href = '/discover' }}
          />
        ) : (
          <div className="space-y-3">
            {visits.slice(0, 5).map(v => (
              <div key={v.id} className="flex items-center gap-3">
                <span className="text-xl">🍽️</span>
                <div>
                  <p className="font-medium text-gray-800">{v.name}</p>
                  <p className="text-sm text-gray-500">{v.cuisine} • {v.visitedAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <button
          onClick={logout}
          className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition"
        >
          Logout
        </button>
      </motion.div>
    </div>
  )
}
