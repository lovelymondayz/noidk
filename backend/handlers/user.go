package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/lovelymondayz/noidk/backend/repository"
)

type UserHandler struct {
	repo *repository.UserRepository
}

func NewUserHandler() *UserHandler {
	return &UserHandler{
		repo: repository.NewUserRepository(),
	}
}

func (h *UserHandler) GetProfile(c *gin.Context) {
	userID := c.Param("id")
	profile, err := h.repo.GetByID(c.Request.Context(), uuid.MustParse(userID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "NOT_FOUND", "message": err.Error()}})
		return
	}

	visits, _ := h.repo.GetRecentVisits(c.Request.Context(), uuid.MustParse(userID), 10)
	stats, _ := h.repo.GetStats(c.Request.Context(), uuid.MustParse(userID))

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"user":  profile,
			"visits": visits,
			"stats":  stats,
		},
	})
}

func (h *UserHandler) UpdateLocation(c *gin.Context) {
	var req struct {
		Latitude  float64 `json:"latitude" binding:"required"`
		Longitude float64 `json:"longitude" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": err.Error()}})
		return
	}

	userID := c.GetString("userID")
	if userID == "" {
		userID = "00000000-0000-0000-0000-000000000001"
	}

	if err := h.repo.UpdateLocation(c.Request.Context(), uuid.MustParse(userID), req.Latitude, req.Longitude); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": gin.H{"status": "ok"}})
}

func (h *UserHandler) GetVisits(c *gin.Context) {
	userID := c.Param("id")
	visits, err := h.repo.GetRecentVisits(c.Request.Context(), uuid.MustParse(userID), 20)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": gin.H{"visits": visits}})
}

func (h *UserHandler) GetFoodJourney(c *gin.Context) {
	userID := c.Param("id")
	journey, err := h.repo.GetFoodJourney(c.Request.Context(), uuid.MustParse(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": gin.H{"journey": journey}})
}
