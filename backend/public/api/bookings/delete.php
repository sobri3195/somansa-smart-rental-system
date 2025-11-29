<?php
/**
 * Cancel/Delete Booking Endpoint
 * DELETE /api/bookings/delete.php?id={id}
 */

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/constants.php';
require_once __DIR__ . '/../../../src/middleware/auth.php';
require_once __DIR__ . '/../../../src/utils/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    Response::error('Method not allowed', 405);
}

if (!isset($_GET['id'])) {
    Response::error('Booking ID is required', HTTP_BAD_REQUEST);
}

$auth = new AuthMiddleware();
$user = $auth->requireAuth();

$db = Database::getInstance()->getConnection();
$bookingId = intval($_GET['id']);

try {
    $stmt = $db->prepare("
        SELECT * FROM bookings WHERE id = ?
    ");
    $stmt->bind_param("i", $bookingId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        Response::notFound('Booking not found');
    }
    
    $booking = $result->fetch_assoc();
    
    if ($user['role'] === ROLE_CUSTOMER && $booking['customer_id'] != $user['id']) {
        Response::forbidden('You can only cancel your own bookings');
    }
    
    if ($user['role'] !== ROLE_SUPER_ADMIN && $user['role'] !== ROLE_CUSTOMER) {
        if ($booking['tenant_id'] != $user['tenant_id']) {
            Response::forbidden('Access denied');
        }
    }
    
    if ($booking['status'] === 'canceled' || $booking['status'] === 'completed') {
        Response::error('Booking is already ' . $booking['status'], HTTP_BAD_REQUEST);
    }
    
    if ($booking['status'] === 'checked_in' && $user['role'] === ROLE_CUSTOMER) {
        Response::error('Cannot cancel booking that is already checked in', HTTP_BAD_REQUEST);
    }
    
    $stmt = $db->prepare("
        UPDATE bookings 
        SET status = 'canceled', updated_at = NOW()
        WHERE id = ?
    ");
    $stmt->bind_param("i", $bookingId);
    
    if ($stmt->execute()) {
        $logStmt = $db->prepare("
            INSERT INTO activity_logs (tenant_id, user_id, action, entity_type, entity_id, description)
            VALUES (?, ?, 'cancel', 'booking', ?, ?)
        ");
        $logDesc = "Canceled booking: " . $booking['booking_number'];
        $logStmt->bind_param("iiis", $booking['tenant_id'], $user['id'], $bookingId, $logDesc);
        $logStmt->execute();
        
        Response::success(null, 'Booking canceled successfully');
    } else {
        Response::serverError('Failed to cancel booking');
    }
    
} catch (Exception $e) {
    error_log("Error canceling booking: " . $e->getMessage());
    Response::serverError('Failed to cancel booking');
}
