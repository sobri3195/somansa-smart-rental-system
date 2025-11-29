-- Migration: Add Photos and Reviews tables
-- Date: 2024-11-29

-- Table: photos
CREATE TABLE IF NOT EXISTS photos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT UNSIGNED NULL,
    entity_type ENUM('property', 'unit') NOT NULL,
    entity_id INT UNSIGNED NOT NULL,
    filename VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    caption TEXT,
    is_main BOOLEAN DEFAULT FALSE,
    uploaded_by INT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_tenant (tenant_id),
    INDEX idx_is_main (is_main),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: reviews
CREATE TABLE IF NOT EXISTS reviews (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT UNSIGNED NULL,
    booking_id INT UNSIGNED NOT NULL,
    property_id INT UNSIGNED NOT NULL,
    unit_id INT UNSIGNED NOT NULL,
    customer_id INT UNSIGNED NOT NULL,
    rating TINYINT UNSIGNED NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    owner_reply TEXT NULL,
    owner_reply_at TIMESTAMP NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_property (property_id),
    INDEX idx_unit (unit_id),
    INDEX idx_customer (customer_id),
    INDEX idx_rating (rating),
    INDEX idx_approved (is_approved),
    UNIQUE KEY unique_booking_review (booking_id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add average_rating and review_count columns to properties
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(2,1) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS review_count INT UNSIGNED DEFAULT 0,
ADD INDEX idx_rating (average_rating);

-- Add average_rating and review_count columns to units
ALTER TABLE units
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(2,1) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS review_count INT UNSIGNED DEFAULT 0,
ADD INDEX idx_rating (average_rating);
