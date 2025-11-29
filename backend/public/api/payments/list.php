<?php
/**
 * List Payments Endpoint
 * GET /api/payments/list.php
 */

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/constants.php';
require_once __DIR__ . '/../../../src/middleware/auth.php';
require_once __DIR__ . '/../../../src/utils/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error('Method not allowed', 405);
}

$auth = new AuthMiddleware();
$user = $auth->requireAuth();

$db = Database::getInstance()->getConnection();

try {
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : DEFAULT_PAGE;
    $perPage = isset($_GET['per_page']) ? min(intval($_GET['per_page']), MAX_PER_PAGE) : DEFAULT_PER_PAGE;
    $offset = ($page - 1) * $perPage;
    
    $invoiceId = $_GET['invoice_id'] ?? null;
    $status = $_GET['status'] ?? null;
    $method = $_GET['method'] ?? null;
    
    $whereConditions = [];
    $params = [];
    $types = "";
    
    if ($user['role'] === ROLE_CUSTOMER) {
        $whereConditions[] = "b.customer_id = ?";
        $params[] = $user['id'];
        $types .= "i";
    } elseif ($user['role'] !== ROLE_SUPER_ADMIN) {
        $whereConditions[] = "p.tenant_id = ?";
        $params[] = $user['tenant_id'];
        $types .= "i";
    }
    
    if ($invoiceId) {
        $whereConditions[] = "p.invoice_id = ?";
        $params[] = $invoiceId;
        $types .= "i";
    }
    
    if ($status) {
        $whereConditions[] = "p.status = ?";
        $params[] = $status;
        $types .= "s";
    }
    
    if ($method) {
        $whereConditions[] = "p.method = ?";
        $params[] = $method;
        $types .= "s";
    }
    
    $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";
    
    $countSql = "
        SELECT COUNT(*) as total 
        FROM payments p
        LEFT JOIN invoices i ON p.invoice_id = i.id
        LEFT JOIN bookings b ON i.booking_id = b.id
        $whereClause
    ";
    $stmt = $db->prepare($countSql);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $total = $result->fetch_assoc()['total'];
    
    $sql = "
        SELECT 
            p.*,
            i.invoice_number,
            i.total_amount as invoice_total,
            b.booking_number,
            u.name as customer_name
        FROM payments p
        LEFT JOIN invoices i ON p.invoice_id = i.id
        LEFT JOIN bookings b ON i.booking_id = b.id
        LEFT JOIN users u ON b.customer_id = u.id
        $whereClause
        ORDER BY p.paid_at DESC
        LIMIT ? OFFSET ?
    ";
    
    $params[] = $perPage;
    $params[] = $offset;
    $types .= "ii";
    
    $stmt = $db->prepare($sql);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    
    $payments = [];
    while ($row = $result->fetch_assoc()) {
        $payments[] = $row;
    }
    
    Response::paginated($payments, $page, $perPage, $total);
    
} catch (Exception $e) {
    error_log("Error listing payments: " . $e->getMessage());
    Response::serverError('Failed to fetch payments');
}
