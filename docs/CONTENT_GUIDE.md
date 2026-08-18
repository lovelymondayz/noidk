# NoIDK — Content Guide

> Copy tone, seed data guidelines, and content rules.

---

## Copy Tone & Voice

NoIDK speaks like a **fun, slightly chaotic friend** — not a corporate brand.

### Characteristics

| Do | Don't |
|----|-------|
| "Where are we eating?" | "Search for restaurants" |
| "Don't think. We'll pick." | "Use our advanced filtering system" |
| "🎲 SPIN FOR ME" | "Generate recommendation" |
| "Bro, you've eaten burgers twice this week. 💀" | "You have exceeded your burger quota" |
| "AGAIN?! 😭" | "You visited this restaurant recently" |
| "Your future food addiction starts here. 🍜" | "No saved places yet" |
| "We're hungry too." | "No recommendations available" |
| "THE GROUP HAS SPOKEN." | "Group vote complete" |
| "NEW MONTH. NEW FOOD. NEW LEADERBOARD. 🔥" | "Leaderboard reset" |

### Emoji Usage

- Emoji are **part of the copy**, not decoration
- Use them to add personality, not clutter
- Common: 🍜 🍔 🍣 🌶️ ☕ 🍰 🥗 🎲 ❤️ 🔥 💀 🧋 🗿 👨‍👩‍👧 🧍 🏆 📸 💎

---

## Seed Data Guidelines

### Restaurants (30 minimum)

**Naming:** Realistic, not generic. Use actual Indonesian food culture references.

| ❌ Bad | ✅ Good |
|--------|---------|
| Restaurant 1 | Bakmi Orang Ketiga |
| Place 2 | Warung Mba Nana |
| Test Cafe | Kopi & Co. |
| Food Spot | Sushi Kaze |
| Eatery XYZ | Pizza Club Menteng |

**Cuisines to represent:**
- Indonesian (nasi goreng, sate, rendang, etc.)
- Chinese (bakmi, dim sum, etc.)
- Japanese (sushi, ramen, etc.)
- Korean (K-food)
- Western (burger, steak, pizza)
- Coffee/bakery
- Dessert
- Street food
- Healthy/salads
- Thai, Vietnamese, Indian, Middle Eastern

**Price ranges (IDR):**
- 💸 Under Rp50K (street food, warung, coffee)
- 💸💸 Rp50K–100K (casual dining)
- 💸💸💸 Rp100K–250K (mid-range)
- 💸💸💸💸 Rp250K+ (fine dining)

**Locations:** Spread across Jakarta areas:
- Menteng, Kemang, Senopati, Kuningan, Thamrin, Sudirman, Kemang, Cikini, Menteng, Blok M, etc.

**Images:** Use Unsplash food photography. Real restaurant photos in production.

### Menu Items (50+)

Each restaurant should have 3-8 menu items with:
- Realistic Indonesian/Asian food names
- Prices in IDR
- Optional descriptions
- `is_popular` flag on 1-2 items per restaurant

### Users (5+)

| Username | Bio | Level | Cuisines |
|----------|-----|-------|----------|
| @mika | Food Scout · Level 12 | 12 | Japanese, Chinese, Coffee |
| @josh | Burger enthusiast 🍔 | 8 | American, Korean |
| @nana | Hidden gem hunter 💎 | 15 | Indonesian, Thai, Dessert |
| @kvin | Spicy food lover 🌶️ | 10 | Indonesian, Chinese, Indian |
| @alex | Coffee addict ☕ | 6 | Coffee, Brunch, Healthy |

### Posts (20+)

Each post should have:
- Realistic review content (not "great place, nice food")
- Specific menu items mentioned
- Rating (3-5 stars for variety)
- Would return (yes/maybe/no)
- 1-3 tags
- Tips ("come before 7pm", "ask for extra chili oil")
- Created within last 30 days

### Visits

- Each user should have 5-15 visits
- Spread across different restaurants
- Some recent (within cooldown), some older
- Include ratings and would_return

### Votes

- Restaurants should have community verdict (yes/maybe/no percentages)
- Distribute realistically (most restaurants 70-95% yes)

### Trend Signals

- 8-10 restaurants marked as trending
- Sources: tiktok, youtube, instagram, google_maps
- Mix of signal types: trending, featured, popular

### Saved Places

- Each user saves 3-8 restaurants
- Mix of categories: want_to_try, food, coffee, date_ideas, trending, favorites

### Leaderboard

- Monthly XP for top contributors
- Realistic distribution (top user ~400 XP, others descending)
- Include all 5 seed users

---

## Content Rules

1. **No placeholder text** — never "Lorem ipsum", "Restaurant Name", "User 1"
2. **Realistic prices** — in IDR, appropriate for Jakarta
3. **Realistic distances** — in km, based on actual Jakarta geography
4. **Realistic timestamps** — posts/visits within last 30 days, not all "2024-01-01"
5. **Varied ratings** — not everything is 5 stars. Mix of 3, 4, 5 (some 2 for realism)
6. **Indonesian context** — use local terms (warung, bakmi, nasi goreng, sate, etc.)
7. **Inclusive** — halal options, vegetarian-friendly, various budgets
8. **No offensive content** — keep it fun, not mean

---

## Image Guidelines

- Use Unsplash for placeholder images
- Food photos: `https://images.unsplash.com/photo-...`
- Restaurant cards: large, immersive, 16:9 or 4:3
- User avatars: `https://api.dicebear.com/7.x/avataaars/svg?seed=username`
- Menu items: close-up food shots
- Posts: mix of food photos and restaurant ambiance

---

## Empty State Copy

| Screen | Copy |
|--------|------|
| No saved places | "You haven't saved anything yet. Your future food addiction starts here. 🍜" |
| No food history | "We don't know what you've eaten yet. Let's fix that." |
| No recommendations | "We're hungry too. Give us a location and we'll figure it out." |
| No posts | "Be the first to share your food story. 🍜" |
| No search results | "No luck. Try a different word, or just spin and let us pick. 🎲" |
| No notifications | "Quiet for now. We'll shout when something good happens. 🔔" |
| No groups | "Eating alone? Create a group and decide together. 👥" |
| No leaderboard | "The race hasn't started yet. Be first! 🏆" |
