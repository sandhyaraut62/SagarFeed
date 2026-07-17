-- ============================================================
-- Sagar Feeds — Seed Data
-- Run AFTER schema.sql:
--   mysql -u root -p sagarfeeds < seed.sql
-- ============================================================

-- Product catalog (from Sagar Feeds Product Overview)
INSERT INTO products (category, name, stage, description, image, price, unit, stock_quantity, low_stock_threshold) VALUES
-- Layer Feed
('Layer Feed', 'Layer Starter', '0-8 Weeks', 'High-protein crumbles for early growth and immunity building.', 'product-layer.png', 3200.00, '50kg bag', 180, 50),
('Layer Feed', 'Layer Grower', '8-18 Weeks', 'Balanced nutrition for skeletal and pullet development.', 'product-layer.png', 3100.00, '50kg bag', 160, 50),
('Layer Feed', 'Layer Mash', '18+ Weeks', 'Optimized for peak egg production and shell quality.', 'product-layer.png', 3050.00, '50kg bag', 40, 50),

-- Broiler Feed
('Broiler Feed', 'Pre-Starter', 'Day 1-7', 'Ultra-fine crumbles for maximum early growth.', 'product-broiler.png', 3400.00, '50kg bag', 120, 50),
('Broiler Feed', 'Starter Feed', 'Day 8-21', 'High energy and protein for rapid muscle building.', 'product-broiler.png', 3300.00, '50kg bag', 200, 50),
('Broiler Feed', 'Finisher Feed', 'Day 22-35', 'Optimized FCR for market-ready weight.', 'product-broiler.png', 3150.00, '50kg bag', 35, 50),

-- Giriraj Feed
('Giriraj Feed', 'Giriraj Starter', '0-6 Weeks', 'Special formula for indigenous breed vitality.', 'product-giriraj.jpg', 3000.00, '50kg bag', 90, 40),
('Giriraj Feed', 'Giriraj Grower', '6-16 Weeks', 'Enhanced immunity for free-range conditions.', 'product-giriraj.jpg', 2900.00, '50kg bag', 70, 40),
('Giriraj Feed', 'Giriraj Finisher', '16+ Weeks', 'Balanced for consistent growth pattern.', 'product-giriraj.jpg', 2850.00, '50kg bag', 25, 40),

-- Cattle Feed
('Cattle Feed', 'Calf Feed', 'Starter & Grower', 'Specially formulated Calf Starter and Calf Grower for healthy early development.', 'product-calf.jpg', 2600.00, '50kg bag', 110, 40),
('Cattle Feed', 'Heifer Feed', 'Growth & Development', 'Supports steady growth and development through the heifer stage.', 'product-heifer.jpg', 2650.00, '50kg bag', 95, 40),
('Cattle Feed', 'Milky Feed', 'Lactation', 'Dairy feed for lactating cows and buffalo that boosts milk yield.', 'product-milky.webp', 2800.00, '50kg bag', 210, 60),
('Cattle Feed', 'Dry Feed', 'Dry Period', 'Maintenance feed formulated for the dry period.', 'product-dry.jpg', 2500.00, '50kg bag', 30, 40),

-- Swine Feed
('Swine Feed', 'Fattening Feed', 'Starter / Grower / Finisher', 'Complete fattening range covering starter, grower and finisher stages.', 'product-pig.png', 2950.00, '50kg bag', 85, 40),
('Swine Feed', 'Lactation Feed', 'Nursing Sows', 'High energy formula for nursing sows.', 'product-pig.png', 3050.00, '50kg bag', 60, 40),
('Swine Feed', 'Gestation Feed', 'Pregnant Sows', 'Balanced nutrition for pregnant sows.', 'product-pig.png', 2900.00, '50kg bag', 20, 40),

-- Aqua Feed
('Aqua Feed', 'Sinking Feed', 'Bottom Feeding', 'Formulated for bottom feeding species.', 'product-fish.webp', 2400.00, '25kg bag', 140, 50),
('Aqua Feed', 'Floating Feed', 'Surface Feeding', 'Formulated for surface feeding fish with easy monitoring.', 'product-fish.webp', 2500.00, '25kg bag', 45, 50),

-- On-Demand & Specialized Feed
('Specialized Feed', 'Duck Feed', 'On-Demand', 'Specially formulated feed for ducks. Custom production available on request.', 'product-duck.png', 2700.00, '50kg bag', 55, 30),
('Specialized Feed', 'Common Quail Feed', 'On-Demand', 'Specially formulated feed for quail. Custom production available on request.', 'product-quail.jpg', 2750.00, '25kg bag', 20, 30),
('Specialized Feed', 'Goat Feed', 'On-Demand', 'Specially formulated feed for goats. Custom production available on request.', 'product-goat.jpg', 2600.00, '50kg bag', 65, 30),
('Specialized Feed', 'Horse Feed', 'On-Demand', 'Specially formulated feed for horses. Custom production available on request.', 'product-horse.jpg', 2900.00, '50kg bag', 15, 30);

-- Default admin account (email: admin@sagarfeeds.com / password: Admin@123)
-- Password hash below corresponds to "Admin@123" — CHANGE THIS PASSWORD after first login.
INSERT INTO users (full_name, email, phone, role, password_hash, status)
VALUES ('Sagar Feeds Admin', 'admin@sagarfeeds.com', '9800000000', 'Admin',
  '$2b$10$tPj3BoFVznYGTUwvWFW2suhRchO5FQuYC7F3vybdQFvNeuU1cuOcy', 'active');
