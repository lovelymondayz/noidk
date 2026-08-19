package repository

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/lovelymondayz/noidk/backend/db"
)

var ErrUserNotFound = errors.New("user not found")
var ErrEmailTaken = errors.New("email already registered")

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

func (r *UserRepository) UpdateLocation(ctx context.Context, userID uuid.UUID, lat, lon float64) error {
	_, err := db.Pool.Exec(ctx, `
		UPDATE users SET latitude = $1, longitude = $2 WHERE id = $3
	`, lat, lon, userID)
	return err
}

func (r *UserRepository) GetRecentVisits(ctx context.Context, userID uuid.UUID, limit int) ([]map[string]interface{}, error) {
	rows, err := db.Pool.Query(ctx, `
		SELECT r.id, r.name, r.cuisine, r.image_url, v.visited_at, v.rating, v.would_return
		FROM visits v
		JOIN restaurants r ON r.id = v.restaurant_id
		WHERE v.user_id = $1
		ORDER BY v.visited_at DESC
		LIMIT $2
	`, userID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var visits []map[string]interface{}
	for rows.Next() {
		var id uuid.UUID
		var name, cuisine string
		var imageURL *string
		var visitedAt time.Time
		var rating *int
		var wouldReturn *bool

		err := rows.Scan(&id, &name, &cuisine, &imageURL, &visitedAt, &rating, &wouldReturn)
		if err != nil {
			return nil, err
		}

		visits = append(visits, map[string]interface{}{
			"id":          id,
			"name":        name,
			"cuisine":     cuisine,
			"imageUrl":    imageURL,
			"visitedAt":   visitedAt,
			"rating":      rating,
			"wouldReturn": wouldReturn,
		})
	}
	return visits, nil
}

func (r *UserRepository) GetStats(ctx context.Context, userID uuid.UUID) (map[string]interface{}, error) {
	var totalVisits, cuisinesTried, wouldReturnCount int
	var level, lifetimeXp int

	err := db.Pool.QueryRow(ctx, `
		SELECT 
			(SELECT COUNT(*) FROM visits WHERE user_id = $1) as total_visits,
			(SELECT COUNT(DISTINCT r.cuisine) FROM visits v JOIN restaurants r ON r.id = v.restaurant_id WHERE v.user_id = $1) as cuisines_tried,
			(SELECT COUNT(*) FROM visits WHERE user_id = $1 AND would_return = true) as would_return_count,
			(SELECT level FROM users WHERE id = $1) as level,
			(SELECT lifetime_xp FROM users WHERE id = $1) as lifetime_xp
	`, userID).Scan(&totalVisits, &cuisinesTried, &wouldReturnCount, &level, &lifetimeXp)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"totalVisits":     totalVisits,
		"cuisinesTried":   cuisinesTried,
		"wouldReturnCount": wouldReturnCount,
		"level":           level,
		"lifetimeXp":      lifetimeXp,
	}, nil
}

func (r *UserRepository) GetFoodJourney(ctx context.Context, userID uuid.UUID) ([]map[string]interface{}, error) {
	rows, err := db.Pool.Query(ctx, `
		SELECT r.id, r.name, r.cuisine, r.image_url, v.visited_at, v.rating, v.would_return, p.content, p.images
		FROM visits v
		JOIN restaurants r ON r.id = v.restaurant_id
		LEFT JOIN posts p ON p.restaurant_id = r.id AND p.user_id = v.user_id
		WHERE v.user_id = $1
		ORDER BY v.visited_at DESC
		LIMIT 50
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var journey []map[string]interface{}
	for rows.Next() {
		var id uuid.UUID
		var name, cuisine string
		var imageURL *string
		var visitedAt time.Time
		var rating, wouldReturn *int
		var content *string
		var images []string

		err := rows.Scan(&id, &name, &cuisine, &imageURL, &visitedAt, &rating, &wouldReturn, &content, &images)
		if err != nil {
			return nil, err
		}

		journey = append(journey, map[string]interface{}{
			"id":          id,
			"name":        name,
			"cuisine":     cuisine,
			"imageUrl":    imageURL,
			"visitedAt":   visitedAt,
			"rating":      rating,
			"wouldReturn": wouldReturn,
			"content":     content,
			"images":      images,
		})
	}
	return journey, nil
}

func (r *UserRepository) SearchUsers(ctx context.Context, query string) ([]map[string]interface{}, error) {
	rows, err := db.Pool.Query(ctx, `
		SELECT id, username, avatar_url, level FROM users 
		WHERE username ILIKE $1 OR email ILIKE $1
		LIMIT 10
	`, "%"+query+"%")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []map[string]interface{}
	for rows.Next() {
		var id uuid.UUID
		var username string
		var avatarURL *string
		var level int

		err := rows.Scan(&id, &username, &avatarURL, &level)
		if err != nil {
			return nil, err
		}

		users = append(users, map[string]interface{}{
			"id":        id,
			"username":  username,
			"avatarUrl": avatarURL,
			"level":     level,
		})
	}
	return users, nil
}

func (r *UserRepository) RecordVisit(ctx context.Context, userID, restaurantID uuid.UUID, rating int, wouldReturn bool) error {
	_, err := db.Pool.Exec(ctx, `
		INSERT INTO visits (user_id, restaurant_id, visited_at, rating, would_return)
		VALUES ($1, $2, NOW(), $3, $4)
	`, userID, restaurantID, rating, wouldReturn)
	return err
}
