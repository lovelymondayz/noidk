# NoIDK — Structure

> File tree, naming conventions, and what lives where.

---

## Directory Tree

```
noidk/
├── ARCHITECTURE.md          # System design, DB schema, tech stack
├── PLAN.md                  # Phased roadmap, milestones
├── STRUCTURE.md             # This file — file tree & conventions
├── Makefile                 # Build shortcuts: dev, build, test, deploy
├── docker-compose.yml       # Local dev: backend + frontend + postgres
├── .env                     # Environment variables (git-ignored in production)
├── .gitignore               # node_modules, .env, build artifacts
│
├── docs/
│   └── CONTENT_GUIDE.md     # Copy tone, seed data guidelines
│
├── scripts/
│   └── update.sh            # Per-project deploy: git pull → docker compose build → up -d
│
├── backend/
│   ├── go.mod
│   ├── go.sum
│   ├── main.go              # Entry point
│   ├── Dockerfile
│   │
│   ├── config/
│   │   └── config.go        # Env vars, defaults
│   │
│   ├── db/
│   │   ├── migrations/      # SQL migration files
│   │   │   ├── 001_create_users.sql
│   │   │   ├── 002_create_restaurants.sql
│   │   │   └── ...
│   │   └── seed/            # Seed data
│   │       ├── 001_users.sql
│   │       ├── 002_restaurants.sql
│   │       └── ...
│   │
│   ├── handlers/            # HTTP handlers (GIN)
│   │   ├── auth.go
│   │   ├── users.go
│   │   ├── restaurants.go
│   │   ├── posts.go
│   │   ├── roulette.go
│   │   ├── visits.go
│   │   ├── saved.go
│   │   ├── leaderboard.go
│   │   ├── groups.go
│   │   └── search.go
│   │
│   ├── middleware/
│   │   ├── auth.go          # JWT validation
│   │   ├── cors.go          # CORS headers
│   │   └── ratelimit.go     # Rate limiting
│   │
│   ├── models/              # Data structures
│   │   ├── user.go
│   │   ├── restaurant.go
│   │   ├── post.go
│   │   ├── visit.go
│   │   └── ...
│   │
│   ├── services/            # Business logic
│   │   ├── auth.go
│   │   ├── recommendation.go
│   │   ├── xp.go
│   │   └── trend.go
│   │
│   ├── providers/           # External provider abstractions
│   │   ├── maps/
│   │   │   ├── interface.go
│   │   │   ├── osm.go       # OpenStreetMap (default)
│   │   │   └── google.go    # Google Maps (future)
│   │   ├── storage/
│   │   │   ├── interface.go
│   │   │   ├── local.go     # Local filesystem (default)
│   │   │   └── s3.go        # S3/MinIO (future)
│   │   ├── trend/
│   │   │   ├── interface.go
│   │   │   └── stub.go      # Stub (default, returns empty)
│   │   └── search/
│   │       ├── interface.go
│   │       └── postgres.go  # PostgreSQL FTS (default)
│   │
│   └── utils/
│       ├── jwt.go
│       ├── password.go
│       ├── haversine.go     # Distance calculation
│       └── response.go      # Standard API response format
│
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html
    ├── Dockerfile
    │
    ├── public/
    │   └── favicon.ico
    │
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css           # Tailwind directives + global styles
        │
        ├── components/         # Reusable UI components
        │   ├── layout/
        │   │   ├── BottomNav.tsx
        │   │   ├── Sidebar.tsx
        │   │   └── Header.tsx
        │   ├── ui/
        │   │   ├── Button.tsx
        │   │   ├── Card.tsx
        │   │   ├── Badge.tsx
        │   │   ├── Avatar.tsx
        │   │   ├── Input.tsx
        │   │   ├── EmptyState.tsx
        │   │   └── Spinner.tsx
        │   ├── restaurant/
        │   │   ├── RestaurantCard.tsx
        │   │   ├── RestaurantDetail.tsx
        │   │   ├── MenuList.tsx
        │   │   └── VoteBar.tsx
        │   ├── post/
        │   │   ├── PostCard.tsx
        │   │   ├── PostCreate.tsx
        │   │   └── PostFeed.tsx
        │   ├── roulette/
        │   │   ├── RouletteWheel.tsx
        │   │   ├── RouletteResult.tsx
        │   │   └── RecommendationReasons.tsx
        │   └── map/
        │       └── MapView.tsx
        │
        ├── pages/              # Route pages
        │   ├── Home.tsx
        │   ├── Discover.tsx
        │   ├── Spin.tsx
        │   ├── Activity.tsx
        │   ├── Profile.tsx
        │   ├── Onboarding.tsx
        │   ├── Login.tsx
        │   ├── Register.tsx
        │   ├── RestaurantPage.tsx
        │   ├── SearchResults.tsx
        │   └── NotFound.tsx
        │
        ├── hooks/              # Custom React hooks
        │   ├── useAuth.ts
        │   ├── useLocation.ts
        │   ├── useRestaurants.ts
        │   └── useRoulette.ts
        │
        ├── services/           # API calls
        │   ├── api.ts          # Axios instance
        │   ├── auth.ts
        │   ├── restaurants.ts
        │   ├── posts.ts
        │   └── roulette.ts
        │
        ├── store/              # State management
        │   ├── authStore.ts
        │   └── filterStore.ts
        │
        ├── types/              # TypeScript types
        │   ├── user.ts
        │   ├── restaurant.ts
        │   ├── post.ts
        │   └── common.ts
        │
        └── utils/
            ├── format.ts       # Currency, distance, date formatting
            └── constants.ts    # App constants
```

---

## Naming Conventions

| Category | Convention | Example |
|----------|-----------|---------|
| Go files | `snake_case.go` | `auth_handler.go`, `restaurant.go` |
| TypeScript files | `PascalCase.tsx` | `RestaurantCard.tsx`, `useAuth.ts` |
| CSS classes | Tailwind utilities | `bg-orange-500 text-white rounded-xl` |
| API endpoints | `/api/kebab-case` | `/api/restaurants`, `/api/saved-places` |
| Database tables | `snake_case` | `menu_items`, `saved_places`, `trend_signals` |
| Environment variables | `UPPER_SNAKE_CASE` | `DATABASE_URL`, `JWT_SECRET` |
| Git branches | `feature/description` | `feature/roulette`, `feature/auth` |
| Commits | `type: description` | `feat: add restaurant discovery`, `fix: cooldown logic` |

---

## API Response Format

All API responses follow a consistent envelope:

```json
// Success
{
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": { ... }
  }
}
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_ENV` | Environment (development, production) | `development` |
| `APP_PORT` | Backend port | `8085` |
| `DATABASE_URL` | PostgreSQL connection string | required |
| `JWT_SECRET` | JWT signing secret | required |
| `JWT_EXPIRY` | Access token expiry (minutes) | `15` |
| `REFRESH_EXPIRY` | Refresh token expiry (days) | `7` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3005` |
| `UPLOAD_DIR` | Image upload directory | `./uploads` |
| `MAPS_PROVIDER` | Maps provider (osm, google) | `osm` |
| `STORAGE_PROVIDER` | Storage provider (local, s3) | `local` |
| `SEARCH_PROVIDER` | Search provider (postgres, elasticsearch) | `postgres` |

---

## Makefile Targets

| Target | Description |
|--------|-------------|
| `make dev` | Start all services in development mode |
| `make build` | Build all Docker images |
| `make down` | Stop all services |
| `make logs` | Show logs from all services |
| `make migrate` | Run database migrations |
| `make seed` | Seed database with demo data |
| `make test` | Run all tests |
| `make deploy` | Deploy to production (pull + build + up -d) |
| `make clean` | Remove all containers and volumes |
