package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/lovelymondayz/noidk/backend/repository"
	"github.com/lovelymondayz/noidk/backend/utils"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	jwtSecret     string
	jwtExpiry     int
	refreshExpiry int
	userRepo      *repository.UserRepository
}

func NewAuthHandler(jwtSecret string, jwtExpiry, refreshExpiry int) *AuthHandler {
	return &AuthHandler{
		jwtSecret:     jwtSecret,
		jwtExpiry:     jwtExpiry,
		refreshExpiry: refreshExpiry,
		userRepo:      repository.NewUserRepository(),
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

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to process password"}})
		return
	}

	userID, err := h.userRepo.Create(c.Request.Context(), req.Username, req.Email, string(hash))
	if err != nil {
		if errors.Is(err, repository.ErrEmailTaken) {
			c.JSON(http.StatusConflict, gin.H{"error": gin.H{"code": "EMAIL_TAKEN", "message": "Email already registered"}})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to create user"}})
		return
	}

	token, err := utils.GenerateJWT(userID.String(), req.Username, h.jwtSecret, h.jwtExpiry)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to generate token"}})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data": gin.H{
			"user": gin.H{
				"id":       userID.String(),
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

	user, err := h.userRepo.GetByEmail(c.Request.Context(), req.Email)
	if err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": gin.H{"code": "INVALID_CREDENTIALS", "message": "Invalid email or password"}})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to authenticate"}})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user["passwordHash"].(string)), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": gin.H{"code": "INVALID_CREDENTIALS", "message": "Invalid email or password"}})
		return
	}

	userID := user["id"].(uuid.UUID)
	username := user["username"].(string)
	token, err := utils.GenerateJWT(userID.String(), username, h.jwtSecret, h.jwtExpiry)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "INTERNAL_ERROR", "message": "Failed to generate token"}})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"user": gin.H{
				"id":       userID.String(),
				"username": username,
				"email":    req.Email,
				"level":    user["level"],
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

	token, _ := utils.GenerateJWT("mock-id", "user", h.jwtSecret, h.jwtExpiry)

	c.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"accessToken": token,
		},
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"data": gin.H{"status": "ok"}})
}
