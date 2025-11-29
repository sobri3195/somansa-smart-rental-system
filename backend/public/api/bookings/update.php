<?php
/**
 * Update Booking Endpoint
 * PUT /api/bookings/update.php?id={id}
 */

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/constants.php';
require_once __DIR__ . '/../../../src/middleware/auth.php';
require_once __DIR__ . '/../../../src/utils/response.php';
require_once __DIR__ . '/../../../src/utils/validator.php';
require_once __DIR__ . '/../../../src/services/BookingService.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    Response::error('Method not allowed', 405);
}

if (!isset($_GET['id'])) {
    Response::error('Booking ID is required', HTTP_BAD_REQUEST);
}

$auth = new AuthMiddleware();
$user = $auth->requireRole([ROLE_SUPER_ADMIN, ROLE_OWNER, ROLE_STAFF]);

$data = json_decode(file_get_contents('php://input'), true);

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
    
    if ($booking['status'] === 'canceled' || $booking['status'] === 'completed') {
        Response::error('Cannot update canceled or completed booking', HTTP_BAD_REQUEST);
    }
    
    $updateFields = [];
    $params = [];
    $types = "";
    
    if (isset($data['start_datetime'])) {
        $updateFields[] = "start_datetime = ?";
        $params[] = $data['start_datetime'];
        $types .= "s";
    }
    
    if (isset($data['end_datetime'])) {
        $updateFields[] = "end_datetime = ?";
        $params[] = $data['end_datetime'];
        $types .= "s";
    }
    
    if (isset($data['notes'])) {
        $updateFields[] = "notes = ?";
        $params[] = $data['notes'];
        $types .= "s";
    }
    
    if (isset($data['start_datetime']) || isset($data['end_datetime'])) {
        $startDatetime = $data['start_datetime'] ?? $booking['start_datetime'];
        $endDatetime = $data['end_datetime'] ?? $booking['end_datetime'];
        
        $bookingService = new BookingService();
        $isAvailable = $bookingService->checkAvailability(
            $booking['unit_id'],
            $startDatetime,
            $endDatetime,
            $bookingId
        );
        
        if (!$isAvailable) {
            Response::conflict('Unit is not available for the selected dates');
        }
        
        $priceCalc = $bookingService->calculatePrice(
            $booking['unit_id'],
            $startDatetime,
            $endDatetime
        );
        
        if ($priceCalc) {
            $updateFields[] = "total_price = ?";
            $params[] = $priceCalc['total_price'];
            $types .= "d";
        }
    }
    
    if (empty($updateFields)) {
        Response::error('No fields to update', HTTP_BAD_REQUEST);
    }
    
    $updateFields[] = "updated_at = NOW()";
    
    $sql = "UPDATE bookings SET " . implode(", ", $updateFields) . " WHERE id = ? AND tenant_id = ?";
    $params[] = $bookingId;
    $params[] = $user['tenant_id'];
    $types .= "ii";
    
    $stmt = $db->prepare($sql);
    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        $stmt = $db->prepare("SELECT * FROM bookings WHERE id = ?");
        $stmt->bind_param("i", $bookingId);
        $stmt->execute();
        $result = $stmt->get_result();
        $updatedBooking = $result->fetch_assoc();
        
        $logStmt = $db->prepare("
            INSERT INTO activity_logs (tenant_id, user_id, action, entity_type, entity_id, description)
            VALUES (?, ?, 'update', 'booking', ?, ?)
        ");
        $logDesc = "Updated booking: " . $booking['booking_number'];
        $logStmt->bind_param("iiis", $user['tenant_id'], $user['id'], $bookingId, $logDesc);
        $logStmt->execute();
        
        Response::success($updatedBooking, 'Booking updated successfully');
    } else {
        Response::serverError('Failed to update booking');
    }
    
} catch (Exception $e) {
    error_log("Error updating booking: " . $e->getMessage());
    Response::serverError('Failed to update booking');
}
