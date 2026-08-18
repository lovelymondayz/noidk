import { motion } from 'framer-motion'

export function Discover() {
  const sections = [
    { emoji: '🔥', title: 'Trending Near You', description: 'Restaurants getting attention' },
    { emoji: '📱', title: 'TikTok Finds', description: 'Viral food spots' },
    { emoji: '🎬', title: 'YouTube Finds', description: 'Creator recommendations' },
    { emoji: '📸', title: 'Instagram Finds', description: 'Popular food locations' },
    { emoji: '❤️', title: 'Community Favorites', description: 'Highly rated by NoIDK users' },
    { emoji: '💎', title: 'Hidden Gems', description: 'Quality spots not yet mainstream' },
    { emoji: '🆕', title: 'New Places', description: 'Recently opened restaurants' },
  ]

  return (
    <div className="min-h-screen bg-orange-50 pb-24 px-6 pt-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black text-gray-900 mb-2"
      >
        Discover
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-500 mb-8"
      >
        Let's see what NoIDK finds for us.
      </motion.p>

      <div className="space-y-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4"
          >
            <span className="text-3xl">{section.emoji}</span>
            <div>
              <h3 className="font-bold text-gray-800">{section.title}</h3>
              <p className="text-sm text-gray-500">{section.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
