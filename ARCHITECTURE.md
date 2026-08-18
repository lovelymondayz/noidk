# NoIDK — Architecture Document

> **Tagline:** Stop saying "I don't know." We pick. You eat.
> **Core Philosophy:** Discovery > Directory

---

## 1. System Overview

NoIDK is a social food discovery and decision-making platform. It helps users answer "Where should we eat?" through smart recommendations, community content, and a signature roulette experience.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  React + Vite + TypeScript + Tailwind + Framer Motion       │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────┐    │
│  │ Roulette│ │ Discover │ │ Profile │ │ Restaurant   │    │
│  │ (Hero)  │ │ Feed     │ │ & Posts │ │ Pages        │    │
│  └─────────┘ └──────────┘ └─────────┘ └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Backend                               │
│  Go + GIN + pgx/v5 + PostgreSQL                             │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────┐    │
│  │ Auth    │ │ Restaur. │ │ Posts   │ │ Recommendation│   │
│  │ Service │ │ Service  │ │ Service │ │ Engine        │   │
│  └─────────┘ └──────────┘ └─────────┘ └──────────────┘    │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────────┐    │
│  │ Search  │ │ Trend    │ │ XP/     │ │ Notification │    │
│  │ Service │ │ Provider │ │ Badge   │ │ Service      │    │
│  └─────────┘ └──────────┘ └─────────┘ └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  PostgreSQL (primary) + Local Storage (images)               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Provider Abstractions: Maps / Trends / Storage      │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Frontend** | React | 18.x | Mature, fast, huge ecosystem |
| | Vite | 5.x | Fast HMR, Vite 8 has rolldown issues on this VPS |
| | TypeScript | 5.x | Type safety |
| | Tailwind CSS | 3.x | Utility-first, rapid UI |
| | Framer Motion | 11.x | Smooth animations (roulette, transitions) |
| | Lucide Icons | latest | Clean, consistent iconography |
| | react-router-dom | 6.x | Client-side routing |
| **Backend** | Go | 1.22+ | Performance, concurrency |
| | GIN | 1.10 | Lightweight HTTP framework |
| | pgx/v5 | 5.x | Native PostgreSQL driver (requires Go 1.19+) |
| | jwt | v3 | JWT auth (v5 pulls pgx/v5 transitively) |
| **Database** | PostgreSQL | 15+ | Full-text search, JSON support, geospatial |
| **Storage** | Local filesystem | — | S3/MinIO-ready abstraction |
| **Maps** | Provider abstraction | — | Google Maps / OSM swappable |
| **Search** | PostgreSQL FTS | — | Elasticsearch-ready abstraction |
| **Deploy** | Docker Compose | — | Per-container isolation |
| | nginx | — | Reverse proxy, Cloudflare in front |

---

## 3. Database Schema

### Core Entities

```sql
-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(30) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    avatar_url      VARCHAR(500),
    bio             TEXT,
    level           INTEGER DEFAULT 1,
    lifetime_xp     INTEGER DEFAULT 0,
    monthly_xp      INTEGER DEFAULT 0,
    monthly_xp_month INTEGER DEFAULT 0,  -- which month the XP belongs to
    preferences     JSONB DEFAULT '{}',  -- cuisines, budget, distance, cooldown_days
    latitude        DECIMAL(10, 8),
    longitude       DECIMAL(11, 8),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RESTAURANTS
-- ============================================
CREATE TABLE restaurants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    address         TEXT NOT NULL,
    latitude        DECIMAL(10, 8) NOT NULL,
    longitude       DECIMAL(11, 8) NOT NULL,
    cuisine         VARCHAR(100) NOT NULL,
    price_range     SMALLINT NOT NULL CHECK (price_range BETWEEN 1 AND 4),
    rating          DECIMAL(3, 2) DEFAULT 0,
    review_count    INTEGER DEFAULT 0,
    opening_hours   JSONB,  -- { "monday": { "open": "09:00", "close": "22:00" }, ... }
    atmosphere      VARCHAR(50),  -- romantic, casual, lively, quiet
    noise_level     VARCHAR(20),  -- quiet, moderate, loud
    date_suitability BOOLEAN DEFAULT FALSE,
    image_url       VARCHAR(500),
    external_sources JSONB DEFAULT '{}',  -- { "google_maps": {...}, "tiktok": {...} }
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MENU ITEMS
-- ============================================
CREATE TABLE menu_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    price           INTEGER,  -- in IDR
    image_url       VARCHAR(500),
    is_popular      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- POSTS (social content unit)
-- ============================================
CREATE TABLE posts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    rating          SMALLINT CHECK (rating BETWEEN 1 AND 5),
    would_return    BOOLEAN,
    favorite_menu   VARCHAR(200),
    tips            TEXT,
    images          JSONB DEFAULT '[]',  -- array of image URLs
    tags            TEXT[] DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VISITS (cooldown tracking)
-- ============================================
CREATE TABLE visits (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    visited_at      TIMESTAMPTZ DEFAULT NOW(),
    rating          SMALLINT CHECK (rating BETWEEN 1 AND 5),
    would_return    BOOLEAN,
    UNIQUE(user_id, restaurant_id, visited_at)
);

-- ============================================
-- CONTRIBUTIONS (XP tracking)
-- ============================================
CREATE TABLE contributions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            VARCHAR(50) NOT NULL,  -- add_restaurant, upload_menu, upload_photo, review, correction, verify
    points          SMALLINT NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SAVED PLACES
-- ============================================
CREATE TABLE saved_places (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category        VARCHAR(50) NOT NULL,  -- want_to_try, food, coffee, date_ideas, trending, favorites
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, restaurant_id, category)
);

-- ============================================
-- VOTES (community verdict)
-- ============================================
CREATE TABLE votes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type     VARCHAR(20) NOT NULL,  -- restaurant, post, menu_item
    target_id       UUID NOT NULL,
    vote_type       VARCHAR(10) NOT NULL,  -- yes, maybe, no
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id)
);

-- ============================================
-- TREND SIGNALS (external trend data)
-- ============================================
CREATE TABLE trend_signals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    source          VARCHAR(50) NOT NULL,  -- tiktok, youtube, instagram, google_maps
    signal_type     VARCHAR(50) NOT NULL,  -- trending, featured, popular
    score           DECIMAL(5, 2) DEFAULT 0,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COUPLES
-- ============================================
CREATE TABLE couples (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_one        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_two        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_one, user_two)
);

-- ============================================
-- GROUPS
-- ============================================
CREATE TABLE groups (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    creator_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE group_members (
    group_id        UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at       TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (group_id, user_id)
);

-- ============================================
-- GROUP VOTES
-- ============================================
CREATE TABLE group_votes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id        UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote_type       VARCHAR(10) NOT NULL,  -- yes, maybe, no
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, restaurant_id, user_id)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            VARCHAR(50) NOT NULL,
    title           VARCHAR(200) NOT NULL,
    body            TEXT,
    data            JSONB DEFAULT '{}',
    read            BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_restaurants_cuisine ON restaurants(cuisine);
CREATE INDEX idx_restaurants_price_range ON restaurants(price_range);
CREATE INDEX idx_restaurants_rating ON restaurants(rating DESC);
CREATE INDEX idx_restaurants_location ON restaurants USING GIST (
    point(longitude, latitude)
);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_restaurant ON posts(restaurant_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_visits_user ON visits(user_id);
CREATE INDEX idx_visits_restaurant ON visits(restaurant_id);
CREATE INDEX idx_visits_visited_at ON visits(visited_at DESC);
CREATE INDEX idx_contributions_user ON contributions(user_id);
CREATE INDEX idx_contributions_created ON contributions(created_at DESC);
CREATE INDEX idx_saved_places_user ON saved_places(user_id);
CREATE INDEX idx_votes_target ON votes(target_type, target_id);
CREATE INDEX idx_trend_signals_restaurant ON trend_signals(restaurant_id);
CREATE INDEX idx_trend_signals_source ON trend_signals(source);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);

-- Full-text search indexes
CREATE INDEX idx_restaurants_fts ON restaurants USING GIN (
    to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || cuisine)
);
CREATE INDEX idx_menu_items_fts ON menu_items USING GIN (
    to_tsvector('english', name || ' ' || COALESCE(description, ''))
);
```

---

## 4. API Design

### Authentication
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Invalidate token |

### Users
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users/me` | Current user profile |
| PATCH | `/api/users/me` | Update profile |
| GET | `/api/users/:username` | Public profile |
| GET | `/api/users/me/food-journey` | Personal food timeline |
| GET | `/api/users/me/stats` | Eating statistics |

### Restaurants
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/restaurants` | List with filters (mood, budget, distance, cuisine) |
| GET | `/api/restaurants/:id` | Detail with menu, posts, votes |
| POST | `/api/restaurants` | Add new restaurant (+XP) |
| GET | `/api/restaurants/search` | Full-text search |
| GET | `/api/restaurants/map` | Map-optimized list |

### Posts
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/posts` | Feed (discovery) |
| POST | `/api/posts` | Create post |
| GET | `/api/posts/:id` | Post detail |
| POST | `/api/posts/:id/like` | Like/unlike |
| POST | `/api/posts/:id/comment` | Add comment |

### Roulette
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/roulette/spin` | Get weighted recommendation |
| POST | `/api/roulette/donate` | "Don't Make Me Choose" mode |

### Visits
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/visits` | Mark restaurant as visited |
| GET | `/api/visits` | Visit history |

### Saved Places
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/saved` | List saved places |
| POST | `/api/saved` | Save a restaurant |
| DELETE | `/api/saved/:id` | Remove from saved |

### Leaderboard
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/leaderboard` | Monthly Food Scout rankings |

### Groups
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/groups` | Create group |
| POST | `/api/groups/:id/join` | Join group |
| POST | `/api/groups/:id/vote` | Vote on restaurant |
| GET | `/api/groups/:id/result` | Group recommendation |

---

## 5. Provider Abstractions

### Maps Provider
```go
type MapsProvider interface {
    GeocodeAddress(ctx context.Context, addr string) (lat, lng float64, err error)
    ReverseGeocode(ctx context.Context, lat, lng float64) (address string, err error)
    GetNearby(ctx context.Context, lat, lng float64, radiusKm float64) ([]Place, err error)
    GetMapConfig() MapConfig  // API key, tile URL, etc.
}
```
- **Default:** OpenStreetMap (free, no API key)
- **Upgrade:** Google Maps (requires API key)

### Storage Provider
```go
type StorageProvider interface {
    Upload(ctx context.Context, file io.Reader, filename string) (url string, err error)
    Delete(ctx context.Context, url string) error
}
```
- **Default:** Local filesystem (`/uploads`)
- **Upgrade:** S3 / MinIO / Cloudflare R2

### Trend Provider
```go
type TrendProvider interface {
    GetTrending(ctx context.Context, source string, location string) ([]TrendSignal, err error)
    GetRestaurantSignals(ctx context.Context, restaurantID string) ([]TrendSignal, err error)
}
```
- **Sources:** tiktok, youtube, instagram, google_maps
- **Default:** Stub (returns empty, UI shows "no data")
- **Upgrade:** Real API integrations

### Search Provider
```go
type SearchProvider interface {
    SearchRestaurants(ctx context.Context, query string, filters SearchFilters) ([]Restaurant, error)
    SearchMenuItems(ctx context.Context, query string) ([]MenuItem, error)
    SearchUsers(ctx context.Context, query string) ([]User, error)
    SearchPosts(ctx context.Context, query string) ([]Post, error)
}
```
- **Default:** PostgreSQL full-text search
- **Upgrade:** Elasticsearch / OpenSearch

---

## 6. Recommendation Engine

### Weighted Scoring Algorithm

```go
type RecommendationInput struct {
    UserID          string
    Latitude        float64
    Longitude       float64
    Budget          int       // 1-4
    DistanceKm      float64
    Mood            string    // comfort, fast, fancy, spicy, chill, dessert, healthy, surprise
    Cuisine         string    // optional
    TimeOfDay       time.Time
    GroupSize       int
    Vibe            string    // date_night, casual, hungry, chill, group
}

type ScoredRestaurant struct {
    Restaurant      Restaurant
    Score           float64
    Reasons         []string  // human-readable explanation
}

func ScoreRestaurant(r Restaurant, input RecommendationInput, history UserHistory) ScoredRestaurant {
    var score float64
    var reasons []string

    // 1. Popularity (20%)
    score += r.Rating * 0.15
    score += float64(r.ReviewCount) * 0.0001 * 0.05

    // 2. Distance (20%) — closer is better
    dist := haversine(input.Latitude, input.Longitude, r.Latitude, r.Longitude)
    if dist <= input.DistanceKm {
        score += (1 - dist/input.DistanceKm) * 0.20
    }

    // 3. Budget match (10%)
    if r.PriceRange <= input.Budget {
        score += 0.10
    }

    // 4. Cooldown penalty (15%) — recently visited = lower score
    if lastVisit, ok := history.LastVisit(r.ID); ok {
        daysSince := time.Since(lastVisit).Hours() / 24
        cooldownDays := history.CooldownDays // default 7
        if daysSince < float64(cooldownDays) {
            score -= (1 - daysSince/float64(cooldownDays)) * 0.15
            reasons = append(reasons, fmt.Sprintf("Last visited %.0f days ago", daysSince))
        }
    }

    // 5. Food diversity (10%) — penalize over-represented cuisines
    cuisineCount := history.CuisineCount(r.Cuisine, 30) // last 30 days
    if cuisineCount > 2 {
        score -= float64(cuisineCount-2) * 0.03
        reasons = append(reasons, fmt.Sprintf("You've had %s %d times this month", r.Cuisine, cuisineCount))
    }

    // 6. Trending bonus (10%)
    if r.Trending {
        score += 0.10
        reasons = append(reasons, "🔥 Trending near you")
    }

    // 7. Community activity (5%)
    score += float64(r.RecentPosts) * 0.01 * 0.05

    // 8. Time of day (5%) — is it open?
    if isOpen(r.OpeningHours, input.TimeOfDay) {
        score += 0.05
    }

    // 9. Randomness (5%) — keep it surprising
    score += rand.Float64() * 0.05

    return ScoredRestaurant{r, score, reasons}
}
```

---

## 7. Authentication Flow

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Client  │                    │  Server  │                    │   DB     │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │  POST /auth/register          │                               │
     │  {username, email, password}  │                               │
     │──────────────────────────────>│                               │
     │                               │  hash(password)               │
     │                               │  INSERT INTO users            │
     │                               │──────────────────────────────>│
     │                               │                               │
     │  201 {user}                   │  OK                           │
     │<──────────────────────────────│<──────────────────────────────│
     │                               │                               │
     │  POST /auth/login             │                               │
     │  {email, password}            │                               │
     │──────────────────────────────>│                               │
     │                               │  SELECT * FROM users          │
     │                               │  WHERE email = ?              │
     │                               │──────────────────────────────>│
     │                               │                               │
     │                               │  user row                     │
     │                               │<──────────────────────────────│
     │                               │  verify(password, hash)       │
     │                               │  generate JWT                 │
     │                               │                               │
     │  200 {access_token, refresh}  │                               │
     │<──────────────────────────────│                               │
     │                               │                               │
     │  GET /api/restaurants         │                               │
     │  Authorization: Bearer <token>│                               │
     │──────────────────────────────>│                               │
     │                               │  validate JWT                 │
     │                               │  extract user_id              │
     │                               │  query restaurants            │
     │                               │──────────────────────────────>│
     │                               │                               │
     │  200 {restaurants: [...]}     │  results                      │
     │<──────────────────────────────│<──────────────────────────────│
```

**JWT Claims:**
```go
type Claims struct {
    UserID   string `json:"user_id"`
    Username string `json:"username"`
    StandardClaims
}
```

- **Access token:** 15 min expiry
- **Refresh token:** 7 day expiry, stored in httpOnly cookie

---

## 8. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Cloudflare                            │
│  Full SSL, CDN, DDoS protection                              │
│  noidk.client.arjism.com                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        nginx                                  │
│  Reverse proxy, static file serving                          │
│  :80/:443 → :3005 (frontend)                                 │
│           → :8085 (backend API via /api)                     │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│    Frontend Container   │     │    Backend Container    │
│    React + Vite (prod)  │     │    Go + GIN             │
│    Port: 3005           │     │    Port: 8085           │
│    Static files via     │     │    REST API             │
│    nginx                │     │                         │
└─────────────────────────┘     └─────────────────────────┘
                                              │
                                              ▼
                                ┌─────────────────────────┐
                                │   PostgreSQL Container  │
                                │   Port: 5436            │
                                │   Volume: pgdata        │
                                └─────────────────────────┘
```

---

## 9. Security Considerations

| Concern | Mitigation |
|---------|------------|
| Password storage | bcrypt with cost 12 |
| JWT security | Short-lived access tokens, httpOnly refresh cookies |
| SQL injection | Parameterized queries via pgx |
| XSS | React auto-escapes, CSP headers |
| CSRF | SameSite cookies, CORS whitelist |
| Rate limiting | Per-IP rate limiting on auth endpoints |
| Input validation | Server-side validation on all inputs |
| Image upload | File type whitelist, size limit (5MB), virus scan (future) |

---

## 10. Monitoring & Observability

- **Health check:** `/api/health` (returns DB connectivity status)
- **Logging:** Structured JSON logs (Go `slog`)
- **Metrics:** Request duration, error rate, active users
- **Alerting:** Future — webhook to Discord/Telegram on errors

---

## 11. Future Considerations

- **Real-time:** WebSocket for group voting, live notifications
- **Caching:** Redis for session store, trending data, rate limiting
- **CDN:** Cloudflare R2 for image storage
- **ML:** Collaborative filtering for recommendations
- **Mobile:** React Native or PWA
- **i18n:** Indonesian + English support
