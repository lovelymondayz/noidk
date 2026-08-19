import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { getApi } from '../services/api'
import { EmptyState } from '../components/ui/EmptyState'

interface Visit {
  id: string
  name: string
  cuisine: string
  visitedAt: string
  rating: number
  wouldReturn: boolean
}

interface Stats {
  totalVisits: number
  cuisinesTried: number
  wouldReturnCount: number
  level: number
  lifetimeXp: number
}

export function Activity() {
  const { user, isAuthenticated } = useAuthStore()
  const [visits, setVisits] = useState<Visit[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false)
      return
    }
    const fetchData = async () => {
      try {
        const res = await getApi().get<{ data: { visits: Visit[]; stats: Stats } }>(`/users/${user.id}`)
        setVisits(res.data.visits || [])
        setStats(res.data.stats || null)
      } catch (err) {
        console.error('Failed to fetch activity:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [isAuthenticated, user])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-orange-50 pb-24 px-6 pt-12">
        <EmptyState
          emoji="🔒"
          title="Login required"
          description="Sign in to see your food journey and activity."
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
          🍽️
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-24 px-6 pt-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black text-gray-900 mb-2"
      >
        Activity
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-500 mb-8"
      >
        Your food journey so far.
      </motion.p>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-5 shadow-sm text-center"
          >
            <span className="text-3xl font-black text-orange-500">{stats.totalVisits}</span>
            <p className="text-sm text-gray-500 mt-1">Places Visited</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-5 shadow-sm text-center"
          >
            <span className="text-3xl font-black text-orange-500">{stats.cuisinesTried}</span>
            <p className="text-sm text-gray-500 mt-1">Cuisines Tried</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-5 shadow-sm text-center"
          >
            <span className="text-3xl font-black text-orange-500">{stats.wouldReturnCount}</span>
            <p className="text-sm text-gray-500 mt-1">Would Return</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-5 shadow-sm text-center"
          >
            <span className="text-3xl font-black text-orange-500">{stats.lifetimeXp}</span>
            <p className="text-sm text-gray-500 mt-1">Total XP</p>
          </motion.div>
        </div>
      )}

      {/* Food Journey */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Food Journey</h2>

        {visits.length === 0 ? (
          <EmptyState
            emoji="🍽️"
            title="No visits yet"
            description="Start exploring restaurants and mark them as visited to build your food journey."
            action={{ label: 'Discover Places', onClick: () => window.location.href = '/discover' }}
          />
        ) : (
          <div className="space-y-4">
            {visits.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-3"
              >
                <span className="text-2xl">
                  {v.cuisine === 'japanese' ? '🍣' : v.cuisine === 'indonesian' ? '🍛' : v.cuisine === 'chinese' ? '🍜' : v.cuisine === 'italian' ? '🍕' : v.cuisine === 'korean' ? '🥘' : v.cuisine === 'western' ? '🍔' : v.cuisine === 'coffee' ? '☕' : v.cuisine === 'dessert' ? '🍰' : '🍽️'}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{v.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(v.visitedAt).toLocaleDateString()} · ⭐ {v.rating}/5 {v.wouldReturn ? '· ❤️ Would return' : ''}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
