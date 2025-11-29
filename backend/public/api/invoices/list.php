<?php
/**
 * List Invoices Endpoint
 * GET /api/invoices/list.php
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
    
    $status = $_GET['status'] ?? null;
    $bookingId = $_GET['booking_id'] ?? null;
    $customerId = $_GET['customer_id'] ?? null;
    
    $whereConditions = [];
    $params = [];
    $types = "";
    
    if ($user['role'] === ROLE_CUSTOMER) {
        $whereConditions[] = "b.customer_id = ?";
        $params[] = $user['id'];
        $types .= "i";
    } elseif ($user['role'] !== ROLE_SUPER_ADMIN) {
        $whereConditions[] = "i.tenant_id = ?";
        $params[] = $user['tenant_id'];
        $types .= "i";
    }
    
    if ($status) {
        $whereConditions[] = "i.status = ?";
        $params[] = $status;
        $types .= "s";
    }
    
    if ($bookingId) {
        $whereConditions[] = "i.booking_id = ?";
        $params[] = $bookingId;
        $types .= "i";
    }
    
    if ($customerId && $user['role'] !== ROLE_CUSTOMER) {
        $whereConditions[] = "b.customer_id = ?";
        $params[] = $customerId;
        $types .= "i";
    }
    
    $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";
    
    $countSql = "
        SELECT COUNT(*) as total 
        FROM invoices i
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
            i.*,
            b.booking_number,
            u.name as customer_name,
            u.email as customer_email,
            (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE invoice_id = i.id AND status = 'success') as paid_amount
        FROM invoices i
        LEFT JOIN bookings b ON i.booking_id = b.id
        LEFT JOIN users u ON b.customer_id = u.id
        $whereClause
        ORDER BY i.created_at DESC
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
    
    $invoices = [];
    while ($row = $result->fetch_assoc()) {
        $row['outstanding_amount'] = $row['total_amount'] - $row['paid_amount'];
        $invoices[] = $row;
    }
    
    Response::paginated($invoices, $page, $perPage, $total);
    
} catch (Exception $e) {
    error_log("Error listing invoices: " . $e->getMessage());
    Response::serverError('Failed to fetch invoices');
}
