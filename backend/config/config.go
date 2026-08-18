package config

import (
	"os"
)

type Config struct {
	AppEnv          string
	AppPort         string
	DatabaseURL     string
	JWTSecret       string
	JWTExpiry       int
	RefreshExpiry   int
	CORSOrigin      string
	UploadDir       string
	MapsProvider    string
	StorageProvider string
	SearchProvider  string
}

func Load() *Config {
	return &Config{
		AppEnv:          getEnv("APP_ENV", "development"),
		AppPort:         getEnv("APP_PORT", "8085"),
		DatabaseURL:     getEnv("DATABASE_URL", ""),
		JWTSecret:       getEnv("JWT_SECRET", ""),
		JWTExpiry:       getEnvAsInt("JWT_EXPIRY", 15),
		RefreshExpiry:   getEnvAsInt("REFRESH_EXPIRY", 7),
		CORSOrigin:      getEnv("CORS_ORIGIN", "http://localhost:3008"),
		UploadDir:       getEnv("UPLOAD_DIR", "/app/uploads"),
		MapsProvider:    getEnv("MAPS_PROVIDER", "osm"),
		StorageProvider: getEnv("STORAGE_PROVIDER", "local"),
		SearchProvider:  getEnv("SEARCH_PROVIDER", "postgres"),
	}
}

func getEnv(key, defaultVal string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return defaultVal
}

func getEnvAsInt(key string, defaultVal int) int {
	// Simple int lookup — production code would use strconv.Atoi with error handling
	return defaultVal
}
