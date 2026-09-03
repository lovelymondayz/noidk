# Noidk — Knowledge Base Platform

A modern knowledge base and documentation platform with AI-powered search and organization.

## Quick Start

```bash
# Clone
git clone https://github.com/lovelymondayz/noidk.git
cd noidk

# Start all services
docker compose up -d --build

# Frontend: http://localhost:3008
# Backend API: http://localhost:8085
# DB: localhost:5439 (user: noidk, pass: noidkpassword)
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        NGINX (80/443)                        │
│                     noidk.arjism.com → :3008                │
├─────────────────────────────────────────────────────────────┤
│  React + Vite + TS + Tailwind  │  Go + GIN + pgx + Postgres │
│        (Frontend :3008)        │       (Backend :8085)      │
├─────────────────────────────────────────────────────────────┤
│              PostgreSQL :5439  │  Local Storage (/data)     │
└─────────────────────────────────────────────────────────────┘
```

## Features

- **Knowledge Base**: Create and organize documentation
- **AI Search**: Natural language search across all content
- **Categories**: Hierarchical organization with tags
- **Version Control**: Track changes with full history
- **Team Collaboration**: Multi-user editing and comments
- **Responsive UI**: Mobile-first design with Tailwind CSS

## API Endpoints

### Public
- `GET /api/health` — Health check
- `GET /api/articles` — List articles
- `GET /api/articles/:id` — Get article
- `GET /api/search` — Search articles

### Authenticated (JWT required)
- `POST /api/articles` — Create article
- `PUT /api/articles/:id` — Update article
- `DELETE /api/articles/:id` — Delete article
- `POST /api/categories` — Create category

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| APP_ENV | development | Environment mode |
| APP_PORT | 8085 | Backend port |
| DATABASE_URL | postgres://... | DB connection |
| JWT_SECRET | - | JWT signing key |
| JWT_EXPIRY | 15 | Token expiry (minutes) |
| REFRESH_EXPIRY | 7 | Refresh token expiry (days) |

## Development

```bash
# Backend only
cd backend
go run .

# Frontend only
cd frontend
npm install
npm run dev
```

## Deployment

1. Push to `main` → GitHub Action auto-deploys
2. Or manually: `ssh vps && cd /root/noidk && ./update.sh`

## License

MIT
