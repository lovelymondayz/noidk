import { motion } from 'framer-motion'

export function Profile() {
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
            <h1 className="text-2xl font-black text-gray-900">@mika</h1>
            <p className="text-gray-500">Food Scout · Level 12</p>
            <p className="text-sm text-orange-500 font-medium mt-1">🔥 348 XP this month</p>
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

      {/* Recent Eats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-sm mb-6"
      >
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Eats</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">🍜</span>
            <span className="text-gray-700">Bakmi Orang Ketiga</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">🍣</span>
            <span className="text-gray-700">Sushi Kaze</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">☕</span>
            <span className="text-gray-700">Kopi & Co.</span>
          </div>
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold text-gray-800 mb-4">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">🏆 Top Food Scout</span>
          <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">📸 Photo Hunter</span>
          <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">🍜 Noodle Expert</span>
        </div>
      </motion.div>
    </div>
  )
}
