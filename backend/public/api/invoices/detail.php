<?php
/**
 * Get Invoice Detail Endpoint
 * GET /api/invoices/detail.php?id={id}
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
    Response::error('Invoice ID is required', HTTP_BAD_REQUEST);
}

$auth = new AuthMiddleware();
$user = $auth->requireAuth();

$db = Database::getInstance()->getConnection();
$invoiceId = intval($_GET['id']);

try {
    $sql = "
        SELECT 
            i.*,
            b.booking_number,
            b.start_datetime,
            b.end_datetime,
            u.name as customer_name,
            u.email as customer_email,
            u.phone as customer_phone,
            p.name as property_name,
            un.name as unit_name
        FROM invoices i
        LEFT JOIN bookings b ON i.booking_id = b.id
        LEFT JOIN users u ON b.customer_id = u.id
        LEFT JOIN units un ON b.unit_id = un.id
        LEFT JOIN properties p ON b.property_id = p.id
        WHERE i.id = ?
    ";
    
    if ($user['role'] === ROLE_CUSTOMER) {
        $sql .= " AND b.customer_id = ?";
    } elseif ($user['role'] !== ROLE_SUPER_ADMIN) {
        $sql .= " AND i.tenant_id = ?";
    }
    
    $stmt = $db->prepare($sql);
    
    if ($user['role'] === ROLE_CUSTOMER) {
        $stmt->bind_param("ii", $invoiceId, $user['id']);
    } elseif ($user['role'] !== ROLE_SUPER_ADMIN) {
        $stmt->bind_param("ii", $invoiceId, $user['tenant_id']);
    } else {
        $stmt->bind_param("i", $invoiceId);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        Response::notFound('Invoice not found');
    }
    
    $invoice = $result->fetch_assoc();
    
    $stmt = $db->prepare("
        SELECT id, amount, method, transaction_reference, paid_at, status
        FROM payments
        WHERE invoice_id = ?
        ORDER BY paid_at DESC
    ");
    $stmt->bind_param("i", $invoiceId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $payments = [];
    $totalPaid = 0;
    while ($row = $result->fetch_assoc()) {
        if ($row['status'] === 'success') {
            $totalPaid += $row['amount'];
        }
        $payments[] = $row;
    }
    
    $invoice['payments'] = $payments;
    $invoice['paid_amount'] = $totalPaid;
    $invoice['outstanding_amount'] = $invoice['total_amount'] - $totalPaid;
    
    Response::success(['invoice' => $invoice]);
    
} catch (Exception $e) {
    error_log("Error fetching invoice: " . $e->getMessage());
    Response::serverError('Failed to fetch invoice');
}
