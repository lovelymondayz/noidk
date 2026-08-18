package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID             uuid.UUID       `json:"id" db:"id"`
	Username       string          `json:"username" db:"username"`
	Email          string          `json:"email" db:"email"`
	PasswordHash   string          `json:"-" db:"password_hash"`
	AvatarURL      *string         `json:"avatarUrl" db:"avatar_url"`
	Bio            *string         `json:"bio" db:"bio"`
	Level          int             `json:"level" db:"level"`
	LifetimeXP     int             `json:"lifetimeXp" db:"lifetime_xp"`
	MonthlyXP      int             `json:"monthlyXp" db:"monthly_xp"`
	MonthlyXpMonth int             `json:"-" db:"monthly_xp_month"`
	Preferences    map[string]any  `json:"preferences" db:"preferences"`
	Latitude       *float64        `json:"latitude" db:"latitude"`
	Longitude      *float64        `json:"longitude" db:"longitude"`
	CreatedAt      time.Time       `json:"createdAt" db:"created_at"`
	UpdatedAt      time.Time       `json:"updatedAt" db:"updated_at"`
}

type Restaurant struct {
	ID              uuid.UUID        `json:"id" db:"id"`
	Name            string           `json:"name" db:"name"`
	Description     *string          `json:"description" db:"description"`
	Address         string           `json:"address" db:"address"`
	Latitude        float64          `json:"latitude" db:"latitude"`
	Longitude       float64          `json:"longitude" db:"longitude"`
	Cuisine         string           `json:"cuisine" db:"cuisine"`
	PriceRange      int              `json:"priceRange" db:"price_range"`
	Rating          float64          `json:"rating" db:"rating"`
	ReviewCount     int              `json:"reviewCount" db:"review_count"`
	OpeningHours    map[string]any   `json:"openingHours" db:"opening_hours"`
	Atmosphere      *string          `json:"atmosphere" db:"atmosphere"`
	NoiseLevel      *string          `json:"noiseLevel" db:"noise_level"`
	DateSuitability bool             `json:"dateSuitability" db:"date_suitability"`
	ImageURL        *string          `json:"imageUrl" db:"image_url"`
	ExternalSources map[string]any   `json:"externalSources" db:"external_sources"`
	CreatedAt       time.Time        `json:"createdAt" db:"created_at"`
	UpdatedAt       time.Time        `json:"updatedAt" db:"updated_at"`
}

type MenuItem struct {
	ID           uuid.UUID `json:"id" db:"id"`
	RestaurantID uuid.UUID `json:"restaurantId" db:"restaurant_id"`
	Name         string    `json:"name" db:"name"`
	Description  *string   `json:"description" db:"description"`
	Price        *int      `json:"price" db:"price"`
	ImageURL     *string   `json:"imageUrl" db:"image_url"`
	IsPopular    bool      `json:"isPopular" db:"is_popular"`
	CreatedAt    time.Time `json:"createdAt" db:"created_at"`
}

type Post struct {
	ID           uuid.UUID `json:"id" db:"id"`
	UserID       uuid.UUID `json:"userId" db:"user_id"`
	RestaurantID uuid.UUID `json:"restaurantId" db:"restaurant_id"`
	Content      string    `json:"content" db:"content"`
	Rating       *int      `json:"rating" db:"rating"`
	WouldReturn  *bool     `json:"wouldReturn" db:"would_return"`
	FavoriteMenu *string   `json:"favoriteMenu" db:"favorite_menu"`
	Tips         *string   `json:"tips" db:"tips"`
	Images       []string  `json:"images" db:"images"`
	Tags         []string  `json:"tags" db:"tags"`
	CreatedAt    time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt    time.Time `json:"updatedAt" db:"updated_at"`
}

type Visit struct {
	ID           uuid.UUID `json:"id" db:"id"`
	UserID       uuid.UUID `json:"userId" db:"user_id"`
	RestaurantID uuid.UUID `json:"restaurantId" db:"restaurant_id"`
	VisitedAt    time.Time `json:"visitedAt" db:"visited_at"`
	Rating       *int      `json:"rating" db:"rating"`
	WouldReturn  *bool     `json:"wouldReturn" db:"would_return"`
}

type Vote struct {
	ID         uuid.UUID `json:"id" db:"id"`
	UserID     uuid.UUID `json:"userId" db:"user_id"`
	TargetType string    `json:"targetType" db:"target_type"`
	TargetID   uuid.UUID `json:"targetId" db:"target_id"`
	VoteType   string    `json:"voteType" db:"vote_type"`
	CreatedAt  time.Time `json:"createdAt" db:"created_at"`
}

type TrendSignal struct {
	ID           uuid.UUID      `json:"id" db:"id"`
	RestaurantID uuid.UUID      `json:"restaurantId" db:"restaurant_id"`
	Source       string         `json:"source" db:"source"`
	SignalType   string         `json:"signalType" db:"signal_type"`
	Score        float64        `json:"score" db:"score"`
	Metadata     map[string]any `json:"metadata" db:"metadata"`
	CreatedAt    time.Time      `json:"createdAt" db:"created_at"`
	UpdatedAt    time.Time      `json:"updatedAt" db:"updated_at"`
}

type SavedPlace struct {
	ID           uuid.UUID `json:"id" db:"id"`
	UserID       uuid.UUID `json:"userId" db:"user_id"`
	RestaurantID uuid.UUID `json:"restaurantId" db:"restaurant_id"`
	Category     string    `json:"category" db:"category"`
	CreatedAt    time.Time `json:"createdAt" db:"created_at"`
}

type Notification struct {
	ID        uuid.UUID      `json:"id" db:"id"`
	UserID    uuid.UUID      `json:"userId" db:"user_id"`
	Type      string         `json:"type" db:"type"`
	Title     string         `json:"title" db:"title"`
	Body      *string        `json:"body" db:"body"`
	Data      map[string]any `json:"data" db:"data"`
	Read      bool           `json:"read" db:"read"`
	CreatedAt time.Time      `json:"createdAt" db:"created_at"`
}

type Contribution struct {
	ID          uuid.UUID `json:"id" db:"id"`
	UserID      uuid.UUID `json:"userId" db:"user_id"`
	Type        string    `json:"type" db:"type"`
	Points      int       `json:"points" db:"points"`
	Description *string   `json:"description" db:"description"`
	CreatedAt   time.Time `json:"createdAt" db:"created_at"`
}

type Couple struct {
	ID        uuid.UUID `json:"id" db:"id"`
	UserOne   uuid.UUID `json:"userOne" db:"user_one"`
	UserTwo   uuid.UUID `json:"userTwo" db:"user_two"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
}

type Group struct {
	ID        uuid.UUID `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	CreatorID uuid.UUID `json:"creatorId" db:"creator_id"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
}

type GroupMember struct {
	GroupID  uuid.UUID `json:"groupId" db:"group_id"`
	UserID   uuid.UUID `json:"userId" db:"user_id"`
	JoinedAt time.Time `json:"joinedAt" db:"joined_at"`
}

type GroupVote struct {
	ID           uuid.UUID `json:"id" db:"id"`
	GroupID      uuid.UUID `json:"groupId" db:"group_id"`
	RestaurantID uuid.UUID `json:"restaurantId" db:"restaurant_id"`
	UserID       uuid.UUID `json:"userId" db:"user_id"`
	VoteType     string    `json:"voteType" db:"vote_type"`
	CreatedAt    time.Time `json:"createdAt" db:"created_at"`
}

type LeaderboardEntry struct {
	UserID    uuid.UUID `json:"userId" db:"user_id"`
	Username  string    `json:"username" db:"username"`
	AvatarURL *string   `json:"avatarUrl" db:"avatar_url"`
	MonthlyXP int       `json:"monthlyXp" db:"monthly_xp"`
	Rank      int       `json:"rank"`
}

type ScoredRestaurant struct {
	Restaurant
	Score   float64  `json:"score"`
	Reasons []string `json:"reasons"`
}

type RecommendationInput struct {
	UserID     *uuid.UUID `json:"userId"`
	Latitude   *float64   `json:"latitude"`
	Longitude  *float64   `json:"longitude"`
	Budget     *int       `json:"budget"`
	DistanceKm *float64   `json:"distanceKm"`
	Mood       *string    `json:"mood"`
	Cuisine    *string    `json:"cuisine"`
	GroupSize  *int       `json:"groupSize"`
	Vibe       *string    `json:"vibe"`
}
