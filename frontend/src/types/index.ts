export interface User {
  id: string
  username: string
  email: string
  avatarUrl?: string
  bio?: string
  level: number
  lifetimeXp: number
  monthlyXp: number
  preferences: {
    cuisines?: string[]
    budget?: number
    distance?: number
    cooldownDays?: number
  }
  latitude?: number
  longitude?: number
  createdAt: string
}

export interface Restaurant {
  id: string
  name: string
  description?: string
  address: string
  latitude: number
  longitude: number
  cuisine: string
  priceRange: number
  rating: number
  reviewCount: number
  openingHours?: Record<string, { open: string; close: string }>
  atmosphere?: string
  noiseLevel?: string
  dateSuitability?: boolean
  imageUrl?: string
  externalSources?: Record<string, unknown>
  createdAt: string
}

export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  description?: string
  price?: number
  imageUrl?: string
  isPopular: boolean
  createdAt: string
}

export interface Post {
  id: string
  userId: string
  restaurantId: string
  content: string
  rating?: number
  wouldReturn?: boolean
  favoriteMenu?: string
  tips?: string
  images: string[]
  tags: string[]
  createdAt: string
  user?: User
  restaurant?: Restaurant
}

export interface Visit {
  id: string
  userId: string
  restaurantId: string
  visitedAt: string
  rating?: number
  wouldReturn?: boolean
}

export interface Vote {
  id: string
  userId: string
  targetType: 'restaurant' | 'post' | 'menu_item'
  targetId: string
  voteType: 'yes' | 'maybe' | 'no'
}

export interface TrendSignal {
  id: string
  restaurantId: string
  source: string
  signalType: string
  score: number
  metadata?: Record<string, unknown>
}

export interface SavedPlace {
  id: string
  userId: string
  restaurantId: string
  category: 'want_to_try' | 'food' | 'coffee' | 'date_ideas' | 'trending' | 'favorites'
  createdAt: string
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  body?: string
  data?: Record<string, unknown>
  read: boolean
  createdAt: string
}

export interface Contribution {
  id: string
  userId: string
  type: string
  points: number
  description?: string
  createdAt: string
}

export interface Couple {
  id: string
  userOne: string
  userTwo: string
  createdAt: string
}

export interface Group {
  id: string
  name: string
  creatorId: string
  createdAt: string
  members?: User[]
}

export interface GroupVote {
  id: string
  groupId: string
  restaurantId: string
  userId: string
  voteType: 'yes' | 'maybe' | 'no'
}

export interface LeaderboardEntry {
  userId: string
  username: string
  avatarUrl?: string
  monthlyXp: number
  rank: number
}

export interface ScoredRestaurant extends Restaurant {
  score: number
  reasons: string[]
}

export interface RecommendationInput {
  userId?: string
  latitude?: number
  longitude?: number
  budget?: number
  distanceKm?: number
  mood?: string
  cuisine?: string
  groupSize?: number
  vibe?: string
}
