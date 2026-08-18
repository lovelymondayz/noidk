# NoIDK Makefile

.PHONY: dev build down logs migrate seed test deploy clean

# Development
dev:
	docker compose up --build

build:
	docker compose build

down:
	docker compose down

logs:
	docker compose logs -f

# Database
migrate:
	docker compose exec -T backend go run db/migrate.go

seed:
	docker compose exec -T backend go run db/seed.go

# Testing
test:
	docker compose exec -T backend go test ./...
	docker compose exec -T frontend npm test

# Production deploy
deploy:
	bash scripts/update.sh

# Cleanup
clean:
	docker compose down -v --rmi all
	docker system prune -f

# Helpers
shell-be:
	docker compose exec backend sh

shell-fe:
	docker compose exec frontend sh

shell-db:
	docker compose exec db psql -U noidk -d noidk
