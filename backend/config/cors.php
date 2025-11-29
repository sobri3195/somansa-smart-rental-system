<?php
/**
 * CORS Configuration
 * Handle Cross-Origin Resource Sharing for Netlify frontend
 */

// Allowed origins (add your Netlify domain here)
$allowedOrigins = [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Alternative dev port
    'https://somansa.netlify.app', // Production Netlify URL
    getenv('FRONTEND_URL') // From environment variable
];

// Get the origin of the request
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Check if the origin is allowed
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // For development, you might want to allow all origins
    // Comment this out in production
    if (getenv('APP_ENV') === 'development') {
        header("Access-Control-Allow-Origin: *");
    }
}

// Allowed methods
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");

// Allowed headers
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Tenant-ID");

// Allow credentials (cookies, authorization headers)
header("Access-Control-Allow-Credentials: true");

// Cache preflight request for 1 day
header("Access-Control-Max-Age: 86400");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set content type to JSON for all API responses
header("Content-Type: application/json; charset=UTF-8");
