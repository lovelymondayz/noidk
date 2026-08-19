package repository

import (
	"context"
	"errors"
	"math"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/lovelymondayz/noidk/backend/db"
	"github.com/lovelymondayz/noidk/backend/utils"
)

type RestaurantRepository struct{}

func NewRestaurantRepository() *RestaurantRepository {
	return &RestaurantRepository{}
}

func (r *RestaurantRepository) List(ctx context.Context, filters map[string]interface{}) ([]map[string]interface{}, int, error) {
	// Extract location params
	lat, hasLat := filters["latitude"].(float64)
	lon, hasLon := filters["longitude"].(float64)
	distanceKm, hasDistance := filters["distanceKm"].(float64)
	hasLocation := hasLat && hasLon && lat != 0 && lon != 0

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
		query += " AND r.cuisine = $" + string(rune('0'+argCount))
		args = append(args, cuisine)
	}

	if budget, ok := filters["budget"].(int); ok && budget > 0 {
		argCount++
		query += " AND r.price_range <= $" + string(rune('0'+argCount))
		args = append(args, budget)
	}

	if mood, ok := filters["mood"].(string); ok && mood != "" {
		argCount++
		query += " AND r.atmosphere ILIKE $" + string(rune('0'+argCount))
		args = append(args, "%"+mood+"%")
	}

	query += " GROUP BY r.id"

	rows, err := db.Pool.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	type restaurantData struct {
		id          uuid.UUID
		name        string
		cuisine     string
		priceRange  int
		rating      float64
		reviewCount int
		address     string
		lat         float64
		lon         float64
		imageURL    *string
		visitCount  int
		postCount   int
		distance    float64
	}

	var allRestaurants []restaurantData
	for rows.Next() {
		var rd restaurantData
		err := rows.Scan(&rd.id, &rd.name, &rd.cuisine, &rd.priceRange, &rd.rating, &rd.reviewCount, &rd.address, &rd.lat, &rd.lon, &rd.imageURL, &rd.visitCount, &rd.postCount)
		if err != nil {
			return nil, 0, err
		}

		// Calculate distance if location provided
		if hasLocation {
			rd.distance = utils.Haversine(lat, lon, rd.lat, rd.lon)
		}

		// Filter by distance if specified
		if hasLocation && hasDistance && distanceKm > 0 {
			if rd.distance > distanceKm {
				continue
			}
		}

		allRestaurants = append(allRestaurants, rd)
	}

	// Sort: by distance if location available, then by rating
	if hasLocation {
		// Simple bubble sort by distance (ascending), then rating (descending)
		for i := 0; i < len(allRestaurants); i++ {
			for j := i + 1; j < len(allRestaurants); j++ {
				ri, rj := allRestaurants[i], allRestaurants[j]
				if rj.distance < ri.distance || (rj.distance == ri.distance && rj.rating > ri.rating) {
					allRestaurants[i], allRestaurants[j] = allRestaurants[j], allRestaurants[i]
				}
			}
		}
	} else {
		// Sort by rating descending
		for i := 0; i < len(allRestaurants); i++ {
			for j := i + 1; j < len(allRestaurants); j++ {
				if allRestaurants[j].rating > allRestaurants[i].rating {
					allRestaurants[i], allRestaurants[j] = allRestaurants[j], allRestaurants[i]
				}
			}
		}
	}

	// Convert to map slice
	var restaurants []map[string]interface{}
	for _, rd := range allRestaurants {
		r := map[string]interface{}{
			"id":          rd.id,
			"name":        rd.name,
			"cuisine":     rd.cuisine,
			"priceRange":  rd.priceRange,
			"rating":      rd.rating,
			"reviewCount": rd.reviewCount,
			"address":     rd.address,
			"latitude":    rd.lat,
			"longitude":   rd.lon,
			"imageUrl":    rd.imageURL,
			"visitCount":  rd.visitCount,
			"postCount":   rd.postCount,
		}
		if hasLocation {
			r["distanceKm"] = utils.Round(rd.distance, 1)
		}
		restaurants = append(restaurants, r)
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

func (r *RestaurantRepository) FullSearch(ctx context.Context, query string) ([]map[string]interface{}, error) {
	rows, err := db.Pool.Query(ctx, `
		SELECT id, name, cuisine, rating, price_range, address, 'restaurant' as type
		FROM restaurants
		WHERE name ILIKE $1 OR cuisine ILIKE $1 OR address ILIKE $1
		UNION ALL
		SELECT mi.id, mi.name, r.cuisine, 0 as rating, r.price_range, r.address, 'menu_item' as type
		FROM menu_items mi
		JOIN restaurants r ON r.id = mi.restaurant_id
		WHERE mi.name ILIKE $1 OR mi.description ILIKE $1
		LIMIT 20
	`, "%"+query+"%")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []map[string]interface{}
	for rows.Next() {
		var id uuid.UUID
		var name, cuisine, address, resultType string
		var rating float64
		var priceRange int

		err := rows.Scan(&id, &name, &cuisine, &rating, &priceRange, &address, &resultType)
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
			"type":       resultType,
		})
	}
	return results, nil
}

func (r *RestaurantRepository) MarkVisited(ctx context.Context, userID, restaurantID uuid.UUID, rating int, wouldReturn bool) error {
	_, err := db.Pool.Exec(ctx, `
		INSERT INTO visits (user_id, restaurant_id, visited_at, rating, would_return)
		VALUES ($1, $2, NOW(), $3, $4)
	`, userID, restaurantID, rating, wouldReturn)
	return err
}
