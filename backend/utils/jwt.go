package utils

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"

	"github.com/golang-jwt/jwt"
)

func GenerateRandomSecret(length int) string {
	b := make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		return "fallback-secret-change-me"
	}
	return hex.EncodeToString(b)
}

func GenerateJWT(userID, username, secret string, expiryMinutes int) (string, error) {
	claims := jwt.MapClaims{
		"user_id":  userID,
		"username": username,
		"exp":      expiryMinutes * 60,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func ParseJWT(tokenString, secret string) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secret), nil
	})
}

func FormatID(id [16]byte) string {
	return fmt.Sprintf("%x-%x-%x-%x-%x", id[0:4], id[4:6], id[6:8], id[8:10], id[10:16])
}
