package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/lovelymondayz/noidk/backend/db"
)

type PostRepository struct{}

func NewPostRepository() *PostRepository {
	return &PostRepository{}
}

func (r *PostRepository) Create(ctx context.Context, userID, restaurantID uuid.UUID, content string, rating *int, wouldReturn *bool, favoriteMenu, tips string, images, tags []string) (*uuid.UUID, error) {
	id := uuid.New()
	_, err := db.Pool.Exec(ctx, `
		INSERT INTO posts (id, user_id, restaurant_id, content, rating, would_return, favorite_menu, tips, images, tags)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`, id, userID, restaurantID, content, rating, wouldReturn, favoriteMenu, tips, images, tags)
	if err != nil {
		return nil, err
	}
	return &id, nil
}

func (r *PostRepository) List(ctx context.Context, filters map[string]interface{}) ([]map[string]interface{}, error) {
	query := `
		SELECT p.id, p.content, p.rating, p.would_return, p.favorite_menu, p.tips, p.images, p.tags, p.created_at,
		       u.username, u.avatar_url,
		       r.name as restaurant_name, r.id as restaurant_id
		FROM posts p
		JOIN users u ON u.id = p.user_id
		JOIN restaurants r ON r.id = p.restaurant_id
		WHERE 1=1
	`
	args := []interface{}{}
	argCount := 0

	if userID, ok := filters["userID"].(uuid.UUID); ok {
		argCount++
		query += ` AND p.user_id = $` + string(rune('0'+argCount))
		args = append(args, userID)
	}

	if restaurantID, ok := filters["restaurantID"].(uuid.UUID); ok {
		argCount++
		query += ` AND p.restaurant_id = $` + string(rune('0'+argCount))
		args = append(args, restaurantID)
	}

	query += ` ORDER BY p.created_at DESC LIMIT 50`

	rows, err := db.Pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []map[string]interface{}
	for rows.Next() {
		var id uuid.UUID
		var content string
		var rating *int
		var wouldReturn *bool
		var favoriteMenu, tips *string
		var images, tags []string
		var createdAt time.Time
		var username string
		var avatarURL *string
		var restaurantName string
		var restaurantID uuid.UUID

		err := rows.Scan(&id, &content, &rating, &wouldReturn, &favoriteMenu, &tips, &images, &tags, &createdAt,
			&username, &avatarURL, &restaurantName, &restaurantID)
		if err != nil {
			return nil, err
		}

		posts = append(posts, map[string]interface{}{
			"id":           id,
			"content":      content,
			"rating":       rating,
			"wouldReturn":  wouldReturn,
			"favoriteMenu": favoriteMenu,
			"tips":         tips,
			"images":       images,
			"tags":         tags,
			"createdAt":    createdAt,
			"user": map[string]interface{}{
				"username":  username,
				"avatarUrl": avatarURL,
			},
			"restaurant": map[string]interface{}{
				"id":   restaurantID,
				"name": restaurantName,
			},
		})
	}

	return posts, nil
}

func (r *PostRepository) Like(ctx context.Context, userID, postID uuid.UUID) error {
	_, err := db.Pool.Exec(ctx, `
		INSERT INTO votes (id, user_id, target_type, target_id, vote_type)
		VALUES ($1, $2, 'post', $3, 'like')
		ON CONFLICT DO NOTHING
	`, uuid.New(), userID, postID)
	return err
}

func (r *PostRepository) Unlike(ctx context.Context, userID, postID uuid.UUID) error {
	_, err := db.Pool.Exec(ctx, `
		DELETE FROM votes WHERE user_id = $1 AND target_type = 'post' AND target_id = $2
	`, userID, postID)
	return err
}
