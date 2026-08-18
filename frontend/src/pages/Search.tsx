import { motion } from 'framer-motion'

export function Search() {
  return (
    <div className="min-h-screen bg-orange-50 pb-24 px-6 pt-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black text-gray-900 mb-2"
      >
        Search
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-500 mb-8"
      >
        Find restaurants, dishes, users, and posts.
      </motion.p>

      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <input
          type="text"
          placeholder="Try 'spicy noodles' or 'date night'"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
        />
      </div>

      <div className="text-center text-gray-500 py-8">
        <span className="text-4xl mb-4 block">🔍</span>
        <p>Start typing to search</p>
      </div>
    </div>
  )
}
