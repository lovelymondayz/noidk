package handlers

import (
	"math/rand"
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"
	"github.com/lovelymondayz/noidk/backend/repository"
)

type RouletteHandler struct {
	repo *repository.RouletteRepository
}

func NewRouletteHandler() *RouletteHandler {
	return &RouletteHandler{
		repo: repository.NewRouletteRepository(),
	}
}

func (h *RouletteHandler) Spin(c *gin.Context) {
	var req struct {
		Budget     *int     `json:"budget"`
		DistanceKm *float64 `json:"distanceKm"`
		Mood       *string  `json:"mood"`
		Cuisine    *string  `json:"cuisine"`
		Latitude   *float64 `json:"latitude"`
		Longitude  *float64 `json:"longitude"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": err.Error()}})
		return
	}

	lat := 0.0
	lon := 0.0
	if req.Latitude != nil {
		lat = *req.Latitude
	}
	if req.Longitude != nil {
		lon = *req.Longitude
	}

	budget := 0
	if req.Budget != nil {
		budget = *req.Budget
	}

	distanceKm := 0.0
	if req.DistanceKm != nil {
		distanceKm = *req.DistanceKm
	}

	mood := ""
	if req.Mood != nil {
		mood = *req.Mood
	}

	cuisine := ""
	if req.Cuisine != nil {
		cuisine = *req.Cuisine
	}

	restaurants, err := h.repo.GetScoredRestaurants(c.Request.Context(), lat, lon, budget, distanceKm, mood, cuisine)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}

	if len(restaurants) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"data": gin.H{
				"message": "No restaurants found matching your criteria. Try adjusting your filters.",
			},
		})
		return
	}

	// Sort by score descending
	sort.Slice(restaurants, func(i, j int) bool {
		return restaurants[i]["score"].(float64) > restaurants[j]["score"].(float64)
	})

	// Pick from top 3 with some randomness
	topN := 3
	if len(restaurants) < topN {
		topN = len(restaurants)
	}

	// Weighted random pick from top N
	weights := make([]float64, topN)
	for i := 0; i < topN; i++ {
		weights[i] = restaurants[i]["score"].(float64)
	}

	totalWeight := 0.0
	for _, w := range weights {
		totalWeight += w
	}

	r := rand.Float64() * totalWeight
	cumulative := 0.0
	picked := 0
	for i, w := range weights {
		cumulative += w
		if r <= cumulative {
			picked = i
			break
		}
	}

	result := restaurants[picked]
	result["reasons"] = generateReasons(result, req)

	c.JSON(http.StatusOK, gin.H{
		"data": result,
	})
}

func generateReasons(restaurant map[string]interface{}, req struct {
	Budget     *int     `json:"budget"`
	DistanceKm *float64 `json:"distanceKm"`
	Mood       *string  `json:"mood"`
	Cuisine    *string  `json:"cuisine"`
	Latitude   *float64 `json:"latitude"`
	Longitude  *float64 `json:"longitude"`
}) []string {
	reasons := []string{}

	if restaurant["rating"].(float64) >= 4.5 {
		reasons = append(reasons, "⭐ Highly rated by community")
	}

	if restaurant["reviewCount"].(int) > 50 {
		reasons = append(reasons, "🔥 Popular spot")
	}

	if dist, ok := restaurant["distanceKm"].(float64); ok {
		if dist < 2.0 {
			reasons = append(reasons, "📍 Very close to you")
		} else if dist < 5.0 {
			reasons = append(reasons, "📍 Within your range")
		}
	}

	if restaurant["priceRange"].(int) <= 2 {
		reasons = append(reasons, "💸 Budget-friendly")
	}

	if cuisine, ok := restaurant["cuisine"].(string); ok {
		reasons = append(reasons, "🍽️ "+cuisine+" cuisine")
	}

	if len(reasons) == 0 {
		reasons = append(reasons, "✨ Recommended for you")
	}

	return reasons
}

func (h *RouletteHandler) DontMakeMeChoose(c *gin.Context) {
	var req struct {
		Vibe     string `json:"vibe" binding:"required"`
		Budget   int    `json:"budget" binding:"required"`
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
