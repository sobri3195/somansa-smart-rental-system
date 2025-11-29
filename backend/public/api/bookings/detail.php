<?php
/**
 * Get Booking Detail Endpoint
 * GET /api/bookings/detail.php?id={id}
 */

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/constants.php';
require_once __DIR__ . '/../../../src/middleware/auth.php';
require_once __DIR__ . '/../../../src/utils/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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
    $sql = "
        SELECT 
            b.*,
            p.name as property_name,
            p.type as property_type,
            p.address as property_address,
            u.name as unit_name,
            u.type as unit_type,
            u.pricing_mode,
            c.name as customer_name,
            c.email as customer_email,
            c.phone as customer_phone
        FROM bookings b
        LEFT JOIN properties p ON b.property_id = p.id
        LEFT JOIN units u ON b.unit_id = u.id
        LEFT JOIN users c ON b.customer_id = c.id
        WHERE b.id = ?
    ";
    
    if ($user['role'] === ROLE_CUSTOMER) {
        $sql .= " AND b.customer_id = ?";
    } elseif ($user['role'] !== ROLE_SUPER_ADMIN) {
        $sql .= " AND b.tenant_id = ?";
    }
    
    $stmt = $db->prepare($sql);
    
    if ($user['role'] === ROLE_CUSTOMER) {
        $stmt->bind_param("ii", $bookingId, $user['id']);
    } elseif ($user['role'] !== ROLE_SUPER_ADMIN) {
        $stmt->bind_param("ii", $bookingId, $user['tenant_id']);
    } else {
        $stmt->bind_param("i", $bookingId);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        Response::notFound('Booking not found');
    }
    
    $booking = $result->fetch_assoc();
    
    $stmt = $db->prepare("
        SELECT ba.*, ao.name, ao.description, ao.charge_type
        FROM booking_add_ons ba
        LEFT JOIN add_ons ao ON ba.add_on_id = ao.id
        WHERE ba.booking_id = ?
    ");
    $stmt->bind_param("i", $bookingId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $addOns = [];
    while ($row = $result->fetch_assoc()) {
        $addOns[] = $row;
    }
    $booking['add_ons'] = $addOns;
    
    $stmt = $db->prepare("
        SELECT i.id, i.invoice_number, i.total_amount, i.status, i.due_date,
               (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE invoice_id = i.id AND status = 'success') as paid_amount
        FROM invoices i
        WHERE i.booking_id = ?
        ORDER BY i.created_at DESC
    ");
    $stmt->bind_param("i", $bookingId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $invoices = [];
    while ($row = $result->fetch_assoc()) {
        $row['outstanding_amount'] = $row['total_amount'] - $row['paid_amount'];
        $invoices[] = $row;
    }
    $booking['invoices'] = $invoices;
    
    Response::success(['booking' => $booking]);
    
} catch (Exception $e) {
    error_log("Error fetching booking: " . $e->getMessage());
    Response::serverError('Failed to fetch booking');
}
