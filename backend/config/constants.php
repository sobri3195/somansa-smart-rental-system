<?php
/**
 * Application Constants
 */

// API Version
define('API_VERSION', 'v1');

// Response codes
define('HTTP_OK', 200);
define('HTTP_CREATED', 201);
define('HTTP_BAD_REQUEST', 400);
define('HTTP_UNAUTHORIZED', 401);
define('HTTP_FORBIDDEN', 403);
define('HTTP_NOT_FOUND', 404);
define('HTTP_CONFLICT', 409);
define('HTTP_UNPROCESSABLE_ENTITY', 422);
define('HTTP_INTERNAL_SERVER_ERROR', 500);

// Token expiration (in seconds)
define('TOKEN_EXPIRATION', 86400 * 30); // 30 days

// Pagination defaults
define('DEFAULT_PAGE', 1);
define('DEFAULT_PER_PAGE', 20);
define('MAX_PER_PAGE', 100);

// File upload limits
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']);

// Date formats
define('DATE_FORMAT', 'Y-m-d');
define('DATETIME_FORMAT', 'Y-m-d H:i:s');
define('TIME_FORMAT', 'H:i:s');

// Booking status flow
define('BOOKING_STATUS', [
    'draft' => 'Draft',
    'pending_payment' => 'Pending Payment',
    'confirmed' => 'Confirmed',
    'checked_in' => 'Checked In',
    'checked_out' => 'Checked Out',
    'canceled' => 'Canceled',
    'completed' => 'Completed'
]);

// Invoice status
define('INVOICE_STATUS', [
    'unpaid' => 'Unpaid',
    'partial' => 'Partially Paid',
    'paid' => 'Paid',
    'overdue' => 'Overdue',
    'canceled' => 'Canceled'
]);

// Payment status
define('PAYMENT_STATUS', [
    'pending' => 'Pending',
    'success' => 'Success',
    'failed' => 'Failed',
    'refunded' => 'Refunded'
]);

// User roles
define('ROLE_SUPER_ADMIN', 'super_admin');
define('ROLE_OWNER', 'owner');
define('ROLE_STAFF', 'staff');
define('ROLE_CUSTOMER', 'customer');

// Property types
define('PROPERTY_TYPES', [
    'house' => 'House/Villa',
    'kos' => 'Boarding/Kos',
    'car' => 'Car/Vehicle'
]);

// Unit types
define('UNIT_TYPES', [
    'room' => 'Room',
    'house' => 'House',
    'car' => 'Car',
    'other' => 'Other'
]);

// Pricing modes
define('PRICING_MODES', [
    'hourly' => 'Hourly',
    'daily' => 'Daily',
    'weekly' => 'Weekly',
    'monthly' => 'Monthly'
]);

// Timezone
define('DEFAULT_TIMEZONE', 'Asia/Jakarta');
date_default_timezone_set(DEFAULT_TIMEZONE);

// Error messages
define('ERROR_UNAUTHORIZED', 'Unauthorized access');
define('ERROR_FORBIDDEN', 'Access forbidden');
define('ERROR_NOT_FOUND', 'Resource not found');
define('ERROR_VALIDATION', 'Validation failed');
define('ERROR_CONFLICT', 'Resource conflict');
define('ERROR_SERVER', 'Internal server error');

// Success messages
define('SUCCESS_CREATED', 'Resource created successfully');
define('SUCCESS_UPDATED', 'Resource updated successfully');
define('SUCCESS_DELETED', 'Resource deleted successfully');
