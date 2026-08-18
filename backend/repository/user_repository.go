package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/lovelymondayz/noidk/backend/db"
)

var ErrUserNotFound = errors.New("user not found")
var ErrEmailTaken = errors.New("email already registered")
var ErrUsernameTaken = errors.New("username already taken")

type UserRepository struct{}

func NewUserRepository() *UserRepository {
	return &UserRepository{}
}

func (r *UserRepository) Create(ctx context.Context, username, email, passwordHash string) (*uuid.UUID, error) {
	var existingID uuid.UUID
	err := db.Pool.QueryRow(ctx, "SELECT id FROM users WHERE email = $1 OR username = $2", email, username).Scan(&existingID)
	if err == nil {
		return nil, ErrEmailTaken
	}

	id := uuid.New()
	_, err = db.Pool.Exec(ctx, `
		INSERT INTO users (id, username, email, password_hash, level, lifetime_xp, monthly_xp)
		VALUES ($1, $2, $3, $4, 1, 0, 0)
	`, id, username, email, passwordHash)
	if err != nil {
		return nil, err
	}

	return &id, nil
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (map[string]interface{}, error) {
	var id uuid.UUID
	var username, storedHash string
	var level, lifetimeXp, monthlyXp int

	err := db.Pool.QueryRow(ctx, `
		SELECT id, username, password_hash, level, lifetime_xp, monthly_xp FROM users WHERE email = $1
	`, email).Scan(&id, &username, &storedHash, &level, &lifetimeXp, &monthlyXp)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	return map[string]interface{}{
		"id":          id,
		"username":    username,
		"email":       email,
		"passwordHash": storedHash,
		"level":       level,
		"lifetimeXp":  lifetimeXp,
		"monthlyXp":   monthlyXp,
	}, nil
}

func (r *UserRepository) GetByID(ctx context.Context, id uuid.UUID) (map[string]interface{}, error) {
	var username, email string
	var level, lifetimeXp, monthlyXp int
	var avatarURL, bio *string

	err := db.Pool.QueryRow(ctx, `
		SELECT username, email, level, lifetime_xp, monthly_xp, avatar_url, bio FROM users WHERE id = $1
	`, id).Scan(&username, &email, &level, &lifetimeXp, &monthlyXp, &avatarURL, &bio)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	return map[string]interface{}{
		"id":          id,
		"username":    username,
		"email":       email,
		"level":       level,
		"lifetimeXp":  lifetimeXp,
		"monthlyXp":   monthlyXp,
		"avatarUrl":   avatarURL,
		"bio":         bio,
	}, nil
}

func (r *UserRepository) UpdateXP(ctx context.Context, userID uuid.UUID, points int) error {
	_, err := db.Pool.Exec(ctx, `
		UPDATE users SET lifetime_xp = lifetime_xp + $1, monthly_xp = monthly_xp + $1 WHERE id = $2
	`, points, userID)
	return err
}
