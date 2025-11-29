<?php
/**
 * Update Booking Status Endpoint
 * PATCH /api/bookings/update-status.php?id={id}
 */

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/constants.php';
require_once __DIR__ . '/../../../src/middleware/auth.php';
require_once __DIR__ . '/../../../src/utils/response.php';
require_once __DIR__ . '/../../../src/utils/validator.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

if (!isset($_GET['id'])) {
    Response::error('Booking ID is required', HTTP_BAD_REQUEST);
}

$auth = new AuthMiddleware();
$user = $auth->requireRole([ROLE_SUPER_ADMIN, ROLE_OWNER, ROLE_STAFF]);

$data = json_decode(file_get_contents('php://input'), true);

$validator = Validator::make($data)
    ->required('status')
    ->in('status', array_keys(BOOKING_STATUS));

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

$db = Database::getInstance()->getConnection();
$bookingId = intval($_GET['id']);

try {
    $stmt = $db->prepare("
        SELECT * FROM bookings WHERE id = ? AND tenant_id = ?
    ");
    $stmt->bind_param("ii", $bookingId, $user['tenant_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        Response::notFound('Booking not found');
    }
    
    $booking = $result->fetch_assoc();
    $oldStatus = $booking['status'];
    $newStatus = $data['status'];
    
    $statusTransitions = [
        'draft' => ['pending_payment', 'canceled'],
        'pending_payment' => ['confirmed', 'canceled'],
        'confirmed' => ['checked_in', 'canceled'],
        'checked_in' => ['checked_out'],
        'checked_out' => ['completed'],
        'canceled' => [],
        'completed' => []
    ];
    
    if (!in_array($newStatus, $statusTransitions[$oldStatus])) {
        Response::error("Cannot transition from $oldStatus to $newStatus", HTTP_BAD_REQUEST);
    }
    
    $stmt = $db->prepare("
        UPDATE bookings 
        SET status = ?, updated_at = NOW()
        WHERE id = ? AND tenant_id = ?
    ");
    $stmt->bind_param("sii", $newStatus, $bookingId, $user['tenant_id']);
    
    if ($stmt->execute()) {
        $logStmt = $db->prepare("
            INSERT INTO activity_logs (tenant_id, user_id, action, entity_type, entity_id, description)
            VALUES (?, ?, 'status_change', 'booking', ?, ?)
        ");
        $logDesc = "Changed booking status from $oldStatus to $newStatus";
        $logStmt->bind_param("iiis", $user['tenant_id'], $user['id'], $bookingId, $logDesc);
        $logStmt->execute();
        
        $stmt = $db->prepare("SELECT * FROM bookings WHERE id = ?");
        $stmt->bind_param("i", $bookingId);
        $stmt->execute();
        $result = $stmt->get_result();
        $updatedBooking = $result->fetch_assoc();
        
        Response::success($updatedBooking, 'Booking status updated successfully');
    } else {
        Response::serverError('Failed to update booking status');
    }
    
} catch (Exception $e) {
    error_log("Error updating booking status: " . $e->getMessage());
    Response::serverError('Failed to update booking status');
}
