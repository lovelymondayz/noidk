import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  { title: 'Welcome to NoIDK 🎲', subtitle: "Never argue about where to eat again" },
  { title: 'Your Food Preferences', subtitle: 'What cuisines do you love?' },
  { title: 'Budget', subtitle: 'How much do you usually spend?' },
  { title: 'Location', subtitle: 'Where are you eating?' },
  { title: 'Your First Pick', subtitle: "Let NoIDK decide for you!" },
]

const CUISINES = ['🍣 Japanese', '🍜 Chinese', '🍕 Italian', '🌮 Mexican', '🍛 Indian', '🥗 Healthy', '🍔 American', '☕ Coffee']
const BUDGETS = ['💸 Under Rp50K', '💸💸 Rp50K–100K', '💸💸💸 Rp100K–250K', '💸💸💸💸 Anything']

export function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [selectedBudget, setSelectedBudget] = useState('')
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const toggleCuisine = (c: string) => {
    setSelectedCuisines(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1)
    else navigate('/')
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      return
    }

    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Could save to backend here
        console.log('Location:', position.coords.latitude, position.coords.longitude)
        setLocationStatus('success')
      },
      (error) => {
        console.error('Geolocation error:', error)
        setLocationStatus('error')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  return (
    <div className="min-h-screen bg-orange-50 px-6 py-12 flex flex-col">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="mb-6">
          <div className="flex gap-2">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-orange-500' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h1 className="text-2xl font-black text-gray-900 mb-2">{STEPS[step].title}</h1>
          <p className="text-gray-500 mb-6">{STEPS[step].subtitle}</p>

          {step === 0 && (
            <div className="text-center py-8">
              <span className="text-6xl">🎲</span>
              <p className="text-gray-600 mt-4">Tell us what you like, and we'll pick your next meal.</p>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {CUISINES.map(c => (
                <button
                  key={c}
                  onClick={() => toggleCuisine(c)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition ${selectedCuisines.includes(c) ? 'border-orange-500 bg-orange-50' : 'border-gray-100'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBudget(b)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${selectedBudget === b ? 'border-orange-500 bg-orange-50' : 'border-gray-100'}`}
                >
                  {b}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <span className="text-6xl">📍</span>
              <p className="text-gray-600 mt-4">Enable location for better recommendations</p>
              {locationStatus === 'success' ? (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
                  ✅ Location enabled!
                </div>
              ) : locationStatus === 'error' ? (
                <div className="mt-4">
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm font-medium mb-3">
                    ❌ Could not get location. Please enable location permissions.
                  </div>
                  <button
                    onClick={handleGetLocation}
                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGetLocation}
                  disabled={locationStatus === 'loading'}
                  className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold disabled:opacity-50"
                >
                  {locationStatus === 'loading' ? '📡 Getting location...' : '📍 Allow Location'}
                </button>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <span className="text-6xl">🎉</span>
              <p className="text-gray-600 mt-4">You're ready! Let NoIDK pick your first meal.</p>
            </div>
          )}
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full bg-orange-500 text-white font-black text-xl py-5 rounded-2xl shadow-xl mt-6"
        >
          {step < STEPS.length - 1 ? 'NEXT →' : "🎲 LET'S GO!"}
        </motion.button>
      </div>
    </div>
  )
}
