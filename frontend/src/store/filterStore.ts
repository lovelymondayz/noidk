import { create } from 'zustand'

interface FilterState {
  mood: string | null
  budget: number | null
  distanceKm: number | null
  cuisine: string | null
  setMood: (mood: string | null) => void
  setBudget: (budget: number | null) => void
  setDistance: (distance: number | null) => void
  setCuisine: (cuisine: string | null) => void
  reset: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  mood: null,
  budget: null,
  distanceKm: null,
  cuisine: null,
  setMood: (mood) => set({ mood }),
  setBudget: (budget) => set({ budget }),
  setDistance: (distanceKm) => set({ distanceKm }),
  setCuisine: (cuisine) => set({ cuisine }),
  reset: () => set({ mood: null, budget: null, distanceKm: null, cuisine: null }),
}))
