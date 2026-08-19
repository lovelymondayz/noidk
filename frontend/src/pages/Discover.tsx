import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getApi } from '../services/api'
import { EmptyState } from '../components/ui/EmptyState'

interface Post {
  id: string
  content: string
  rating: number
  createdAt: string
  favoriteMenu: string
  images: string[]
  restaurant: {
    id: string
    name: string
  }
}

export function Discover() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getApi().get<{ data: { posts: Post[] } }>('/posts?limit=20')
        setPosts(res.data.posts || [])
      } catch (err) {
        console.error('Failed to fetch posts:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

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

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="text-4xl"
          >
            🔍
          </motion.div>
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          emoji="🔍"
          title="Nothing to discover yet"
          description="Be the first to share a food experience! Post about your latest meal and inspire others."
          action={{ label: 'Create Post', onClick: () => window.location.href = '/post' }}
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="bg-white rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-gray-800">{post.restaurant.name}</span>
                <span className="text-xs text-gray-400">• {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 text-sm mb-2">{post.content}</p>
              <div className="flex items-center gap-2">
                <span className="text-orange-500">⭐</span>
                <span className="font-bold text-orange-700 text-sm">{post.rating}</span>
                {post.favoriteMenu && (
                  <span className="text-xs text-gray-500">• {post.favoriteMenu}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
