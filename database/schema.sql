-- =====================================================
-- Somansa Smart Rental System Database Schema
-- MySQL/MariaDB Schema (Not Connected - Demo Only)
-- =====================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS `invoice_items`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `availability`;
DROP TABLE IF EXISTS `units`;
DROP TABLE IF EXISTS `property_images`;
DROP TABLE IF EXISTS `property_amenities`;
DROP TABLE IF EXISTS `properties`;
DROP TABLE IF EXISTS `amenities`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `admin_users`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `price_alerts`;
DROP TABLE IF EXISTS `analytics_events`;
DROP TABLE IF EXISTS `reviews`;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50),
  `avatar` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ADMIN USERS TABLE (Demo Account)
-- =====================================================
CREATE TABLE `admin_users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'admin', 'manager') DEFAULT 'admin',
  `is_demo` TINYINT(1) DEFAULT 0,
  `avatar` VARCHAR(255),
  `last_login` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `icon` VARCHAR(100),
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PROPERTIES TABLE
-- =====================================================
CREATE TABLE `properties` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `category_id` INT UNSIGNED,
  `address` VARCHAR(500),
  `city` VARCHAR(100),
  `province` VARCHAR(100),
  `postal_code` VARCHAR(20),
  `latitude` DECIMAL(10, 8),
  `longitude` DECIMAL(11, 8),
  `main_image` VARCHAR(255),
  `status` ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
  `rating` DECIMAL(3, 2) DEFAULT 0.00,
  `total_reviews` INT DEFAULT 0,
  `total_units` INT DEFAULT 0,
  `base_price` DECIMAL(12, 2) DEFAULT 0.00,
  `featured` TINYINT(1) DEFAULT 0,
  `views` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_category` (`category_id`),
  KEY `idx_status` (`status`),
  KEY `idx_featured` (`featured`),
  KEY `idx_city` (`city`),
  CONSTRAINT `fk_property_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PROPERTY IMAGES TABLE
-- =====================================================
CREATE TABLE `property_images` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `property_id` INT UNSIGNED NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255),
  `description` TEXT,
  `display_order` INT DEFAULT 0,
  `is_360` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_property` (`property_id`),
  KEY `idx_display_order` (`display_order`),
  CONSTRAINT `fk_image_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- AMENITIES TABLE
-- =====================================================
CREATE TABLE `amenities` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(100),
  `category` VARCHAR(50),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PROPERTY AMENITIES TABLE (Many-to-Many)
-- =====================================================
CREATE TABLE `property_amenities` (
  `property_id` INT UNSIGNED NOT NULL,
  `amenity_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`property_id`, `amenity_id`),
  KEY `idx_amenity` (`amenity_id`),
  CONSTRAINT `fk_pa_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pa_amenity` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- UNITS TABLE
-- =====================================================
CREATE TABLE `units` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `property_id` INT UNSIGNED NOT NULL,
  `unit_number` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255),
  `type` VARCHAR(100),
  `size` DECIMAL(8, 2),
  `size_unit` VARCHAR(20) DEFAULT 'm2',
  `bedrooms` INT DEFAULT 0,
  `bathrooms` INT DEFAULT 0,
  `capacity` INT DEFAULT 1,
  `floor` INT,
  `description` TEXT,
  `price_per_day` DECIMAL(12, 2) NOT NULL,
  `price_per_week` DECIMAL(12, 2),
  `price_per_month` DECIMAL(12, 2),
  `status` ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
  `image` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_property` (`property_id`),
  KEY `idx_status` (`status`),
  UNIQUE KEY `unique_unit` (`property_id`, `unit_number`),
  CONSTRAINT `fk_unit_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- AVAILABILITY TABLE
-- =====================================================
CREATE TABLE `availability` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `property_id` INT UNSIGNED NOT NULL,
  `unit_id` INT UNSIGNED NOT NULL,
  `date` DATE NOT NULL,
  `is_available` TINYINT(1) DEFAULT 1,
  `price` DECIMAL(12, 2),
  `min_stay` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_availability` (`unit_id`, `date`),
  KEY `idx_property` (`property_id`),
  KEY `idx_date` (`date`),
  CONSTRAINT `fk_avail_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_avail_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE `bookings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_code` VARCHAR(20) NOT NULL,
  `user_id` INT UNSIGNED,
  `property_id` INT UNSIGNED NOT NULL,
  `unit_id` INT UNSIGNED NOT NULL,
  `guest_name` VARCHAR(255) NOT NULL,
  `guest_email` VARCHAR(255) NOT NULL,
  `guest_phone` VARCHAR(50) NOT NULL,
  `guest_count` INT DEFAULT 1,
  `check_in` DATE NOT NULL,
  `check_out` DATE NOT NULL,
  `nights` INT NOT NULL,
  `total_price` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('pending', 'confirmed', 'cancelled', 'completed', 'refunded') DEFAULT 'pending',
  `payment_status` ENUM('unpaid', 'partial', 'paid', 'refunded') DEFAULT 'unpaid',
  `payment_method` VARCHAR(50),
  `special_requests` TEXT,
  `notes` TEXT,
  `cancelled_at` TIMESTAMP NULL,
  `cancellation_reason` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_code` (`booking_code`),
  KEY `idx_user` (`user_id`),
  KEY `idx_property` (`property_id`),
  KEY `idx_unit` (`unit_id`),
  KEY `idx_status` (`status`),
  KEY `idx_check_in` (`check_in`),
  KEY `idx_check_out` (`check_out`),
  CONSTRAINT `fk_booking_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_booking_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_booking_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INVOICES TABLE
-- =====================================================
CREATE TABLE `invoices` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `invoice_number` VARCHAR(20) NOT NULL,
  `booking_id` INT UNSIGNED NOT NULL,
  `subtotal` DECIMAL(12, 2) NOT NULL,
  `tax` DECIMAL(12, 2) DEFAULT 0.00,
  `discount` DECIMAL(12, 2) DEFAULT 0.00,
  `total` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
  `due_date` DATE,
  `paid_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_number` (`invoice_number`),
  KEY `idx_booking` (`booking_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_invoice_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INVOICE ITEMS TABLE
-- =====================================================
CREATE TABLE `invoice_items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `invoice_id` INT UNSIGNED NOT NULL,
  `description` VARCHAR(500) NOT NULL,
  `quantity` INT DEFAULT 1,
  `unit_price` DECIMAL(12, 2) NOT NULL,
  `total` DECIMAL(12, 2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_invoice` (`invoice_id`),
  CONSTRAINT `fk_item_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PRICE ALERTS TABLE
-- =====================================================
CREATE TABLE `price_alerts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_email` VARCHAR(255) NOT NULL,
  `property_id` INT UNSIGNED NOT NULL,
  `target_price` DECIMAL(12, 2) NOT NULL,
  `current_price` DECIMAL(12, 2),
  `status` ENUM('active', 'triggered', 'cancelled') DEFAULT 'active',
  `triggered_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_property` (`property_id`),
  KEY `idx_user_email` (`user_email`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_alert_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- ANALYTICS EVENTS TABLE
-- =====================================================
CREATE TABLE `analytics_events` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_type` VARCHAR(50) NOT NULL,
  `event_category` VARCHAR(50),
  `event_label` VARCHAR(255),
  `user_id` INT UNSIGNED,
  `session_id` VARCHAR(100),
  `property_id` INT UNSIGNED,
  `metadata` JSON,
  `ip_address` VARCHAR(45),
  `user_agent` VARCHAR(500),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_event_type` (`event_type`),
  KEY `idx_user` (`user_id`),
  KEY `idx_property` (`property_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_event_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_event_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE `reviews` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `property_id` INT UNSIGNED NOT NULL,
  `booking_id` INT UNSIGNED,
  `user_id` INT UNSIGNED,
  `guest_name` VARCHAR(255) NOT NULL,
  `rating` INT NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `title` VARCHAR(255),
  `comment` TEXT,
  `cleanliness_rating` INT CHECK (`cleanliness_rating` >= 1 AND `cleanliness_rating` <= 5),
  `location_rating` INT CHECK (`location_rating` >= 1 AND `location_rating` <= 5),
  `value_rating` INT CHECK (`value_rating` >= 1 AND `value_rating` <= 5),
  `communication_rating` INT CHECK (`communication_rating` >= 1 AND `communication_rating` <= 5),
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `is_verified` TINYINT(1) DEFAULT 0,
  `helpful_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_property` (`property_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_booking` (`booking_id`),
  KEY `idx_status` (`status`),
  KEY `idx_rating` (`rating`),
  CONSTRAINT `fk_review_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_review_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DEMO DATA INSERTS
-- =====================================================

-- Insert Demo Admin User
INSERT INTO `admin_users` (`username`, `email`, `name`, `role`, `is_demo`, `last_login`) VALUES
('demo_admin', 'admin@somansa.demo', 'Demo Administrator', 'super_admin', 1, NOW());

-- Insert Categories
INSERT INTO `categories` (`name`, `slug`, `description`, `icon`, `display_order`) VALUES
('Apartment', 'apartment', 'Modern apartments for rent', 'building', 1),
('House', 'house', 'Comfortable houses for families', 'home', 2),
('Villa', 'villa', 'Luxury villas with premium amenities', 'villa', 3),
('Studio', 'studio', 'Compact studios for individuals', 'studio', 4),
('Office', 'office', 'Professional office spaces', 'briefcase', 5);

-- Insert Amenities
INSERT INTO `amenities` (`name`, `slug`, `icon`, `category`) VALUES
('WiFi', 'wifi', 'wifi', 'connectivity'),
('Air Conditioning', 'ac', 'snowflake', 'comfort'),
('Parking', 'parking', 'car', 'facilities'),
('Swimming Pool', 'pool', 'water', 'recreation'),
('Gym', 'gym', 'dumbbell', 'recreation'),
('Kitchen', 'kitchen', 'utensils', 'facilities'),
('Washer', 'washer', 'washer', 'facilities'),
('TV', 'tv', 'tv', 'entertainment'),
('Elevator', 'elevator', 'elevator', 'facilities'),
('Security', 'security', 'shield', 'safety');

-- =====================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out, status);
CREATE INDEX idx_properties_search ON properties(city, status, featured);
CREATE INDEX idx_units_search ON units(property_id, status, price_per_day);
CREATE INDEX idx_availability_search ON availability(property_id, date, is_available);
CREATE INDEX idx_analytics_stats ON analytics_events(event_type, created_at);

-- Full-text search indexes
ALTER TABLE properties ADD FULLTEXT INDEX ft_properties_search (name, description, address);
ALTER TABLE units ADD FULLTEXT INDEX ft_units_search (name, description);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Property summary view
CREATE OR REPLACE VIEW vw_property_summary AS
SELECT 
  p.id,
  p.name,
  p.slug,
  p.city,
  p.base_price,
  p.rating,
  p.total_reviews,
  p.total_units,
  p.status,
  p.featured,
  c.name as category_name,
  COUNT(DISTINCT u.id) as available_units,
  MIN(u.price_per_day) as min_price,
  MAX(u.price_per_day) as max_price
FROM properties p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN units u ON p.id = u.property_id AND u.status = 'available'
WHERE p.status = 'active'
GROUP BY p.id;

-- Booking statistics view
CREATE OR REPLACE VIEW vw_booking_stats AS
SELECT 
  DATE_FORMAT(created_at, '%Y-%m') as month,
  COUNT(*) as total_bookings,
  SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
  SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
  SUM(total_price) as total_revenue,
  AVG(total_price) as avg_booking_value,
  AVG(nights) as avg_nights
FROM bookings
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month DESC;

-- Revenue by property view
CREATE OR REPLACE VIEW vw_revenue_by_property AS
SELECT 
  p.id,
  p.name,
  COUNT(b.id) as total_bookings,
  SUM(b.total_price) as total_revenue,
  AVG(b.total_price) as avg_booking_value,
  SUM(b.nights) as total_nights,
  p.rating,
  p.total_reviews
FROM properties p
LEFT JOIN bookings b ON p.id = b.property_id AND b.status IN ('confirmed', 'completed')
GROUP BY p.id
ORDER BY total_revenue DESC;

-- =====================================================
-- STORED PROCEDURES FOR COMMON OPERATIONS
-- =====================================================

DELIMITER //

-- Calculate booking total
CREATE PROCEDURE sp_calculate_booking_total(
  IN p_unit_id INT,
  IN p_check_in DATE,
  IN p_check_out DATE,
  OUT p_nights INT,
  OUT p_total DECIMAL(12,2)
)
BEGIN
  DECLARE v_price_per_day DECIMAL(12,2);
  
  SELECT price_per_day INTO v_price_per_day
  FROM units WHERE id = p_unit_id;
  
  SET p_nights = DATEDIFF(p_check_out, p_check_in);
  SET p_total = v_price_per_day * p_nights;
END //

-- Check availability
CREATE PROCEDURE sp_check_availability(
  IN p_property_id INT,
  IN p_unit_id INT,
  IN p_check_in DATE,
  IN p_check_out DATE,
  OUT p_is_available BOOLEAN
)
BEGIN
  DECLARE v_count INT;
  
  SELECT COUNT(*) INTO v_count
  FROM bookings
  WHERE unit_id = p_unit_id
    AND status IN ('pending', 'confirmed')
    AND (
      (check_in <= p_check_in AND check_out > p_check_in)
      OR (check_in < p_check_out AND check_out >= p_check_out)
      OR (check_in >= p_check_in AND check_out <= p_check_out)
    );
  
  SET p_is_available = (v_count = 0);
END //

-- Update property statistics
CREATE PROCEDURE sp_update_property_stats(IN p_property_id INT)
BEGIN
  UPDATE properties p
  SET 
    total_reviews = (SELECT COUNT(*) FROM reviews WHERE property_id = p_property_id AND status = 'approved'),
    rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE property_id = p_property_id AND status = 'approved'),
    total_units = (SELECT COUNT(*) FROM units WHERE property_id = p_property_id)
  WHERE id = p_property_id;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS FOR DATA INTEGRITY
-- =====================================================

DELIMITER //

-- Update property stats when review is added
CREATE TRIGGER trg_review_after_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
  IF NEW.status = 'approved' THEN
    CALL sp_update_property_stats(NEW.property_id);
  END IF;
END //

-- Update property stats when review is updated
CREATE TRIGGER trg_review_after_update
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
  IF NEW.status = 'approved' OR OLD.status = 'approved' THEN
    CALL sp_update_property_stats(NEW.property_id);
  END IF;
END //

-- Generate booking code before insert
CREATE TRIGGER trg_booking_before_insert
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
  IF NEW.booking_code IS NULL OR NEW.booking_code = '' THEN
    SET NEW.booking_code = CONCAT('BK', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(FLOOR(RAND() * 10000), 4, '0'));
  END IF;
END //

-- Generate invoice number before insert
CREATE TRIGGER trg_invoice_before_insert
BEFORE INSERT ON invoices
FOR EACH ROW
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    SET NEW.invoice_number = CONCAT('INV', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(FLOOR(RAND() * 10000), 4, '0'));
  END IF;
END //

DELIMITER ;

-- =====================================================
-- OPTIMIZATION SETTINGS
-- =====================================================

-- Enable query cache (if supported)
SET GLOBAL query_cache_size = 67108864; -- 64MB
SET GLOBAL query_cache_type = ON;

-- Optimize table settings
ALTER TABLE properties ENGINE=InnoDB ROW_FORMAT=DYNAMIC;
ALTER TABLE bookings ENGINE=InnoDB ROW_FORMAT=DYNAMIC;
ALTER TABLE availability ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
