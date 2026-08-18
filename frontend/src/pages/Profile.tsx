import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'

export function Profile() {
  const { user, isAuthenticated, logout } = useAuthStore()

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-orange-50 pb-24 px-6 pt-12 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">👤</span>
          <p className="text-gray-500 mt-4">Please login to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-24 px-6 pt-12">
      {/* Profile Header */}
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

      {/* Favorite Cuisines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm mb-6"
      >
        <h2 className="text-lg font-bold text-gray-800 mb-4">Favorite Cuisines</h2>
        <div className="flex flex-wrap gap-2">
          {['🍣 Japanese', '🍜 Chinese', '☕ Coffee'].map((cuisine) => (
            <span key={cuisine} className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              {cuisine}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Logout */}
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
