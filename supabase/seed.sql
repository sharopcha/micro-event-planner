-- Clear existing addons to avoid duplicates during reseeding if needed, 
-- or use ON CONFLICT. For a clean seed, typically we might trunc, but here we'll just insert.

-- Venues
INSERT INTO addons (category, name, description, price, budget_tag, compatible_event_types, active)
VALUES 
('venue', 'Elegant Interior Loft', 'A modern, bright indoor space with minimal aesthetics.', 150.00, 'standard', '{baby_shower, birthday_party, proposal}', true),
('venue', 'Garden Terrace', 'Beautiful outdoor space with natural greenery.', 120.00, 'standard', '{picnic, birthday_party, proposal}', true),
('venue', 'Modern Art Gallery', 'Sleek white walls and high ceilings for a sophisticated urban vibe.', 250.00, 'premium', '{birthday_party, proposal}', true),
('venue', 'Underground Speakeasy', 'Moody lighting and vintage leather seating. Perfect for a mysterious night.', 180.00, 'standard', '{birthday_party, proposal}', true),
('venue', 'Lakeside Cabin', 'Rustic charm with a breathtaking view of the water. Ideal for cozy gatherings.', 90.00, 'cheap', '{picnic, birthday_party}', true),
('venue', 'Rooftop Infinity Deck', 'Panoramic city views with a glass-bottom lounge area.', 350.00, 'premium', '{proposal, birthday_party}', true),
('venue', 'Botanical Greenhouse', 'Surrounded by rare tropical plants and natural sunlight.', 200.00, 'premium', '{baby_shower, proposal, picnic}', true)
ON CONFLICT (name) DO NOTHING;

-- Food
INSERT INTO addons (category, name, description, price, budget_tag, compatible_event_types, active)
VALUES 
('food', 'Gourmet Slider Trio', 'Mini burgers with wagyu, chicken, and halloumi.', 85.00, 'premium', '{birthday_party, picnic}', true),
('food', 'Artisanal Cheese Board', 'Selection of fine cheeses, honey, and crackers.', 45.00, 'standard', '{proposal, baby_shower, picnic}', true),
('food', 'Sweet Treats Platter', 'Macarons, mini tarts, and chocolate truffles.', 35.00, 'cheap', '{baby_shower, birthday_party}', true),
('food', 'Live Pasta Station', 'Chef-made fresh pasta for your guests.', 150.00, 'premium', '{birthday_party}', true),
('food', 'Mediterranean Mezze Platter', 'Hummus, falafel, stuffed vine leaves, and warm pita.', 55.00, 'standard', '{picnic, baby_shower}', true),
('food', 'Korean BBQ Sliders', 'Spicy pork belly with kimchi slaw and brioche buns.', 95.00, 'premium', '{birthday_party}', true),
('food', 'Vegan Harvest Bowl', 'Quinoa, roasted sweet potato, avocado, and tahini dressing.', 40.00, 'standard', '{baby_shower, picnic}', true),
('food', 'Dessert Grazing Table', 'A massive spread of brownies, donuts, and seasonal fruits.', 130.00, 'premium', '{birthday_party, baby_shower}', true),
('food', 'Taco Bar Fiesta', 'Build-your-own tacos with 3 types of fillings and fresh salsa.', 70.00, 'standard', '{birthday_party}', true),
('food', 'Classic Picnic Basket (2 people)', 'Sandwiches, fruit, and snacks in a wicker basket.', 40.00, 'standard', '{picnic}', true),
('food', 'Brunch Pack (serves 10)', 'Bagels, spreads, and pastries.', 75.00, 'standard', '{baby_shower}', true),
('food', 'Cake + Cupcakes (12 pcs)', 'Color-coordinated vanilla and chocolate treats.', 45.00, 'standard', '{birthday_party, baby_shower}', true),
('food', 'Gourmet Dessert Table', 'A massive spread of brownies, donuts, and seasonal fruits.', 120.00, 'premium', '{birthday_party, baby_shower}', true),
('food', 'Pizza & Snacks Pack (8 people)', 'Large pizzas and savory sides.', 60.00, 'standard', '{birthday_party}', true),
('food', 'Buffet Package (15 people)', 'Hot buffet with multiple main and side options.', 120.00, 'premium', '{birthday_party}', true),
('food', 'Custom Themed Cake', 'Beautifully designed cake matching your event theme.', 55.00, 'standard', '{birthday_party, baby_shower}', true),
('food', 'Luxury Charcuterie Board', 'Premium cured meats, artisan cheeses, and fruits.', 80.00, 'premium', '{proposal, picnic, baby_shower}', true),
('food', 'Champagne & Strawberries', 'Classic romantic pairing.', 60.00, 'standard', '{proposal}', true)
ON CONFLICT (name) DO NOTHING;

-- Drinks
INSERT INTO addons (category, name, description, price, budget_tag, compatible_event_types, active)
VALUES 
('drinks', 'Signature Mocktail Bar', 'Refreshing non-alcoholic drinks for all ages.', 40.00, 'cheap', '{baby_shower, birthday_party}', true),
('drinks', 'Premium Wine Selection', 'Expertly curated red and white wines.', 90.00, 'premium', '{proposal, birthday_party}', true),
('drinks', 'Champagne Tower', 'Elegant tower for a celebratory toast.', 120.00, 'premium', '{proposal, baby_shower}', true),
('drinks', 'Iced Tea & Lemonade Dispensers', 'Self-serve refreshing summer drinks.', 20.00, 'cheap', '{picnic, birthday_party}', true),
('drinks', 'Craft Beer Tasting', 'Selection of 5 local artisanal beers with tasting notes.', 60.00, 'standard', '{birthday_party, picnic}', true),
('drinks', 'Gin & Tonic Bar', 'Premium gins with various botanical garnishes.', 110.00, 'premium', '{proposal, birthday_party}', true),
('drinks', 'Fresh Juice Wall', 'Interactive wall with cold-pressed orange, beet, and kale juices.', 50.00, 'standard', '{baby_shower, picnic}', true),
('drinks', 'Artisanal Coffee Cart', 'Barista-made espresso, lattes, and flat whites.', 85.00, 'standard', '{baby_shower, birthday_party}', true),
('drinks', 'Champagne Popsicles', 'Frozen treats made with real bubbly and fruit.', 70.00, 'premium', '{proposal, birthday_party}', true),
('drinks', 'Lemonade & Iced Tea Jugs', 'Classic refreshments.', 20.00, 'cheap', '{picnic, birthday_party}', true)
ON CONFLICT (name) DO NOTHING;

-- Decor
INSERT INTO addons (category, name, description, price, budget_tag, compatible_event_types, active)
VALUES 
('decor', 'Neon "Better Together" Sign', 'Large neon light for photo ops.', 60.00, 'standard', '{proposal, birthday_party}', true),
('decor', 'Fairy Light Canopy', 'Dreamy lighting setup overhead.', 80.00, 'premium', '{proposal, picnic, birthday_party}', true),
('decor', 'Rustic Wooden Tables', 'Beautiful wood tables for a natural feel.', 50.00, 'standard', '{picnic, baby_shower}', true),
('decor', 'Disco Ball Installation', 'A cluster of various sized disco balls for a retro dance feel.', 90.00, 'standard', '{birthday_party}', true),
('decor', 'Tropical Palm Paradise', 'Large potted palms and bird-of-paradise flowers.', 75.00, 'standard', '{picnic, baby_shower}', true),
('decor', 'Vintage Movie Props', 'Old film reels, directors chairs, and popcorn machines.', 110.00, 'premium', '{birthday_party}', true),
('decor', 'Boho Chandelier', 'Macrame and bead chandelier for a soft, earthy glow.', 45.00, 'cheap', '{baby_shower, proposal, picnic}', true),
('decor', 'Candlelit Walkway', '50 flickering LED candles in glass lanterns.', 65.00, 'standard', '{proposal}', true),
('decor', 'Full Party Decor Setup', 'Complete decoration package including balloons and banners.', 150.00, 'premium', '{birthday_party}', true),
('decor', 'Premium Gender Reveal Package', 'Balloons, confetti, and specialized decor.', 89.00, 'premium', '{baby_shower}', true),
('decor', 'Table Centerpiece Kit', 'Floral centerpieces for 5 tables.', 45.00, 'standard', '{birthday_party, baby_shower}', true),
('decor', 'Marry Me Light-Up Letters', 'Giant illuminated letters.', 100.00, 'premium', '{proposal}', true),
('decor', 'Boho Rug & Cushion Set', 'Comfortable floor seating arrangement.', 50.00, 'standard', '{picnic}', true),
('decor', 'Pastel Balloon Set (30 pcs)', 'Soft colored balloons.', 25.00, 'cheap', '{baby_shower, birthday_party}', true),
('decor', 'Rose Petal Pathway', 'Romantic trail of petals.', 40.00, 'standard', '{proposal}', true),
('decor', 'Neon Banner Kit + Balloons', 'Bright and fun decor mix.', 35.00, 'standard', '{birthday_party}', true),
('decor', 'Themed Decoration Package', 'Decorations matching a specific theme.', 65.00, 'standard', '{birthday_party}', true)
ON CONFLICT (name) DO NOTHING;

-- Music
INSERT INTO addons (category, name, description, price, budget_tag, compatible_event_types, active)
VALUES 
('music', 'Solo Jazz Saxophonist', 'Live performance for a sophisticated vibe.', 120.00, 'premium', '{proposal, birthday_party}', true),
('music', 'Chill Lo-fi Playlist Setup', 'High-quality speaker with curated tracks.', 25.00, 'cheap', '{picnic, baby_shower}', true),
('music', 'Live Acoustic Guitarist', 'Intimate live music performance.', 100.00, 'standard', '{proposal, birthday_party}', true),
('music', 'Classical Harpist', 'Elegant background music for a peaceful atmosphere.', 150.00, 'premium', '{proposal, baby_shower}', true),
('music', 'Vinyl DJ Set', 'Classic tracks played exclusively on vinyl records.', 130.00, 'standard', '{birthday_party}', true),
('music', 'Acoustic Folk Trio', 'Upbeat harmony-heavy folk for a laid-back vibe.', 120.00, 'standard', '{picnic, birthday_party}', true),
('music', '80s Synth Specialist', 'Retro synthesizers playing the best of the decade.', 100.00, 'standard', '{birthday_party}', true),
('music', 'Romantic Bluetooth Speaker', 'Portable speaker with romantic playlists.', 30.00, 'cheap', '{proposal, picnic}', true)
ON CONFLICT (name) DO NOTHING;

-- Photography
INSERT INTO addons (category, name, description, price, budget_tag, compatible_event_types, active)
VALUES 
('photography', 'Professional Portrait Session', '1 hour with a pro photographer.', 180.00, 'premium', '{proposal, baby_shower, birthday_party}', true),
('photography', 'Polaroid Camera + 20 Films', 'Fun instant memories for your guests.', 45.00, 'standard', '{birthday_party, picnic, baby_shower}', true),
('photography', 'Drone Event Coverage', 'Stunning aerial shots and 4K video clips.', 220.00, 'premium', '{picnic, proposal}', true),
('photography', '360 Video Booth', 'Slow-motion video revolving around your guests.', 160.00, 'premium', '{birthday_party}', true),
('photography', 'B&W Film Photography', 'Timeless black and white shots on 35mm film.', 140.00, 'standard', '{proposal, baby_shower}', true),
('photography', 'DIY Photo Stand & Tripod', 'Setup for guests to take their own photos.', 25.00, 'cheap', '{birthday_party}', true)
ON CONFLICT (name) DO NOTHING;

-- Activities
INSERT INTO addons (category, name, description, price, budget_tag, compatible_event_types, active)
VALUES 
('activities', 'Flower Crowning Workshop', 'Everything needed to make your own fresh flower crown.', 65.00, 'standard', '{baby_shower, picnic}', true),
('activities', 'Tarot Card Reading', 'Mystical insights for your guests in a decorated tent.', 80.00, 'standard', '{birthday_party}', true),
('activities', 'Interactive Mural Painting', 'A large canvas where everyone can leave their mark.', 55.00, 'standard', '{birthday_party, baby_shower}', true),
('activities', 'Virtual Reality Zone', '2 VR headsets with party games pre-installed.', 120.00, 'premium', '{birthday_party}', true),
('activities', 'Baby Bingo + Photo Props', 'Fun games for a baby shower.', 30.00, 'standard', '{baby_shower}', true),
('activities', 'Party Games Kit', 'Selection of classic party games.', 35.00, 'standard', '{birthday_party}', true),
('activities', 'Karaoke Playlist + Setup Guide', 'Sing your heart out.', 20.00, 'cheap', '{birthday_party}', true),
('activities', 'Guess the Baby Game Kit', 'Interactive guessing game.', 15.00, 'cheap', '{baby_shower}', true),
('activities', 'Magic Show Guide + Props', 'Entertain the guests with magic.', 75.00, 'standard', '{birthday_party}', true),
('activities', 'Lawn Games Set', 'Sacks, spoons, and more for outdoor fun.', 30.00, 'standard', '{picnic}', true)
ON CONFLICT (name) DO NOTHING;

-- Extras
INSERT INTO addons (category, name, description, price, budget_tag, compatible_event_types, active)
VALUES 
('extras', 'Custom Printed Invitations', 'Set of 20 high-quality card invites.', 30.00, 'standard', '{baby_shower, birthday_party}', true),
('extras', 'Portable Power Station', 'Charge phones and run equipment anywhere.', 40.00, 'standard', '{picnic}', true),
('extras', 'Midnight Snack Bags', 'Popcorn, chocolate, and water for the ride home.', 25.00, 'cheap', '{birthday_party}', true),
('extras', 'Custom Matches & Favors', 'Branded items with your event name and date.', 35.00, 'standard', '{proposal, baby_shower, birthday_party}', true),
('extras', 'Valet Parking Service', 'Professional valet for up to 20 cars.', 150.00, 'premium', '{birthday_party}', true)
ON CONFLICT (name) DO NOTHING;
