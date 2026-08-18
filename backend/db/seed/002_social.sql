-- NoIDK Seed Data - Phase 2
-- Posts, Visits, Votes, Trend Signals, Saved Places, Contributions
-- Migration 003: Social & community seed data

-- ============================================
-- POSTS (20+ posts)
-- ============================================
INSERT INTO posts (user_id, restaurant_id, content, rating, would_return, favorite_menu, tips, images, tags, created_at) VALUES
((SELECT id FROM users WHERE username = 'mika'), (SELECT id FROM restaurants WHERE name = 'Bakmi Orang Ketiga'), 'The chili oil noodles are insane. 🌶️ My recommendation: Spicy noodles + Dumplings. Total: Rp82K. Would come back: YES', 5, true, 'Bakmi Ayam Chili Oil', 'Come before 7pm to avoid the rush', '["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400"]', ARRAY['noodles', 'spicy', 'chinese'], NOW() - INTERVAL '3 days'),
((SELECT id FROM users WHERE username = 'josh'), (SELECT id FROM restaurants WHERE name = 'BurgerBarn'), 'Smash burger done right 🍔 No utensils needed, just hands. Double smashed patty with cheese and special sauce. The loaded fries are a must.', 4, true, 'Smash Burger', 'Get loaded fries on the side', '["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"]', ARRAY['burger', 'american'], NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE username = 'nana'), (SELECT id FROM restaurants WHERE name = 'Kopi & Co.'), 'Cozy atmosphere, great desserts. ☕ Perfect for a first date or deep conversations. The tiramisu is a must-try.', 5, true, 'Tiramisu', 'Ask for the window seat', '["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400"]', ARRAY['coffee', 'dessert', 'cozy'], NOW() - INTERVAL '1 week'),
((SELECT id FROM users WHERE username = 'kvin'), (SELECT id FROM restaurants WHERE name = 'Korean Soul'), 'K-BBQ and Korean fried chicken! 🔥 Their cheese buldak is legendary. Prepare for spice.', 5, true, 'Cheese Buldak', 'Order the cheese buldak, not for the faint-hearted', '["https://images.unsplash.com/photo-1632558506100-6d6f2a3a4ae8?w=400"]', ARRAY['korean', 'spicy', 'bbq'], NOW() - INTERVAL '2 weeks'),
((SELECT id FROM users WHERE username = 'alex'), (SELECT id FROM restaurants WHERE name = 'Fresh Bowl'), 'Healthy bowls and smoothies. 🥗 The açaí bowl is legit. Fresh, filling, and guilt-free.', 4, true, 'Açaí Bowl', 'Extra granola on top', '["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"]', ARRAY['healthy', 'bowl', 'smoothie'], NOW() - INTERVAL '1 week'),
((SELECT id FROM users WHERE username = 'mika'), (SELECT id FROM restaurants WHERE name = 'Sushi Kaze'), 'Chef Yamamoto trained in Tokyo for 15 years. 🍣 You can taste it. The dragon roll is art.', 5, true, 'Dragon Roll', 'Sit at the bar for the full experience', '["https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400"]', ARRAY['japanese', 'sushi', 'date'], NOW() - INTERVAL '10 days'),
((SELECT id FROM users WHERE username = 'josh'), (SELECT id FROM restaurants WHERE name = 'Ramen Ya!'), 'Rich tonkotsu ramen that simmers for 48 hours. 🍜 Worth the wait. The chashu melts in your mouth.', 4, true, 'Tonkotsu Ramen', 'Add an extra egg', '["https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400"]', ARRAY['japanese', 'ramen'], NOW() - INTERVAL '2 weeks'),
((SELECT id FROM users WHERE username = 'nana'), (SELECT id FROM restaurants WHERE name = 'Dapur Cokelat'), 'Artisanal chocolate and dessert house. 🍫 Their molten cake is pure heaven. The lava flows perfectly.', 5, true, 'Molten Chocolate Cake', 'Pair with vanilla ice cream', '["https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400"]', ARRAY['dessert', 'chocolate', 'date'], NOW() - INTERVAL '3 weeks'),
((SELECT id FROM users WHERE username = 'kvin'), (SELECT id FROM restaurants WHERE name = 'Taco Jose'), 'Authentic Mexican street tacos. 🌮 The al pastor is carved right off the trompo. Unreal.', 4, true, 'Al Pastor Taco (3pcs)', 'Ask for extra pineapple', '["https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400"]', ARRAY['mexican', 'tacos'], NOW() - INTERVAL '1 month'),
((SELECT id FROM users WHERE username = 'alex'), (SELECT id FROM restaurants WHERE name = 'Kedai Kopi Purnama'), 'Kopi joss — coffee with a piece of burning charcoal. ☕ Old-school vibes, affordable prices.', 4, true, 'Kopi Joss', 'Try the kopi joss, it''s unique', '["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400"]', ARRAY['coffee', 'indonesian', 'old-school'], NOW() - INTERVAL '1 month'),
((SELECT id FROM users WHERE username = 'mika'), (SELECT id FROM restaurants WHERE name = 'Pizza Club Menteng'), 'Neapolitan-style pizza in a converted colonial building. 🍕 Wood-fired oven imported from Italy.', 4, true, 'Margherita', 'Go for the margherita, classic perfection', '["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400"]', ARRAY['pizza', 'italian', 'date'], NOW() - INTERVAL '1 month'),
((SELECT id FROM users WHERE username = 'josh'), (SELECT id FROM restaurants WHERE name = 'Bbq Amerika'), 'American-style BBQ with smoky ribs and pulled pork. 🥩 Messy in the best way.', 4, true, 'Pulled Pork', 'Napkins, not forks', '["https://images.unsplash.com/photo-1544025162-d76694265947?w=400"]', ARRAY['bbq', 'american', 'messy'], NOW() - INTERVAL '6 weeks'),
((SELECT id FROM users WHERE username = 'nana'), (SELECT id FROM restaurants WHERE name = 'Thai Street'), 'Bangkok street food vibes. 🍜 Pad Thai cooked in a screaming-hot wok.', 4, true, 'Pad Thai', 'Ask for extra peanuts', '["https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400"]', ARRAY['thai', 'street-food'], NOW() - INTERVAL '2 months'),
((SELECT id FROM users WHERE username = 'kvin'), (SELECT id FROM restaurants WHERE name = 'Warung Mba Nana'), 'Home-cooked Indonesian comfort food. 🍛 Their rendang takes 6 hours to prepare.', 5, true, 'Nasi Rendang', 'Try the rendang, it''s a labor of love', '["https://images.unsplash.com/photo-1552611052-33e04de081de?w=400"]', ARRAY['indonesian', 'comfort', 'rendang'], NOW() - INTERVAL '3 weeks'),
((SELECT id FROM users WHERE username = 'alex'), (SELECT id FROM restaurants WHERE name = 'Pasta La Vista'), 'Italian-American comfort food. 🍝 Their mac & cheese is pure indulgence.', 4, true, 'Mac & Cheese', 'Add bacon bits', '["https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400"]', ARRAY['italian', 'pasta', 'comfort'], NOW() - INTERVAL '5 weeks'),
((SELECT id FROM users WHERE username = 'mika'), (SELECT id FROM restaurants WHERE name = 'Dim Sum Club'), 'Premium dim sum with a view. 🥟 Har gow and siu mai made fresh every morning.', 5, true, 'Har Gow', 'Weekend brunch hits different', '["https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400"]', ARRAY['chinese', 'dim-sum', 'brunch'], NOW() - INTERVAL '2 months'),
((SELECT id FROM users WHERE username = 'josh'), (SELECT id FROM restaurants WHERE name = 'Nasi Goreng Kebun Sirih'), 'Famous for their "nasi gorengSpecial" with a secret blend of 12 spices. 🍚 Late-night essential.', 4, true, 'Nasi Goreng Special', 'Best after midnight', '["https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400"]', ARRAY['indonesian', 'late-night', 'fried-rice'], NOW() - INTERVAL '3 months'),
((SELECT id FROM users WHERE username = 'nana'), (SELECT id FROM restaurants WHERE name = 'Sate Khas Senayan'), 'Premium satay with 12 types. 🥢 The lamb satay with kecap manis is a must.', 5, true, 'Sate Kambing', 'Try the lamb satay', '["https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400"]', ARRAY['indonesian', 'satay', 'premium'], NOW() - INTERVAL '4 weeks'),
((SELECT id FROM users WHERE username = 'kvin'), (SELECT id FROM restaurants WHERE name = 'Ayam Goreng Suharti'), 'Iconic Javanese fried chicken since 1970. 🍗 The secret is in the batter.', 4, true, 'Paha Atas Goreng', 'Add extra sambal', '["https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400"]', ARRAY['indonesian', 'fried-chicken'], NOW() - INTERVAL '2 months'),
((SELECT id FROM users WHERE username = 'alex'), (SELECT id FROM restaurants WHERE name = 'Bakery Klasik'), 'Artisanal bakery with sourdough, croissants, and Danish pastries. 🥐 Best at 7am.', 4, true, 'Sourdough Bread', 'Fresh from the oven at 7am', '["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"]', ARRAY['bakery', 'breakfast', 'coffee'], NOW() - INTERVAL '7 weeks'),
((SELECT id FROM users WHERE username = 'mika'), (SELECT id FROM restaurants WHERE name = 'Sate Khas Senayan'), 'The lamb satay is perfection. 🔥 12 types of satay, all grilled to order.', 5, true, 'Sate Kambing', 'Lamb > chicken here', '["https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400"]', ARRAY['indonesian', 'satay'], NOW() - INTERVAL '5 months'),
((SELECT id FROM users WHERE username = 'josh'), (SELECT id FROM restaurants WHERE name = 'Waroeng Steak'), 'Affordable Western steakhouse. 🥩 Their ribeye with mushroom sauce is a steal.', 4, true, 'Ribeye Steak', 'Medium rare is the way', '["https://images.unsplash.com/photo-1544025162-d76694265947?w=400"]', ARRAY['steak', 'western'], NOW() - INTERVAL '8 weeks'),
((SELECT id FROM users WHERE username = 'nana'), (SELECT id FROM restaurants WHERE name = 'Martabak San Francisco'), 'Premium martabak with Nutella, cheese, and condensed milk. 🍫 The sweet tooth''s dream.', 4, true, 'Martabak Manis', 'Nutella + cheese = perfection', '["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400"]', ARRAY['dessert', 'martabak'], NOW() - INTERVAL '3 months');

-- ============================================
-- VISITS (users marking restaurants as visited)
-- ============================================
INSERT INTO visits (user_id, restaurant_id, visited_at, rating, would_return) VALUES
((SELECT id FROM users WHERE username = 'mika'), (SELECT id FROM restaurants WHERE name = 'Bakmi Orang Ketiga'), NOW() - INTERVAL '3 days', 5, true),
((SELECT id FROM users WHERE username = 'mika'), (SELECT id FROM restaurants WHERE name = 'Sushi Kaze'), NOW() - INTERVAL '10 days', 5, true),
((SELECT id FROM users WHERE username = 'mika'), (SELECT id FROM restaurants WHERE name = 'Kopi & Co.'), NOW() - INTERVAL '1 week', 5, true),
((SELECT id FROM users WHERE username = 'mika'), (SELECT id FROM restaurants WHERE name = 'Pizza Club Menteng'), NOW() - INTERVAL '2 weeks', 4, true),
((SELECT id FROM users WHERE username = 'josh'), (SELECT id FROM restaurants WHERE name = 'BurgerBarn'), NOW() - INTERVAL '1 week', 4, true),
((SELECT id FROM users WHERE username = 'josh'), (SELECT id FROM restaurants WHERE name = 'Ramen Ya!'), NOW() - INTERVAL '2 weeks', 4, true),
((SELECT id FROM users WHERE username = 'josh'), (SELECT id FROM restaurants WHERE name = 'Bbq Amerika'), NOW() - INTERVAL '3 weeks', 4, true),
((SELECT id FROM users WHERE username = 'nana'), (SELECT id FROM restaurants WHERE name = 'Kopi & Co.'), NOW() - INTERVAL '1 week', 5, true),
((SELECT id FROM users WHERE username = 'nana'), (SELECT id FROM restaurants WHERE name = 'Dapur Cokelat'), NOW() - INTERVAL '2 weeks', 5, true),
((SELECT id FROM users WHERE username = 'nana'), (SELECT id FROM restaurants WHERE name = 'Thai Street'), NOW() - INTERVAL '1 month', 4, true),
((SELECT id FROM users WHERE username = 'nana'), (SELECT id FROM restaurants WHERE name = 'Sate Khas Senayan'), NOW() - INTERVAL '2 months', 5, true),
((SELECT id FROM users WHERE username = 'kvin'), (SELECT id FROM restaurants WHERE name = 'Korean Soul'), NOW() - INTERVAL '1 week', 5, true),
((SELECT id FROM users WHERE username = 'kvin'), (SELECT id FROM restaurants WHERE name = 'Taco Jose'), NOW() - INTERVAL '3 weeks', 4, true),
((SELECT id FROM users WHERE username = 'kvin'), (SELECT id FROM restaurants WHERE name = 'Warung Mba Nana'), NOW() - INTERVAL '1 month', 5, true),
((SELECT id FROM users WHERE username = 'kvin'), (SELECT id FROM restaurants WHERE name = 'Ayam Goreng Suharti'), NOW() - INTERVAL '2 months', 4, true),
((SELECT id FROM users WHERE username = 'alex'), (SELECT id FROM restaurants WHERE name = 'Fresh Bowl'), NOW() - INTERVAL '2 weeks', 4, true),
((SELECT id FROM users WHERE username = 'alex'), (SELECT id FROM restaurants WHERE name = 'Kedai Kopi Purnama'), NOW() - INTERVAL '1 month', 4, true),
((SELECT id FROM users WHERE username = 'alex'), (SELECT id FROM restaurants WHERE name = 'Pasta La Vista'), NOW() - INTERVAL '6 weeks', 4, true);

-- ============================================
-- VOTES (community verdict)
-- ============================================
INSERT INTO votes (user_id, target_type, target_id, vote_type) VALUES
-- Votes on restaurants (target_id = restaurant.id)
((SELECT id FROM users WHERE username = 'mika'), 'restaurant', (SELECT id FROM restaurants WHERE name = 'Bakmi Orang Ketiga'), 'yes'),
((SELECT id FROM users WHERE username = 'mika'), 'restaurant', (SELECT id FROM restaurants WHERE name = 'Sushi Kaze'), 'yes'),
((SELECT id FROM users WHERE username = 'josh'), 'restaurant', (SELECT id FROM restaurants WHERE name = 'BurgerBarn'), 'yes'),
((SELECT id FROM users WHERE username = 'josh'), 'restaurant', (SELECT id FROM restaurants WHERE name = 'Bbq Amerika'), 'maybe'),
((SELECT id FROM users WHERE username = 'nana'), 'restaurant', (SELECT id FROM restaurants WHERE name = 'Kopi & Co.'), 'yes'),
((SELECT id FROM users WHERE username = 'nana'), 'restaurant', (SELECT id FROM restaurants WHERE name = 'Dapur Cokelat'), 'yes'),
((SELECT id FROM users WHERE username = 'kvin'), 'restaurant', (SELECT id FROM restaurants WHERE name = 'Korean Soul'), 'yes'),
((SELECT id FROM users WHERE username = 'kvin'), 'restaurant', (SELECT id FROM restaurants WHERE name = 'Taco Jose'), 'yes'),
((SELECT id FROM users WHERE username = 'alex'), 'restaurant', (SELECT id FROM restaurants WHERE name = 'Fresh Bowl'), 'yes'),
((SELECT id FROM users WHERE username = 'alex'), 'restaurant', (SELECT id FROM restaurants WHERE name = 'Kedai Kopi Purnama'), 'maybe'),
((SELECT id FROM users WHERE username = 'mika'), 'restaurant', (SELECT id FROM restaurants WHERE name = 'Sate Khas Senayan'), 'yes'),
((SELECT id FROM users WHERE username = 'josh'), 'restaurant', (SELECT id FROM restaurants WHERE name = 'Ramen Ya!'), 'yes'),
((SELECT id FROM users WHERE username = 'nana'), 'restaurant', (SELECT id FROM restaurants WHERE name = 'Thai Street'), 'yes'),
((SELECT id FROM users WHERE username = 'kvin'), 'restaurant', (SELECT id FROM restaurants WHERE name = 'Warung Mba Nana'), 'yes'),
((SELECT id FROM users WHERE username = 'alex'), 'restaurant', (SELECT id FROM restaurants WHERE name = 'Pasta La Vista'), 'yes');

-- ============================================
-- TREND SIGNALS (external trend data)
-- ============================================
INSERT INTO trend_signals (restaurant_id, source, signal_type, score, metadata, created_at) VALUES
((SELECT id FROM restaurants WHERE name = 'Bakmi Orang Ketiga'), 'tiktok', 'trending', 85.5, '{"mentions": 1250, "views": 50000}', NOW()),
((SELECT id FROM restaurants WHERE name = 'BurgerBarn'), 'tiktok', 'trending', 72.3, '{"mentions": 890, "views": 35000}', NOW()),
((SELECT id FROM restaurants WHERE name = 'Kopi & Co.'), 'tiktok', 'trending', 90.1, '{"mentions": 1500, "views": 75000}', NOW()),
((SELECT id FROM restaurants WHERE name = 'Sushi Kaze'), 'youtube', 'featured', 95.0, '{"creator": "FoodEscapeID", "views": 250000}', NOW()),
((SELECT id FROM restaurants WHERE name = 'Korean Soul'), 'youtube', 'featured', 88.7, '{"creator": "Seoul Eats", "views": 180000}', NOW()),
((SELECT id FROM restaurants WHERE name = 'Dapur Cokelat'), 'instagram', 'popular', 78.9, '{"posts": 2340, "likes": 45000}', NOW()),
((SELECT id FROM restaurants WHERE name = 'Bbq Amerika'), 'tiktok', 'trending', 68.4, '{"mentions": 560, "views": 28000}', NOW()),
((SELECT id FROM restaurants WHERE name = 'Dim Sum Club'), 'google_maps', 'popular', 82.1, '{"rating": 4.7, "reviews": 445}', NOW()),
((SELECT id FROM restaurants WHERE name = 'Shabu Hannos'), 'google_maps', 'popular', 91.5, '{"rating": 4.9, "reviews": 678}', NOW()),
((SELECT id FROM restaurants WHERE name = 'Sate Khas Senayan'), 'google_maps', 'popular', 93.2, '{"rating": 4.8, "reviews": 892}', NOW()),
((SELECT id FROM restaurants WHERE name = 'Pizza Club Menteng'), 'instagram', 'popular', 76.8, '{"posts": 1890, "likes": 32000}', NOW()),
((SELECT id FROM restaurants WHERE name = 'Taco Jose'), 'tiktok', 'trending', 65.2, '{"mentions": 420, "views": 21000}', NOW());

-- ============================================
-- SAVED PLACES (user bookmarks)
-- ============================================
INSERT INTO saved_places (user_id, restaurant_id, category) VALUES
((SELECT id FROM users WHERE username = 'mika'), (SELECT id FROM restaurants WHERE name = 'Bakmi Orang Ketiga'), 'favorites'),
((SELECT id FROM users WHERE username = 'mika'), (SELECT id FROM restaurants WHERE name = 'Sushi Kaze'), 'date_ideas'),
((SELECT id FROM users WHERE username = 'mika'), (SELECT id FROM restaurants WHERE name = 'Kopi & Co.'), 'coffee'),
((SELECT id FROM users WHERE username = 'mika'), (SELECT id FROM restaurants WHERE name = 'Sate Khas Senayan'), 'want_to_try'),
((SELECT id FROM users WHERE username = 'josh'), (SELECT id FROM restaurants WHERE name = 'BurgerBarn'), 'favorites'),
((SELECT id FROM users WHERE username = 'josh'), (SELECT id FROM restaurants WHERE name = 'Ramen Ya!'), 'food'),
((SELECT id FROM users WHERE username = 'josh'), (SELECT id FROM restaurants WHERE name = 'Bbq Amerika'), 'want_to_try'),
((SELECT id FROM users WHERE username = 'nana'), (SELECT id FROM restaurants WHERE name = 'Kopi & Co.'), 'coffee'),
((SELECT id FROM users WHERE username = 'nana'), (SELECT id FROM restaurants WHERE name = 'Dapur Cokelat'), 'favorites'),
((SELECT id FROM users WHERE username = 'nana'), (SELECT id FROM restaurants WHERE name = 'Thai Street'), 'food'),
((SELECT id FROM users WHERE username = 'nana'), (SELECT id FROM restaurants WHERE name = 'Sate Khas Senayan'), 'date_ideas'),
((SELECT id FROM users WHERE username = 'kvin'), (SELECT id FROM restaurants WHERE name = 'Korean Soul'), 'favorites'),
((SELECT id FROM users WHERE username = 'kvin'), (SELECT id FROM restaurants WHERE name = 'Taco Jose'), 'food'),
((SELECT id FROM users WHERE username = 'kvin'), (SELECT id FROM restaurants WHERE name = 'Warung Mba Nana'), 'favorites'),
((SELECT id FROM users WHERE username = 'alex'), (SELECT id FROM restaurants WHERE name = 'Fresh Bowl'), 'food'),
((SELECT id FROM users WHERE username = 'alex'), (SELECT id FROM restaurants WHERE name = 'Kedai Kopi Purnama'), 'coffee'),
((SELECT id FROM users WHERE username = 'alex'), (SELECT id FROM restaurants WHERE name = 'Pasta La Vista'), 'want_to_try');

-- ============================================
-- CONTRIBUTIONS (XP tracking)
-- ============================================
INSERT INTO contributions (user_id, type, points, description, created_at) VALUES
((SELECT id FROM users WHERE username = 'mika'), 'add_restaurant', 5, 'Added Bakmi Orang Ketiga', NOW() - INTERVAL '2 months'),
((SELECT id FROM users WHERE username = 'mika'), 'review', 5, 'Detailed review of Sushi Kaze', NOW() - INTERVAL '1 month'),
((SELECT id FROM users WHERE username = 'mika'), 'upload_photo', 2, 'Uploaded photos to Kopi & Co.', NOW() - INTERVAL '3 weeks'),
((SELECT id FROM users WHERE username = 'mika'), 'upload_menu', 3, 'Added menu items to Pizza Club Menteng', NOW() - INTERVAL '2 weeks'),
((SELECT id FROM users WHERE username = 'josh'), 'add_restaurant', 5, 'Added BurgerBarn', NOW() - INTERVAL '3 months'),
((SELECT id FROM users WHERE username = 'josh'), 'review', 5, 'Detailed review of Ramen Ya!', NOW() - INTERVAL '2 months'),
((SELECT id FROM users WHERE username = 'josh'), 'upload_photo', 2, 'Uploaded photos to Bbq Amerika', NOW() - INTERVAL '1 month'),
((SELECT id FROM users WHERE username = 'nana'), 'add_restaurant', 5, 'Added Dapur Cokelat', NOW() - INTERVAL '4 months'),
((SELECT id FROM users WHERE username = 'nana'), 'review', 5, 'Detailed review of Thai Street', NOW() - INTERVAL '3 months'),
((SELECT id FROM users WHERE username = 'nana'), 'verify', 5, 'Verified Sate Khas Senayan info', NOW() - INTERVAL '2 months'),
((SELECT id FROM users WHERE username = 'nana'), 'upload_menu', 3, 'Added menu items to Kopi & Co.', NOW() - INTERVAL '1 month'),
((SELECT id FROM users WHERE username = 'kvin'), 'add_restaurant', 5, 'Added Korean Soul', NOW() - INTERVAL '2 months'),
((SELECT id FROM users WHERE username = 'kvin'), 'review', 5, 'Detailed review of Taco Jose', NOW() - INTERVAL '1 month'),
((SELECT id FROM users WHERE username = 'kvin'), 'upload_photo', 2, 'Uploaded photos to Warung Mba Nana', NOW() - INTERVAL '3 weeks'),
((SELECT id FROM users WHERE username = 'alex'), 'add_restaurant', 5, 'Added Fresh Bowl', NOW() - INTERVAL '3 months'),
((SELECT id FROM users WHERE username = 'alex'), 'review', 5, 'Detailed review of Kedai Kopi Purnama', NOW() - INTERVAL '2 months'),
((SELECT id FROM users WHERE username = 'alex'), 'upload_menu', 3, 'Added menu items to Pasta La Vista', NOW() - INTERVAL '1 month');
