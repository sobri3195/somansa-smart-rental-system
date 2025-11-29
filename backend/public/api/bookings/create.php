<?php
/**
 * Create Booking Endpoint
 * POST /api/bookings
 */

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/constants.php';
require_once __DIR__ . '/../../../src/middleware/auth.php';
require_once __DIR__ . '/../../../src/services/BookingService.php';
require_once __DIR__ . '/../../../src/utils/response.php';
require_once __DIR__ . '/../../../src/utils/validator.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

$auth = new AuthMiddleware();
$user = $auth->requireAuth();

$data = json_decode(file_get_contents('php://input'), true);

// Validate input
$validator = Validator::make($data)
    ->required('property_id')
    ->required('unit_id')
    ->required('start_datetime')
    ->required('end_datetime')
    ->datetime('start_datetime')
    ->datetime('end_datetime');

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

// Validate dates
$start = new DateTime($data['start_datetime']);
$end = new DateTime($data['end_datetime']);

if ($end <= $start) {
    Response::error('End datetime must be after start datetime');
}

$db = Database::getInstance()->getConnection();

try {
    // Get property and unit to verify tenant
    $stmt = $db->prepare("
        SELECT p.tenant_id, p.id as property_id, u.id as unit_id, u.status
        FROM properties p
        JOIN units u ON p.id = u.property_id
        WHERE p.id = ? AND u.id = ?
    ");
    
    $stmt->bind_param("ii", $data['property_id'], $data['unit_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        Response::notFound('Property or unit not found');
    }
    
    $propertyUnit = $result->fetch_assoc();
    
    // Check tenant access
    $auth->checkTenantAccess($user, $propertyUnit['tenant_id']);
    
    // Check unit status
    if ($propertyUnit['status'] !== 'available') {
        Response::error('Unit is not available');
    }
    
    // Set tenant_id and customer_id
    $data['tenant_id'] = $propertyUnit['tenant_id'];
    
    // If user is customer, they can only book for themselves
    if ($user['role'] === 'customer') {
        $data['customer_id'] = $user['id'];
        $data['booking_source'] = 'online';
    } else {
        // Staff/Owner can book for any customer
        if (!isset($data['customer_id'])) {
            Response::error('customer_id is required');
        }
        $data['booking_source'] = $data['booking_source'] ?? 'offline';
    }
    
    // Create booking
    $bookingService = new BookingService();
    $booking = $bookingService->createBooking($data);
    
    // Log activity
    $stmt = $db->prepare("
        INSERT INTO activity_logs (tenant_id, user_id, action, entity_type, entity_id, description)
        VALUES (?, ?, 'create', 'booking', ?, ?)
    ");
    
    $description = "Created booking {$booking['booking_number']}";
    $stmt->bind_param(
        "iiis",
        $data['tenant_id'],
        $user['id'],
        $booking['id'],
        $description
    );
    $stmt->execute();
    
    Response::created($booking, 'Booking created successfully');
    
} catch (Exception $e) {
    error_log("Create booking error: " . $e->getMessage());
    
    if (strpos($e->getMessage(), 'not available') !== false) {
        Response::conflict($e->getMessage());
    }
    
    Response::serverError($e->getMessage());
}
