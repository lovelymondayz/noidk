import { motion } from 'framer-motion'

interface MoodFilterProps {
  moods: { emoji: string; label: string; value: string }[]
  selected: string | null
  onSelect: (mood: string | null) => void
}

export function MoodFilter({ moods, selected, onSelect }: MoodFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {moods.map((mood) => (
        <motion.button
          key={mood.value}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(selected === mood.value ? null : mood.value)}
          className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === mood.value
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-gray-600 border border-orange-200 hover:border-orange-400'
          }`}
        >
          <span>{mood.emoji}</span>
          <span>{mood.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

interface BudgetFilterProps {
  budgets: { emoji: string; label: string; value: number }[]
  selected: number | null
  onSelect: (budget: number | null) => void
}

export function BudgetFilter({ budgets, selected, onSelect }: BudgetFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {budgets.map((budget) => (
        <motion.button
          key={budget.value}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(selected === budget.value ? null : budget.value)}
          className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === budget.value
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-gray-600 border border-orange-200 hover:border-orange-400'
          }`}
        >
          <span>{budget.emoji}</span>
          <span>{budget.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

interface DistanceFilterProps {
  distances: { emoji: string; label: string; value: number }[]
  selected: number | null
  onSelect: (distance: number | null) => void
}

export function DistanceFilter({ distances, selected, onSelect }: DistanceFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {distances.map((distance) => (
        <motion.button
          key={distance.value}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(selected === distance.value ? null : distance.value)}
          className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === distance.value
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-gray-600 border border-orange-200 hover:border-orange-400'
          }`}
        >
          <span>{distance.emoji}</span>
          <span>{distance.label}</span>
        </motion.button>
      ))}
    </div>
  )
}
