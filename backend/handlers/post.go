package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type PostHandler struct{}

func NewPostHandler() *PostHandler {
	return &PostHandler{}
}

func (h *PostHandler) List(c *gin.Context) {
	// TODO: Parse filters (userId, restaurantId, sort)
	// TODO: Query DB

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"posts": []gin.H{
				{"id": "1", "user": gin.H{"username": "mika"}, "restaurant": gin.H{"name": "Bakmi Orang Ketiga"}, "content": "The chili oil noodles are insane!", "rating": 5},
				{"id": "2", "user": gin.H{"username": "josh"}, "restaurant": gin.H{"name": "BurgerBarn"}, "content": "Smash burger done right 🍔", "rating": 4},
			},
			"meta": gin.H{"page": 1, "limit": 20, "total": 2},
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

	// TODO: Save to DB
	c.JSON(http.StatusCreated, gin.H{
		"data": gin.H{
			"id":      "new-post-id",
			"content": req.Content,
		},
	})
}

func (h *PostHandler) Like(c *gin.Context) {
	id := c.Param("id")
	// TODO: Toggle like in DB
	c.JSON(http.StatusOK, gin.H{"data": gin.H{"postId": id, "liked": true}})
}

func (h *PostHandler) Comment(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": err.Error()}})
		return
	}

	// TODO: Save comment to DB
	c.JSON(http.StatusCreated, gin.H{
		"data": gin.H{
			"id":      "new-comment-id",
			"postId":  id,
			"content": req.Content,
		},
	})
}
