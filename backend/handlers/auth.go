package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lovelymondayz/noidk/backend/db"
	"github.com/lovelymondayz/noidk/backend/utils"
)

type AuthHandler struct {
	jwtSecret     string
	jwtExpiry     int
	refreshExpiry int
}

func NewAuthHandler(jwtSecret string, jwtExpiry, refreshExpiry int) *AuthHandler {
	return &AuthHandler{
		jwtSecret:     jwtSecret,
		jwtExpiry:     jwtExpiry,
		refreshExpiry: refreshExpiry,
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req struct {
		Username string `json:"username" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": err.Error()}})
		return
	}

	// TODO: Hash password, save to DB
	// For now, return a mock token
	token, _ := utils.GenerateJWT("mock-id", req.Username, h.jwtSecret, h.jwtExpiry)

	c.JSON(http.StatusCreated, gin.H{
		"data": gin.H{
			"user": gin.H{
				"id":       "mock-id",
				"username": req.Username,
				"email":    req.Email,
				"level":    1,
			},
			"accessToken": token,
		},
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": err.Error()}})
		return
	}

	// TODO: Verify credentials
	token, _ := utils.GenerateJWT("mock-id", "user", h.jwtSecret, h.jwtExpiry)

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"user": gin.H{
				"id":       "mock-id",
				"username": "user",
				"email":    req.Email,
				"level":    1,
			},
			"accessToken": token,
		},
	})
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refreshToken"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "VALIDATION_ERROR", "message": err.Error()}})
		return
	}

	// TODO: Validate refresh token
	token, _ := utils.GenerateJWT("mock-id", "user", h.jwtSecret, h.jwtExpiry)

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"accessToken": token,
		},
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	// TODO: Invalidate token
	c.JSON(http.StatusOK, gin.H{"data": gin.H{"status": "ok"}})
}
