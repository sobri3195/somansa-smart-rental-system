<?php
/**
 * Check Booking Availability Endpoint
 * GET /api/bookings/availability.php
 */

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/constants.php';
require_once __DIR__ . '/../../../src/utils/response.php';
require_once __DIR__ . '/../../../src/services/BookingService.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error('Method not allowed', 405);
}

if (!isset($_GET['unit_id']) || !isset($_GET['start']) || !isset($_GET['end'])) {
    Response::error('Missing required parameters: unit_id, start, end', HTTP_BAD_REQUEST);
}

$unitId = intval($_GET['unit_id']);
$startDatetime = $_GET['start'];
$endDatetime = $_GET['end'];
$excludeBookingId = isset($_GET['exclude_booking_id']) ? intval($_GET['exclude_booking_id']) : null;

try {
    $bookingService = new BookingService();
    $isAvailable = $bookingService->checkAvailability(
        $unitId,
        $startDatetime,
        $endDatetime,
        $excludeBookingId
    );
    
    Response::success([
        'available' => $isAvailable,
        'unit_id' => $unitId,
        'start_datetime' => $startDatetime,
        'end_datetime' => $endDatetime
    ]);
    
} catch (Exception $e) {
    error_log("Error checking availability: " . $e->getMessage());
    Response::serverError('Failed to check availability');
}
