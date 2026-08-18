import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement login
    console.log('Login:', email, password)
  }

  return (
    <div className="min-h-screen bg-orange-50 px-6 py-12">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-black text-orange-500 mb-2">🎲 NoIDK</h1>
          <p className="text-gray-600">Never argue about where to eat again.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome back</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="w-full btn-primary mt-6 text-lg">
            Login
          </button>

          <p className="text-center text-gray-500 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-500 font-medium hover:underline">
              Register
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  )
}
