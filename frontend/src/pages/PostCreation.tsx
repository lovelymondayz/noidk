import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApi } from '../services/api'

export function PostCreation() {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(5)
  const [wouldReturn, setWouldReturn] = useState(true)
  const [favoriteMenu, setFavoriteMenu] = useState('')
  const [tips, setTips] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleImageAdd = () => {
    const url = prompt('Enter image URL:')
    if (url) setImages([...images, url])
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await getApi().post('/posts', {
        restaurantId: 'temp-restaurant-id',
        content,
        rating,
        wouldReturn,
        favoriteMenu,
        tips,
        tags,
        images,
      })
      navigate('/')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-24 px-6 pt-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black text-gray-900 mb-2"
      >
        Share Your Experience
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-500 mb-8"
      >
        Tell the community about this place
      </motion.p>

      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition resize-none"
            rows={4}
            placeholder="What did you think?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className={`text-3xl ${n <= rating ? '' : 'opacity-30'}`}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Favorite Menu</label>
          <input
            type="text"
            value={favoriteMenu}
            onChange={e => setFavoriteMenu(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
            placeholder="What dish did you love?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tips</label>
          <input
            type="text"
            value={tips}
            onChange={e => setTips(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
            placeholder="Any pro tips?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTag()}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-500 outline-none"
              placeholder="Add tag..."
            />
            <button onClick={addTag} className="px-4 py-2 bg-orange-100 text-orange-700 rounded-xl font-medium">Add</button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {images.map(img => (
              <img key={img} src={img} alt="" className="w-16 h-16 rounded-lg object-cover" />
            ))}
          </div>
          <button onClick={handleImageAdd} className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium">
            + Add Photo URL
          </button>
        </div>

        <label className="flex items-center gap-2 pt-2">
          <input type="checkbox" checked={wouldReturn} onChange={e => setWouldReturn(e.target.checked)} />
          <span className="text-gray-700">Would eat again</span>
        </label>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={loading || !content}
        className="w-full bg-orange-500 text-white font-black text-xl py-5 rounded-2xl shadow-xl mt-6 disabled:opacity-50"
      >
        {loading ? 'Posting...' : '📝 Post Review'}
      </motion.button>
    </div>
  )
}
