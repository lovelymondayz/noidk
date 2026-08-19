package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/lovelymondayz/noidk/backend/repository"
)

type RestaurantHandler struct {
	repo *repository.RestaurantRepository
}

func NewRestaurantHandler() *RestaurantHandler {
	return &RestaurantHandler{
		repo: repository.NewRestaurantRepository(),
	}
}

func (h *RestaurantHandler) List(c *gin.Context) {
	filters := map[string]interface{}{}

	if cuisine := c.Query("cuisine"); cuisine != "" {
		filters["cuisine"] = cuisine
	}
	if budget := c.Query("budget"); budget != "" {
		if b, err := strconv.Atoi(budget); err == nil {
			filters["budget"] = b
		}
	}
	if mood := c.Query("mood"); mood != "" {
		filters["mood"] = mood
	}

	// Location-based filtering
	lat, latErr := strconv.ParseFloat(c.Query("lat"), 64)
	lon, lonErr := strconv.ParseFloat(c.Query("lon"), 64)
	dist, distErr := strconv.ParseFloat(c.Query("dist"), 64)

	if latErr == nil && lonErr == nil {
		filters["latitude"] = lat
		filters["longitude"] = lon
		if distErr == nil && dist > 0 {
			filters["distanceKm"] = dist
		}
	}

	restaurants, total, err := h.repo.List(c.Request.Context(), filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"restaurants": restaurants,
			"meta": gin.H{"page": 1, "limit": 20, "total": total},
		},
	})
}

func (h *RestaurantHandler) Get(c *gin.Context) {
	id := c.Param("id")
	restaurant, err := h.repo.GetByID(c.Request.Context(), parseUUID(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "NOT_FOUND", "message": err.Error()}})
		return
	}

	menuItems, err := h.repo.GetMenuItems(c.Request.Context(), parseUUID(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}

	restaurant["menuItems"] = menuItems
	c.JSON(http.StatusOK, gin.H{"data": restaurant})
}

func (h *RestaurantHandler) Search(c *gin.Context) {
	query := c.Query("q")
	results, err := h.repo.Search(c.Request.Context(), query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"results": results,
			"query":   query,
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

	id, err := h.repo.Create(c.Request.Context(), req.Name, req.Description, req.Address, req.Latitude, req.Longitude, req.Cuisine, req.PriceRange)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data": gin.H{
			"id":   id,
			"name": req.Name,
		},
	})
}

func (h *RestaurantHandler) FullSearch(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusOK, gin.H{"data": gin.H{"results": []interface{}{}, "query": ""}})
		return
	}

	results, err := h.repo.FullSearch(c.Request.Context(), query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"results": results,
			"query":   query,
		},
	})
}

func (h *RestaurantHandler) MarkVisited(c *gin.Context) {
	var req struct {
		Rating      int  `json:"rating" binding:"required,min=1,max=5"`
		WouldReturn bool `json:"wouldReturn"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": err.Error()}})
		return
	}

	// TODO: Get userID from JWT
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000001")
	restaurantID := uuid.MustParse(c.Param("id"))

	if err := h.repo.MarkVisited(c.Request.Context(), userID, restaurantID, req.Rating, req.WouldReturn); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": gin.H{"status": "ok"}})
}

func parseUUID(id string) uuid.UUID {
	// In production, handle parse errors
	return uuid.MustParse(id)
}
