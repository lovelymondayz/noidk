import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

const BUDGETS = [
  { emoji: '💸', label: 'Under Rp50K', value: 1 },
  { emoji: '💸💸', label: 'Rp50K–100K', value: 2 },
  { emoji: '💸💸💸', label: 'Rp100K–250K', value: 3 },
  { emoji: '💸💸💸💸', label: 'Anything', value: 4 },
]

const DISTANCES = [
  { emoji: '🚶', label: 'Walking', value: 1 },
  { emoji: '🛵', label: 'Under 5 km', value: 5 },
  { emoji: '🚗', label: 'Under 10 km', value: 10 },
  { emoji: '🌎', label: 'Anywhere', value: 50 },
]

export function DontMakeMeChoose() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [vibe, setVibe] = useState('')
  const [budget, setBudget] = useState(0)
  const [distance, setDistance] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const steps = [
    { question: "What's the vibe?", subtitle: "Tell us how you're feeling" },
    { question: "How much?", subtitle: "Budget per person" },
    { question: "How far?", subtitle: "Willing to travel" },
  ]

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await getApi().post<{ data: any }>('/roulette/dont-make-me-choose', {
        vibe,
        budget,
        distance,
      })
      setResult(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-orange-50 pb-24 px-6 pt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-black text-gray-900 mb-2">NoIDK Decides:</h2>
          <h1 className="text-3xl font-black text-orange-500 mb-4">{result.name}</h1>
          <p className="text-gray-500 mb-4">{result.cuisine} • {'💸'.repeat(result.priceRange)}</p>
          
          <div className="border-t border-orange-100 pt-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Why we picked this</h3>
            <div className="space-y-2">
              {result.reasons?.map((reason: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-gray-700">
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate('/')} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold">LET'S GO →</button>
            <button onClick={() => { setResult(null); setStep(0) }} className="flex-1 py-3 bg-gray-100 rounded-xl">TRY AGAIN</button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-24 px-6 pt-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black text-center text-gray-900 mb-2"
      >
        🤔 Don't Make Me Choose
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-gray-500 mb-8"
      >
        Answer 3 questions. We'll handle the rest.
      </motion.p>

      <div className="mb-6">
        <div className="flex gap-2">
          {[0,1,2].map(i => (
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps[step].question}</h2>
        <p className="text-gray-500 mb-6">{steps[step].subtitle}</p>

        {step === 0 && (
          <div className="grid grid-cols-2 gap-3">
            {MOODS.map(m => (
              <button
                key={m.value}
                onClick={() => setVibe(m.value)}
                className={`p-4 rounded-xl border-2 text-center transition ${vibe === m.value ? 'border-orange-500 bg-orange-50' : 'border-gray-100'}`}
              >
                <span className="text-3xl">{m.emoji}</span>
                <p className="text-sm font-medium mt-1">{m.label}</p>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            {BUDGETS.map(b => (
              <button
                key={b.value}
                onClick={() => setBudget(b.value)}
                className={`w-full p-4 rounded-xl border-2 text-left transition ${budget === b.value ? 'border-orange-500 bg-orange-50' : 'border-gray-100'}`}
              >
                <span className="font-bold">{b.emoji} {b.label}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {DISTANCES.map(d => (
              <button
                key={d.value}
                onClick={() => setDistance(d.value)}
                className={`w-full p-4 rounded-xl border-2 text-left transition ${distance === d.value ? 'border-orange-500 bg-orange-50' : 'border-gray-100'}`}
              >
                <span className="font-bold">{d.emoji} {d.label}</span>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleNext}
        disabled={loading || (step === 0 && !vibe) || (step === 1 && !budget) || (step === 2 && !distance)}
        className="w-full bg-orange-500 text-white font-black text-xl py-5 rounded-2xl shadow-xl mt-6 disabled:opacity-50"
      >
        {loading ? '✨ Picking...' : step < 2 ? 'NEXT →' : '🎲 LET NOIDK DECIDE'}
      </motion.button>
    </div>
  )
}
