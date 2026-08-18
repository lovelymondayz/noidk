import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useFilterStore } from '../store/filterStore'
import { getApi } from '../services/api'

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

interface SpinResult {
  name: string
  cuisine: string
  rating: number
  distanceKm: number
  priceRange: number
  reasons: string[]
  address: string
  imageUrl: string
  latitude: number
  longitude: number
  id: string
}

export function Spin() {
  const location = useLocation()
  const { mood, budget, distanceKm } = useFilterStore()
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<SpinResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSpin = async () => {
    setSpinning(true)
    setResult(null)
    setError(null)

    // Simulate spinning animation
    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      const res = await getApi().post<{ data: SpinResult }>('/roulette/spin', {
        budget: budget || undefined,
        distanceKm: distanceKm || undefined,
        mood: mood || undefined,
        latitude: -6.2088,
        longitude: 106.8456,
      })
      setResult(res.data)
    } catch (err: any) {
      setError(err.message || 'Failed to spin')
    } finally {
      setSpinning(false)
    }
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-24 px-6 pt-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black text-center text-gray-900 mb-2"
      >
        🎲 Roulette
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-gray-500 mb-8"
      >
        Let NoIDK decide. No regrets.
      </motion.p>

      {/* Spinning Wheel */}
      <div className="flex flex-col items-center justify-center mb-8">
        <motion.div
          animate={spinning ? { rotate: 360 } : {}}
          transition={spinning ? { duration: 2, ease: 'easeInOut' } : {}}
          className="w-48 h-48 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-2xl"
        >
          <span className="text-6xl">🎲</span>
        </motion.div>
      </div>

      {/* Filters Summary */}
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {mood && (
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              {MOODS.find(m => m.value === mood)?.emoji} {MOODS.find(m => m.value === mood)?.label}
            </span>
          )}
          {budget && (
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              {'💸'.repeat(budget)} Budget
            </span>
          )}
          {distanceKm && (
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              📍 Within {distanceKm} km
            </span>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Spin Button */}
      {!result && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSpin}
          disabled={spinning}
          className="w-full bg-orange-500 text-white font-black text-xl py-5 rounded-2xl shadow-xl shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {spinning ? '✨ Picking...' : '🎲 SPIN'}
        </motion.button>
      )}

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900">{result.name}</h2>
              <p className="text-gray-500">{result.cuisine}</p>
            </div>
            <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full">
              <span className="text-orange-500">⭐</span>
              <span className="font-bold text-orange-700">{result.rating}</span>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <span>📍</span>
              <span>{result.distanceKm.toFixed(1)} km away</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span>💰</span>
              <span>{'💸'.repeat(result.priceRange)}</span>
            </div>
          </div>

          {/* Reasons */}
          <div className="border-t border-orange-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Why we picked this</h3>
            <div className="space-y-2">
              {result.reasons.map((reason, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <span>{reason}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button className="flex-1 btn-primary">
              LET'S GO →
            </button>
            <button
              onClick={handleSpin}
              className="flex-1 btn-secondary"
            >
              SPIN AGAIN
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
