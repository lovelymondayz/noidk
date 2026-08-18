import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'

export function BottomNav() {
  const { isAuthenticated } = useAuthStore()

  const navItems = [
    { label: 'Home', icon: '🏠', path: '/' },
    { label: 'Discover', icon: '🔍', path: '/discover' },
    { label: 'Spin', icon: '🎲', path: '/spin' },
    { label: 'Activity', icon: '📊', path: '/activity' },
    { label: 'Profile', icon: '👤', path: isAuthenticated ? '/profile' : '/login' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 px-4 py-2 z-50">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map((item) => (
          <motion.button
            key={item.path}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center py-2 px-3 rounded-xl text-gray-500 hover:text-orange-500 transition-colors"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </nav>
  )
}
