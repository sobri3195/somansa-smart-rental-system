-- ==================================================
-- SOMANSA - SAMPLE DATA FOR TESTING
-- ==================================================

-- Insert sample tenant
INSERT INTO tenants (name, contact_name, contact_email, contact_phone, plan_type, status) VALUES
('Demo Rental Company', 'John Doe', 'john@demorental.com', '+628123456789', 'premium', 'active');

SET @tenant_id = LAST_INSERT_ID();

-- Insert users
INSERT INTO users (tenant_id, name, email, password_hash, phone, role, is_active) VALUES
(NULL, 'Super Admin', 'admin@somansa.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+628111111111', 'super_admin', TRUE),
(@tenant_id, 'Owner Demo', 'owner@demorental.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+628123456789', 'owner', TRUE),
(@tenant_id, 'Staff Demo', 'staff@demorental.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+628123456790', 'staff', TRUE),
(@tenant_id, 'Customer Demo', 'customer@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+628123456791', 'customer', TRUE);

-- Note: Default password for all users is "password" (hashed with bcrypt cost 10)

-- Insert sample properties
INSERT INTO properties (tenant_id, name, type, address, city, state, country, latitude, longitude, description, photos, amenities, is_active) VALUES
(@tenant_id, 'Sunset Villa', 'house', 'Jl. Pantai Indah No. 123', 'Bali', 'Bali', 'Indonesia', -8.409518, 115.188919, 'Beautiful beachfront villa with ocean view', 
 JSON_ARRAY('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800'),
 JSON_ARRAY('WiFi', 'Pool', 'Kitchen', 'Air Conditioning', 'Parking'),
 TRUE),
(@tenant_id, 'City Kos Putra', 'kos', 'Jl. Sudirman No. 45', 'Jakarta', 'DKI Jakarta', 'Indonesia', -6.208763, 106.845599, 'Affordable boarding house for students and workers',
 JSON_ARRAY('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'),
 JSON_ARRAY('WiFi', 'Laundry', 'Kitchen', 'Security'),
 TRUE),
(@tenant_id, 'Premium Car Rental', 'car', 'Jl. Airport No. 1', 'Jakarta', 'DKI Jakarta', 'Indonesia', -6.125567, 106.655897, 'Luxury and economy car rental service',
 JSON_ARRAY('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800'),
 JSON_ARRAY('Insurance', '24/7 Support', 'GPS', 'Driver Available'),
 TRUE);

SET @property_house = (SELECT id FROM properties WHERE name = 'Sunset Villa' LIMIT 1);
SET @property_kos = (SELECT id FROM properties WHERE name = 'City Kos Putra' LIMIT 1);
SET @property_car = (SELECT id FROM properties WHERE name = 'Premium Car Rental' LIMIT 1);

-- Insert sample units
INSERT INTO units (tenant_id, property_id, name, code, type, capacity, pricing_mode, base_price, deposit_amount, status, facilities) VALUES
(@tenant_id, @property_house, 'Main Villa', 'VILLA-001', 'house', 6, 'daily', 1500000.00, 3000000.00, 'available', JSON_ARRAY('3 Bedrooms', '2 Bathrooms', 'Private Pool', 'Ocean View')),
(@tenant_id, @property_kos, 'Room A1', 'KOS-A1', 'room', 1, 'monthly', 1200000.00, 1200000.00, 'available', JSON_ARRAY('Single Bed', 'Wardrobe', 'Desk', 'Private Bathroom')),
(@tenant_id, @property_kos, 'Room A2', 'KOS-A2', 'room', 1, 'monthly', 1000000.00, 1000000.00, 'available', JSON_ARRAY('Single Bed', 'Wardrobe', 'Shared Bathroom')),
(@tenant_id, @property_car, 'Toyota Avanza 2023', 'CAR-001', 'car', 7, 'daily', 350000.00, 500000.00, 'available', JSON_ARRAY('7 Seats', 'Automatic', 'AC', 'Audio System')),
(@tenant_id, @property_car, 'Honda Brio 2023', 'CAR-002', 'car', 5, 'daily', 250000.00, 300000.00, 'available', JSON_ARRAY('5 Seats', 'Manual', 'AC'));

-- Insert sample add-ons
INSERT INTO add_ons (tenant_id, property_id, name, description, price, charge_type, is_active) VALUES
(@tenant_id, @property_house, 'Extra Cleaning Service', 'Professional cleaning service', 200000.00, 'per_booking', TRUE),
(@tenant_id, @property_house, 'BBQ Equipment', 'Complete BBQ grill and utensils', 150000.00, 'per_day', TRUE),
(@tenant_id, @property_car, 'Driver Service', 'Professional driver for 12 hours', 300000.00, 'per_day', TRUE),
(@tenant_id, @property_car, 'GPS Navigation', 'GPS device rental', 50000.00, 'per_day', TRUE),
(@tenant_id, @property_car, 'Baby Car Seat', 'Safety car seat for baby', 75000.00, 'per_booking', TRUE);

-- Insert default settings
INSERT INTO settings (tenant_id, `key`, `value`, description, type) VALUES
(@tenant_id, 'currency', 'IDR', 'Default currency', 'string'),
(@tenant_id, 'timezone', 'Asia/Jakarta', 'Default timezone', 'string'),
(@tenant_id, 'tax_percentage', '10', 'Tax percentage for invoices', 'number'),
(@tenant_id, 'invoice_prefix', 'INV', 'Invoice number prefix', 'string'),
(@tenant_id, 'booking_prefix', 'BK', 'Booking number prefix', 'string'),
(@tenant_id, 'payment_prefix', 'PAY', 'Payment number prefix', 'string'),
(@tenant_id, 'whatsapp_api_url', 'https://api.whatsapp.com/send', 'WhatsApp API URL', 'string'),
(@tenant_id, 'whatsapp_api_token', '', 'WhatsApp API Token', 'string'),
(@tenant_id, 'whatsapp_sender_number', '', 'WhatsApp Sender Number', 'string'),
(@tenant_id, 'company_name', 'Demo Rental Company', 'Company name', 'string'),
(@tenant_id, 'company_address', 'Jl. Sample Address No. 123', 'Company address', 'string'),
(@tenant_id, 'company_phone', '+628123456789', 'Company phone', 'string'),
(@tenant_id, 'company_email', 'info@demorental.com', 'Company email', 'string');

-- ==================================================
-- END OF SEEDS
-- ==================================================
