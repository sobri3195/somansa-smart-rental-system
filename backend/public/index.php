<?php
/**
 * Somansa Rental System API
 * Backend entry point
 */

require_once __DIR__ . '/../config/cors.php';

header('Content-Type: application/json');

echo json_encode([
    'name' => 'Somansa Rental System API',
    'version' => '1.0.0',
    'status' => 'active',
    'documentation' => '/api/docs',
    'endpoints' => [
        'auth' => [
            'POST /api/auth/register' => 'Register new user',
            'POST /api/auth/login' => 'User login',
            'GET /api/auth/me' => 'Get current user',
        ],
        'bookings' => [
            'GET /api/bookings/list.php' => 'List all bookings',
            'POST /api/bookings/create.php' => 'Create new booking',
            'GET /api/bookings/detail.php?id={id}' => 'Get booking details',
        ],
        'calendar' => [
            'GET /api/calendar.php' => 'Get calendar data',
        ]
    ]
]);
