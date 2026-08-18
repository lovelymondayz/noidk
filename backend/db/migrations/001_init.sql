-- ============================================
-- NoIDK Database Migration
-- ============================================
-- Migration 001: Create core tables
-- Run: docker compose exec db psql -U noidk -d noidk -f /migrations/001_init.sql

-- ============================================
-- USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(30) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    avatar_url      VARCHAR(500),
    bio             TEXT,
    level           INTEGER DEFAULT 1,
    lifetime_xp     INTEGER DEFAULT 0,
    monthly_xp      INTEGER DEFAULT 0,
    monthly_xp_month INTEGER DEFAULT 0,
    preferences     JSONB DEFAULT '{}',
    latitude        DECIMAL(10, 8),
    longitude       DECIMAL(11, 8),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RESTAURANTS
-- ============================================
CREATE TABLE IF NOT EXISTS restaurants (
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
    opening_hours   JSONB,
    atmosphere      VARCHAR(50),
    noise_level     VARCHAR(20),
    date_suitability BOOLEAN DEFAULT FALSE,
    image_url       VARCHAR(500),
    external_sources JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MENU ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS menu_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    price           INTEGER,
    image_url       VARCHAR(500),
    is_popular      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- POSTS
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    rating          SMALLINT CHECK (rating BETWEEN 1 AND 5),
    would_return    BOOLEAN,
    favorite_menu   VARCHAR(200),
    tips            TEXT,
    images          JSONB DEFAULT '[]',
    tags            TEXT[] DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VISITS
-- ============================================
CREATE TABLE IF NOT EXISTS visits (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    visited_at      TIMESTAMPTZ DEFAULT NOW(),
    rating          SMALLINT CHECK (rating BETWEEN 1 AND 5),
    would_return    BOOLEAN,
    UNIQUE(user_id, restaurant_id, visited_at)
);

-- ============================================
-- CONTRIBUTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS contributions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            VARCHAR(50) NOT NULL,
    points          SMALLINT NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SAVED PLACES
-- ============================================
CREATE TABLE IF NOT EXISTS saved_places (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category        VARCHAR(50) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, restaurant_id, category)
);

-- ============================================
-- VOTES
-- ============================================
CREATE TABLE IF NOT EXISTS votes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type     VARCHAR(20) NOT NULL,
    target_id       UUID NOT NULL,
    vote_type       VARCHAR(10) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id)
);

-- ============================================
-- TREND SIGNALS
-- ============================================
CREATE TABLE IF NOT EXISTS trend_signals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    source          VARCHAR(50) NOT NULL,
    signal_type     VARCHAR(50) NOT NULL,
    score           DECIMAL(5, 2) DEFAULT 0,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COUPLES
-- ============================================
CREATE TABLE IF NOT EXISTS couples (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_one        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_two        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_one, user_two)
);

-- ============================================
-- GROUPS
-- ============================================
CREATE TABLE IF NOT EXISTS groups (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    creator_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS group_members (
    group_id        UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at       TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (group_id, user_id)
);

-- ============================================
-- GROUP VOTES
-- ============================================
CREATE TABLE IF NOT EXISTS group_votes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id        UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote_type       VARCHAR(10) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, restaurant_id, user_id)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
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
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants(cuisine);
CREATE INDEX IF NOT EXISTS idx_restaurants_price_range ON restaurants(price_range);
CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(rating DESC);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_restaurant ON posts(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_user ON visits(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_restaurant ON visits(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_contributions_user ON contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_created ON contributions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_places_user ON saved_places(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_target ON votes(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_trend_signals_restaurant ON trend_signals(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_trend_signals_source ON trend_signals(source);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_restaurants_fts ON restaurants USING GIN (
    to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || cuisine)
);
CREATE INDEX IF NOT EXISTS idx_menu_items_fts ON menu_items USING GIN (
    to_tsvector('english', name || ' ' || COALESCE(description, ''))
);

-- ============================================
-- TRIGGER: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_restaurants_updated_at
    BEFORE UPDATE ON restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_trend_signals_updated_at
    BEFORE UPDATE ON trend_signals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
