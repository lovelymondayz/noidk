package repository

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/lovelymondayz/noidk/backend/db"
)

type RestaurantRepository struct{}

func NewRestaurantRepository() *RestaurantRepository {
	return &RestaurantRepository{}
}

func (r *RestaurantRepository) List(ctx context.Context, filters map[string]interface{}) ([]map[string]interface{}, int, error) {
	query := `
		SELECT r.id, r.name, r.cuisine, r.price_range, r.rating, r.review_count, r.address, r.latitude, r.longitude, r.image_url,
		       COUNT(DISTINCT v.id) as visit_count,
		       COUNT(DISTINCT p.id) as post_count
		FROM restaurants r
		LEFT JOIN visits v ON v.restaurant_id = r.id
		LEFT JOIN posts p ON p.restaurant_id = r.id
		WHERE 1=1
	`
	args := []interface{}{}
	argCount := 0

	if cuisine, ok := filters["cuisine"].(string); ok && cuisine != "" {
		argCount++
		query += ` AND r.cuisine = $` + string(rune('0'+argCount))
		args = append(args, cuisine)
	}

	if budget, ok := filters["budget"].(int); ok && budget > 0 {
		argCount++
		query += ` AND r.price_range <= $` + string(rune('0'+argCount))
		args = append(args, budget)
	}

	if mood, ok := filters["mood"].(string); ok && mood != "" {
		argCount++
		query += ` AND r.atmosphere ILIKE $` + string(rune('0'+argCount))
		args = append(args, "%"+mood+"%")
	}

	query += ` GROUP BY r.id ORDER BY r.rating DESC, r.review_count DESC`

	rows, err := db.Pool.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var restaurants []map[string]interface{}
	for rows.Next() {
		var id uuid.UUID
		var name, cuisine, address string
		var priceRange int
		var rating float64
		var reviewCount int
		var lat, lon float64
		var imageURL *string
		var visitCount, postCount int

		err := rows.Scan(&id, &name, &cuisine, &priceRange, &rating, &reviewCount, &address, &lat, &lon, &imageURL, &visitCount, &postCount)
		if err != nil {
			return nil, 0, err
		}

		restaurants = append(restaurants, map[string]interface{}{
			"id":          id,
			"name":        name,
			"cuisine":     cuisine,
			"priceRange":  priceRange,
			"rating":      rating,
			"reviewCount": reviewCount,
			"address":     address,
			"latitude":    lat,
			"longitude":   lon,
			"imageUrl":    imageURL,
			"visitCount":  visitCount,
			"postCount":   postCount,
		})
	}

	return restaurants, len(restaurants), nil
}

func (r *RestaurantRepository) GetByID(ctx context.Context, id uuid.UUID) (map[string]interface{}, error) {
	var name, cuisine, address string
	var priceRange int
	var rating float64
	var reviewCount int
	var lat, lon float64
	var imageURL, description, atmosphere, noiseLevel *string
	var dateSuitability bool

	err := db.Pool.QueryRow(ctx, `
		SELECT name, description, address, latitude, longitude, cuisine, price_range, rating, review_count, opening_hours, atmosphere, noise_level, date_suitability, image_url
		FROM restaurants WHERE id = $1
	`, id).Scan(&name, &description, &address, &lat, &lon, &cuisine, &priceRange, &rating, &reviewCount, nil, &atmosphere, &noiseLevel, &dateSuitability, &imageURL)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errors.New("restaurant not found")
		}
		return nil, err
	}

	return map[string]interface{}{
		"id":              id,
		"name":            name,
		"description":     description,
		"address":         address,
		"latitude":        lat,
		"longitude":       lon,
		"cuisine":         cuisine,
		"priceRange":      priceRange,
		"rating":          rating,
		"reviewCount":     reviewCount,
		"atmosphere":      atmosphere,
		"noiseLevel":      noiseLevel,
		"dateSuitability": dateSuitability,
		"imageUrl":        imageURL,
	}, nil
}

func (r *RestaurantRepository) GetMenuItems(ctx context.Context, restaurantID uuid.UUID) ([]map[string]interface{}, error) {
	rows, err := db.Pool.Query(ctx, `
		SELECT id, name, description, price, image_url, is_popular FROM menu_items WHERE restaurant_id = $1 ORDER BY is_popular DESC, name
	`, restaurantID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []map[string]interface{}
	for rows.Next() {
		var id uuid.UUID
		var name string
		var description, imageURL *string
		var price *int
		var isPopular bool

		err := rows.Scan(&id, &name, &description, &price, &imageURL, &isPopular)
		if err != nil {
			return nil, err
		}

		items = append(items, map[string]interface{}{
			"id":          id,
			"name":        name,
			"description": description,
			"price":       price,
			"imageUrl":    imageURL,
			"isPopular":   isPopular,
		})
	}

	return items, nil
}

func (r *RestaurantRepository) Search(ctx context.Context, query string) ([]map[string]interface{}, error) {
	rows, err := db.Pool.Query(ctx, `
		SELECT id, name, cuisine, rating, price_range, address
		FROM restaurants
		WHERE name ILIKE $1 OR cuisine ILIKE $1 OR address ILIKE $1
		ORDER BY rating DESC LIMIT 20
	`, "%"+query+"%")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var id uuid.UUID
		var name, cuisine, address string
		var rating float64
		var priceRange int

		err := rows.Scan(&id, &name, &cuisine, &rating, &priceRange, &address)
		if err != nil {
			return nil, err
		}

		results = append(results, map[string]interface{}{
			"id":         id,
			"name":       name,
			"cuisine":    cuisine,
			"rating":     rating,
			"priceRange": priceRange,
			"address":    address,
		})
	}

	return results, nil
}

func (r *RestaurantRepository) Create(ctx context.Context, name, description, address string, lat, lon float64, cuisine string, priceRange int) (*uuid.UUID, error) {
	id := uuid.New()
	_, err := db.Pool.Exec(ctx, `
		INSERT INTO restaurants (id, name, description, address, latitude, longitude, cuisine, price_range)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`, id, name, description, address, lat, lon, cuisine, priceRange)
	if err != nil {
		return nil, err
	}
	return &id, nil
}
