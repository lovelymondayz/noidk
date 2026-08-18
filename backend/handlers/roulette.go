package handlers

import (
	"math"
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type RouletteHandler struct{}

func NewRouletteHandler() *RouletteHandler {
	return &RouletteHandler{}
}

func (h *RouletteHandler) Spin(c *gin.Context) {
	var req struct {
		Budget     *int     `json:"budget"`
		DistanceKm *float64 `json:"distanceKm"`
		Mood       *string  `json:"mood"`
		Cuisine    *string  `json:"cuisine"`
		Latitude   *float64 `json:"latitude"`
		Longitude  *float64 `json:"longitude"`
		Vibe       *string  `json:"vibe"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": err.Error()}})
		return
	}

	// TODO: Query restaurants from DB, apply cooldown/diversity logic, score them
	// For now, return a weighted mock response
	rand.Seed(time.Now().UnixNano())

	mockRestaurants := []gin.H{
		{"id": "1", "name": "Bakmi Orang Ketiga", "cuisine": "Chinese", "rating": 4.7, "priceRange": 1, "distanceKm": 2.3, "reasons": []string{"🔥 Trending near you", "❤️ You haven't tried it", "💸 Within your budget", "📍 Only 2.3 km away", "🍜 You haven't had noodles in 12 days"}},
		{"id": "2", "name": "Kopi & Co.", "cuisine": "Coffee", "rating": 4.8, "priceRange": 2, "distanceKm": 1.5, "reasons": []string{"☕ Perfect for a chill vibe", "⭐ Highly rated by community", "📍 Only 1.5 km away"}},
		{"id": "3", "name": "Sushi Kaze", "cuisine": "Japanese", "rating": 4.9, "priceRange": 3, "distanceKm": 3.2, "reasons": []string{"🍣 You haven't had Japanese in 10 days", "✨ Great for date night", "🔥 Featured on YouTube"}},
	}

	result := mockRestaurants[rand.Intn(len(mockRestaurants))]

	c.JSON(http.StatusOK, gin.H{
		"data": result,
	})
}

func (h *RouletteHandler) DontMakeMeChoose(c *gin.Context) {
	var req struct {
		Vibe    string `json:"vibe" binding:"required"`
		Budget  int    `json:"budget" binding:"required"`
		Distance int    `json:"distance" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": err.Error()}})
		return
	}

	// TODO: Process Q&A and return recommendation
	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"name":       "Sushi Kaze",
			"cuisine":    "Japanese",
			"rating":     4.9,
			"distanceKm": 3.2,
			"priceRange": 3,
			"reasons": []string{
				"❤️ Perfect for date night",
				"🍣 You haven't had Japanese in 10 days",
				"✨ Cozy atmosphere",
				"📍 Within your distance range",
			},
		},
	})
}
