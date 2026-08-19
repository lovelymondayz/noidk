import { motion } from 'framer-motion'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getApi } from '../services/api'
import { EmptyState } from '../components/ui/EmptyState'

interface Restaurant {
  id: string
  name: string
  description: string
  address: string
  cuisine: string
  priceRange: number
  rating: number
  reviewCount: number
  imageUrl: string
  atmosphere: string
  noiseLevel: string
  dateSuitability: boolean
  menuItems: Array<{
    id: string
    name: string
    description: string
    price: number
    isPopular: boolean
  }>
}

export function RestaurantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [showVisitForm, setShowVisitForm] = useState(false)
  const [visitRating, setVisitRating] = useState(5)
  const [wouldReturn, setWouldReturn] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getApi().get<{ data: Restaurant }>(`/restaurants/${id}`)
        setRestaurant(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleMarkVisited = async () => {
    try {
      await getApi().post(`/restaurants/${id}/visit`, { rating: visitRating, wouldReturn })
      setShowVisitForm(false)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
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

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-orange-50 pb-24 px-6 pt-12">
        <EmptyState
          emoji="😢"
          title="Restaurant not found"
          description="This restaurant may have been removed or doesn't exist."
          action={{ label: 'Go Home', onClick: () => navigate('/') }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-24">
      <div className="bg-white">
        <div className="p-6">
          <button onClick={() => navigate(-1)} className="text-orange-500 mb-4">← Back</button>
          <h1 className="text-3xl font-black text-gray-900">{restaurant.name}</h1>
          <p className="text-gray-500 mt-1">{restaurant.cuisine} • {'💸'.repeat(restaurant.priceRange)}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-orange-500">⭐</span>
            <span className="font-bold">{restaurant.rating}</span>
            <span className="text-gray-400">({restaurant.reviewCount} reviews)</span>
          </div>
          <p className="text-gray-600 mt-3">{restaurant.description}</p>
          <p className="text-gray-400 text-sm mt-2">📍 {restaurant.address}</p>
          
          <div className="flex gap-2 mt-4">
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">{restaurant.atmosphere}</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{restaurant.noiseLevel}</span>
            {restaurant.dateSuitability && <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">❤️ Date-friendly</span>}
          </div>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Menu</h2>
        {restaurant.menuItems.length === 0 ? (
          <EmptyState
            emoji="📋"
            title="Menu not available"
            description="This restaurant hasn't uploaded their menu yet. Be the first to add items!"
          />
        ) : (
          <div className="space-y-3">
            {restaurant.menuItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <div className="text-right">
                    {item.price && <span className="font-bold text-orange-600">Rp{item.price.toLocaleString()}</span>}
                    {item.isPopular && <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Popular</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowVisitForm(true)}
          className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg"
        >
          ✅ Mark as Visited
        </motion.button>
      </div>

      {showVisitForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How was it?</h2>
            <div className="flex gap-2 mb-4">
              {[1,2,3,4,5].map(n => (
                <button
                  key={n}
                  onClick={() => setVisitRating(n)}
                  className={`text-3xl ${n <= visitRating ? '' : 'opacity-30'}`}
                >
                  ⭐
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 mb-6">
              <input type="checkbox" checked={wouldReturn} onChange={e => setWouldReturn(e.target.checked)} />
              <span className="text-gray-700">Would eat again</span>
            </label>
            <div className="flex gap-3">
              <button onClick={() => setShowVisitForm(false)} className="flex-1 py-3 bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleMarkVisited} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold">Save</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
