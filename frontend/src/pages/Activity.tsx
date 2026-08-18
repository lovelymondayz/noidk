import { motion } from 'framer-motion'

export function Activity() {
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
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 shadow-sm text-center"
        >
          <span className="text-3xl font-black text-orange-500">14</span>
          <p className="text-sm text-gray-500 mt-1">Places Visited</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 shadow-sm text-center"
        >
          <span className="text-3xl font-black text-orange-500">9</span>
          <p className="text-sm text-gray-500 mt-1">Cuisines Tried</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-5 shadow-sm text-center"
        >
          <span className="text-3xl font-black text-orange-500">3</span>
          <p className="text-sm text-gray-500 mt-1">New Places</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-5 shadow-sm text-center"
        >
          <span className="text-3xl font-black text-orange-500">2</span>
          <p className="text-sm text-gray-500 mt-1">Repeats</p>
        </motion.div>
      </div>

      {/* Food Journey */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Food Journey</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍜</span>
            <div>
              <p className="font-medium text-gray-800">Bakmi Orang Ketiga</p>
              <p className="text-sm text-gray-500">3 days ago · ⭐ 5/5</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍣</span>
            <div>
              <p className="font-medium text-gray-800">Sushi Kaze</p>
              <p className="text-sm text-gray-500">5 days ago · ⭐ 4/5</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍕</span>
            <div>
              <p className="font-medium text-gray-800">Pizza Club Menteng</p>
              <p className="text-sm text-gray-500">1 week ago · ⭐ 3/5</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">☕</span>
            <div>
              <p className="font-medium text-gray-800">Kopi & Co.</p>
              <p className="text-sm text-gray-500">1 week ago · ⭐ 5/5</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
