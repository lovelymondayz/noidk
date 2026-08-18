# NoIDK — Plan

> **Tagline:** Stop saying "I don't know." We pick. You eat.
> **Repo:** https://github.com/lovelymondayz/noidk
> **Domain:** noidk.client.arjism.com

---

## Project Goals

1. Build a **polished, production-quality** food discovery web app
2. **Roulette/Spin is the hero** — the entire UX should funnel back to "PICK FOR ME"
3. **Discovery > Directory** — users should feel "let NoIDK find something" not "browse a database"
4. **Social layer** — posts, reviews, leaderboards, XP, badges, couples, groups
5. **Extensible architecture** — provider abstractions for maps, trends, storage, search

---

## Phase Breakdown

### Phase 1 — Core MVP ✅ (Current)
*The absolute minimum to feel like NoIDK.*

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 1 | **Project scaffold** | Monorepo, Docker Compose, Makefile, update.sh, docs | ⬜ |
| 2 | **Database schema** | All entities (users, restaurants, menu_items, posts, visits, contributions, votes, trend_signals, couples, groups, notifications) | ⬜ |
| 3 | **Auth** | Register, login, JWT middleware, protected routes | ⬜ |
| 4 | **Location** | GPS/location detection, distance calculations | ⬜ |
| 5 | **Restaurant discovery** | List, filter (mood/budget/distance), full-text search, map view | ⬜ |
| 6 | **Restaurant pages** | Detail, menu, community posts, votes, "would eat again" | ⬜ |
| 7 | **Post creation** | Photos, menu items, review, tags, tips (social content unit) | ⬜ |
| 8 | **🎲 Roulette / Spin** | Animated wheel, weighted by signals, cooldown + diversity logic | ⬜ |
| 9 | **"Don't Make Me Choose"** | Guided Q&A → recommendation | ⬜ |
| 10 | **Recommendation explanation** | "Why we picked this" UI with signal breakdown | ⬜ |
| 11 | **Cooldown + Food diversity** | Prevent repeats, push variety | ⬜ |
| 12 | **Restaurant history** | Visit tracking, "last visited X days ago" | ⬜ |
| 13 | **User profiles** | Avatar, bio, level, XP, recent visits, food journey timeline | ⬜ |
| 14 | **Search** | Restaurants, menu items, dishes, users, posts | ⬜ |
| 15 | **Empty states** | Playful copy for every empty screen | ⬜ |
| 16 | **Onboarding** | 5-step flow ending in "YOUR FIRST PICK" | ⬜ |
| 17 | **UI shell** | Bottom nav (Home/Discover/Spin/Activity/Profile), responsive desktop | ⬜ |
| 18 | **Seed data** | 30 restaurants, 50+ menu items, 5+ users, 20+ posts, reviews, visits, votes | ⬜ |

**Phase 1 Total:** ~18 features

---

### Phase 2 — Social & Community
*Make it social, competitive, sticky.*

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 19 | **Leaderboard** | Monthly Food Scout rankings, XP tracking | ⬜ |
| 20 | **Badges** | Automated badge awards (Noodle Expert, Hidden Gem Hunter, etc.) | ⬜ |
| 21 | **Saved places** | Categorized bookmarks (Want to Try, Date Ideas, Favorites) | ⬜ |
| 22 | **Trending system** | Popularity scoring based on visits, posts, likes | ⬜ |
| 23 | **Date Mode** | Curated picks based on vibe/budget/distance | ⬜ |
| 24 | **Group Mode** | Create group, vote on restaurants, group recommendation | ⬜ |
| 25 | **Notifications** | Saved place trending, weekly pick, leaderboard position | ⬜ |
| 26 | **XP automation** | Auto-award XP for contributions | ⬜ |

---

### Phase 3 — Advanced & Monetization
*Grow, monetize, scale.*

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 27 | **Couple accounts** | Shared food journey, "Have we been here?" | ⬜ |
| 28 | **Advanced recommendation** | ML-weighted scoring (replace simple weighted random) | ⬜ |
| 29 | **External trend integrations** | TikTok/YouTube/Instagram provider abstraction | ⬜ |
| 30 | **Restaurant business accounts** | Claim, update menu, respond to posts | ⬜ |
| 31 | **Sponsored discovery** | Clearly labeled, separated from organic | ⬜ |
| 32 | **Premium (NoIDK+)** | Advanced filters, unlimited customization, AI planner | ⬜ |
| 33 | **Real-time** | WebSocket for group voting, live notifications | ⬜ |
| 34 | **Mobile app** | PWA or React Native | ⬜ |

---

## Milestones

| Milestone | Target | Description |
|-----------|--------|-------------|
| M1 — Scaffold | Day 1 | Repo, docs, Docker, Makefile |
| M2 — Backend Core | Day 2-3 | Schema, auth, restaurants, posts, roulette |
| M3 — Frontend Core | Day 3-4 | UI shell, discovery, roulette, profiles |
| M4 — Seed Data | Day 4-5 | 30 restaurants, 5 users, 20 posts |
| M5 — Polish | Day 5-6 | Animations, empty states, onboarding, mobile |
| M6 — Deploy | Day 6 | Docker Compose, nginx, Cloudflare, live on noidk.client.arjism.com |

---

## Success Criteria

- [ ] Roulette returns weighted, personalized results with explanation
- [ ] Cooldown prevents repeats within configured days
- [ ] Food diversity pushes varied cuisines
- [ ] Search returns restaurants, menu items, users, posts
- [ ] 30 realistic seed restaurants with images, menus, posts
- [ ] Mobile-first responsive UI with bottom nav
- [ ] Onboarding completes in under 30 seconds
- [ ] Empty states have playful copy
- [ ] Deployed live on noidk.client.arjism.com

---

## Technical Debt & Future

- **Elasticsearch:** Replace PostgreSQL FTS when scale demands it
- **Redis:** Add for caching, sessions, rate limiting
- **CDN:** Move images to Cloudflare R2
- **ML:** Replace weighted random with collaborative filtering
- **Real-time:** WebSocket for group features
