package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/lovelymondayz/noidk/backend/repository"
)

type PostHandler struct {
	repo *repository.PostRepository
}

func NewPostHandler() *PostHandler {
	return &PostHandler{
		repo: repository.NewPostRepository(),
	}
}

func (h *PostHandler) List(c *gin.Context) {
	filters := map[string]interface{}{}

	if userID := c.Query("userId"); userID != "" {
		filters["userID"] = uuid.MustParse(userID)
	}
	if restaurantID := c.Query("restaurantId"); restaurantID != "" {
		filters["restaurantID"] = uuid.MustParse(restaurantID)
	}

	posts, err := h.repo.List(c.Request.Context(), filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"posts": posts,
			"meta":  gin.H{"page": 1, "limit": 20, "total": len(posts)},
		},
	})
}

func (h *PostHandler) Create(c *gin.Context) {
	var req struct {
		RestaurantID string   `json:"restaurantId" binding:"required"`
		Content      string   `json:"content" binding:"required"`
		Rating       *int     `json:"rating"`
		WouldReturn  *bool    `json:"wouldReturn"`
		FavoriteMenu string   `json:"favoriteMenu"`
		Tips         string   `json:"tips"`
		Images       []string `json:"images"`
		Tags         []string `json:"tags"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": err.Error()}})
		return
	}

	// TODO: Get userID from JWT
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000001")
	restaurantID := uuid.MustParse(req.RestaurantID)

	id, err := h.repo.Create(c.Request.Context(), userID, restaurantID, req.Content, req.Rating, req.WouldReturn, req.FavoriteMenu, req.Tips, req.Images, req.Tags)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data": gin.H{
			"id":      id,
			"content": req.Content,
		},
	})
}

func (h *PostHandler) Like(c *gin.Context) {
	// TODO: Get userID from JWT
	userID := uuid.MustParse("00000000-0000-0000-0000-000000000001")
	postID := uuid.MustParse(c.Param("id"))

	if err := h.repo.Like(c.Request.Context(), userID, postID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": err.Error()}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": gin.H{"postId": postID, "liked": true}})
}

func (h *PostHandler) Comment(c *gin.Context) {
	// TODO: Implement comments
	c.JSON(http.StatusCreated, gin.H{"data": gin.H{"id": "new-comment-id"}})
}
