import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getApi } from '../services/api'

interface SearchResult {
  id: string
  name: string
  cuisine: string
  rating: number
  priceRange: number
  address: string
  type: string
}

export function Search() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length >= 2) {
      setLoading(true)
      getApi().get<{ data: { results: SearchResult[] } }>(`/search?q=${encodeURIComponent(query)}`)
        .then(res => setResults(res.data.results))
        .catch(() => setResults([]))
        .finally(() => setLoading(false))
    } else {
      setResults([])
    }
  }, [query])

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
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Try 'spicy noodles' or 'date night'"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
        />
      </div>

      {loading && <div className="text-center text-gray-400 py-8">Searching...</div>}

      {!loading && query.length < 2 && (
        <div className="text-center text-gray-500 py-8">
          <span className="text-4xl mb-4 block">🔍</span>
          <p>Start typing to search</p>
        </div>
      )}

      {!loading && query.length >= 2 && results.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <span className="text-4xl mb-4 block">😕</span>
          <p>No results for "{query}"</p>
        </div>
      )}

      <div className="space-y-3">
        {results.map(r => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{r.type === 'restaurant' ? '🍽️' : '🍜'}</span>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{r.name}</h3>
                <p className="text-sm text-gray-500">{r.cuisine} • {r.address}</p>
              </div>
              {r.rating > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-orange-500">⭐</span>
                  <span className="font-bold text-orange-700">{r.rating}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
