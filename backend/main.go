package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/lovelymondayz/noidk/backend/config"
	"github.com/lovelymondayz/noidk/backend/db"
	"github.com/lovelymondayz/noidk/backend/handlers"
	"github.com/lovelymondayz/noidk/backend/middleware"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	cfg := config.Load()
	db.Connect(cfg.DatabaseURL)
	defer db.Close()

	r := gin.Default()
	r.Use(middleware.CORS(cfg.CORSOrigin))

	// Health
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "app": "noidk"})
	})

	// Handlers
	authHandler := handlers.NewAuthHandler(cfg.JWTSecret, cfg.JWTExpiry, cfg.RefreshExpiry)
	restaurantHandler := handlers.NewRestaurantHandler()
	postHandler := handlers.NewPostHandler()
	rouletteHandler := handlers.NewRouletteHandler()

	// Auth routes
	r.POST("/api/auth/register", authHandler.Register)
	r.POST("/api/auth/login", authHandler.Login)
	r.POST("/api/auth/refresh", authHandler.Refresh)
	r.POST("/api/auth/logout", authHandler.Logout)

	// Restaurant routes
	r.GET("/api/restaurants", restaurantHandler.List)
	r.GET("/api/restaurants/search", restaurantHandler.Search)
	r.POST("/api/restaurants", middleware.AuthRequired(), restaurantHandler.Create)
	r.GET("/api/restaurants/:id", restaurantHandler.Get)

	// Post routes
	r.GET("/api/posts", postHandler.List)
	r.POST("/api/posts", middleware.AuthRequired(), postHandler.Create)
	r.POST("/api/posts/:id/like", middleware.AuthRequired(), postHandler.Like)
	r.POST("/api/posts/:id/comment", middleware.AuthRequired(), postHandler.Comment)

	// Roulette routes
	r.POST("/api/roulette/spin", rouletteHandler.Spin)
	r.POST("/api/roulette/dont-make-me-choose", rouletteHandler.DontMakeMeChoose)

	log.Printf("🚀 NoIDK backend starting on :%s", cfg.AppPort)
	if err := r.Run(":" + cfg.AppPort); err != nil {
		log.Fatal(err)
	}
}
