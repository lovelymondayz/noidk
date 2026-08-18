package repository

import (
	"context"
	"math"

	"github.com/google/uuid"
	"github.com/lovelymondayz/noidk/backend/db"
	"github.com/lovelymondayz/noidk/backend/utils"
)

type RouletteRepository struct{}

func NewRouletteRepository() *RouletteRepository {
	return &RouletteRepository{}
}

func (r *RouletteRepository) GetScoredRestaurants(ctx context.Context, latitude, longitude float64, budget int, distanceKm float64, mood, cuisine string) ([]map[string]interface{}, error) {
	query := `
		SELECT r.id, r.name, r.cuisine, r.price_range, r.rating, r.review_count, r.address, r.latitude, r.longitude, r.image_url, r.atmosphere,
		       COALESCE(AVG(p.rating), 0) as avg_post_rating,
		       COUNT(DISTINCT v.id) as visit_count,
		       COUNT(DISTINCT p.id) as post_count
		FROM restaurants r
		LEFT JOIN visits v ON v.restaurant_id = r.id
		LEFT JOIN posts p ON p.restaurant_id = r.id
		WHERE 1=1
	`
	args := []interface{}{}
	argCount := 0

	if cuisine != "" {
		argCount++
		query += " AND r.cuisine = $" + string(rune('0'+argCount))
		args = append(args, cuisine)
	}

	if budget > 0 {
		argCount++
		query += " AND r.price_range <= $" + string(rune('0'+argCount))
		args = append(args, budget)
	}

	if mood != "" {
		argCount++
		query += " AND r.atmosphere ILIKE $" + string(rune('0'+argCount))
		args = append(args, "%"+mood+"%")
	}

	query += " GROUP BY r.id"

	rows, err := db.Pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	type scoredRestaurant struct {
		ID          uuid.UUID
		Name        string
		Cuisine     string
		PriceRange  int
		Rating      float64
		ReviewCount int
		Address     string
		Latitude    float64
		Longitude   float64
		ImageURL    *string
		Atmosphere  *string
		Distance    float64
		Score       float64
	}

	var results []map[string]interface{}
	for rows.Next() {
		var id uuid.UUID
		var name, cuisine, address string
		var priceRange int
		var rating, avgPostRating float64
		var reviewCount, visitCount, postCount int
		var lat, lon float64
		var imageURL, atmosphere *string

		err := rows.Scan(&id, &name, &cuisine, &priceRange, &rating, &reviewCount, &address, &lat, &lon, &imageURL, &atmosphere, &avgPostRating, &visitCount, &postCount)
		if err != nil {
			return nil, err
		}

		distance := utils.Haversine(latitude, longitude, lat, lon)

		// Skip if beyond max distance
		if distanceKm > 0 && distance > distanceKm {
			continue
		}

		// Score: rating (0.4) + popularity (0.3) + distance (0.3)
		score := 0.0
		score += (rating / 5.0) * 0.4                    // Rating weight
		score += (float64(reviewCount) / 100.0) * 0.3    // Popularity weight
		score += (1.0 - math.Min(distance/20.0, 1.0)) * 0.3 // Distance weight

		results = append(results, map[string]interface{}{
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
			"atmosphere":  atmosphere,
			"distanceKm":  utils.Round(distance, 1),
			"score":       utils.Round(score, 3),
		})
	}

	return results, nil
}
