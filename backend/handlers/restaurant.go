package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type RestaurantHandler struct{}

func NewRestaurantHandler() *RestaurantHandler {
	return &RestaurantHandler{}
}

func (h *RestaurantHandler) List(c *gin.Context) {
	// TODO: Parse filters (mood, budget, distance, cuisine)
	// TODO: Query DB with filters

	// Mock response
	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"restaurants": []gin.H{
				{"id": "1", "name": "Bakmi Orang Ketiga", "cuisine": "chinese", "rating": 4.7, "priceRange": 1},
				{"id": "2", "name": "Kopi & Co.", "cuisine": "coffee", "rating": 4.8, "priceRange": 2},
				{"id": "3", "name": "Sushi Kaze", "cuisine": "japanese", "rating": 4.9, "priceRange": 3},
			},
			"meta": gin.H{"page": 1, "limit": 20, "total": 3},
		},
	})
}

func (h *RestaurantHandler) Get(c *gin.Context) {
	id := c.Param("id")

	// TODO: Query DB for restaurant detail
	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"id":          id,
			"name":        "Bakmi Orang Ketiga",
			"description": "Legendary noodle joint",
			"address":     "Jl. Sabang No. 52, Menteng",
			"cuisine":     "chinese",
			"rating":      4.7,
			"priceRange":  1,
			"menuItems": []gin.H{
				{"id": "1", "name": "Bakmi Ayam Chili Oil", "price": 45000},
				{"id": "2", "name": "Bakmi Special", "price": 55000},
			},
		},
	})
}

func (h *RestaurantHandler) Search(c *gin.Context) {
	query := c.Query("q")

	// TODO: Full-text search
	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"results": []gin.H{
				{"id": "1", "name": "Bakmi Orang Ketiga", "type": "restaurant"},
			},
			"query": query,
		},
	})
}

func (h *RestaurantHandler) Create(c *gin.Context) {
	var req struct {
		Name        string  `json:"name" binding:"required"`
		Description string  `json:"description"`
		Address     string  `json:"address" binding:"required"`
		Latitude    float64 `json:"latitude" binding:"required"`
		Longitude   float64 `json:"longitude" binding:"required"`
		Cuisine     string  `json:"cuisine" binding:"required"`
		PriceRange  int     `json:"priceRange" binding:"required,min=1,max=4"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": err.Error()}})
		return
	}

	// TODO: Save to DB
	c.JSON(http.StatusCreated, gin.H{
		"data": gin.H{
			"id":   "new-restaurant-id",
			"name": req.Name,
		},
	})
}
