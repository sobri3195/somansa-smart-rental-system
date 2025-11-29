<?php
/**
 * List Bookings Endpoint
 * GET /api/bookings
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
    // Build query based on filters
    $sql = "
        SELECT 
            b.*,
            u.name as unit_name,
            u.code as unit_code,
            p.name as property_name,
            p.type as property_type,
            c.name as customer_name,
            c.email as customer_email
        FROM bookings b
        JOIN units u ON b.unit_id = u.id
        JOIN properties p ON b.property_id = p.id
        JOIN users c ON b.customer_id = c.id
        WHERE 1=1
    ";
    
    $params = [];
    $types = "";
    
    // Filter by tenant
    if ($user['role'] !== 'super_admin') {
        $sql .= " AND b.tenant_id = ?";
        $params[] = $user['tenant_id'];
        $types .= "i";
    } elseif (isset($_GET['tenant_id'])) {
        $sql .= " AND b.tenant_id = ?";
        $params[] = $_GET['tenant_id'];
        $types .= "i";
    }
    
    // Filter by customer (if customer role)
    if ($user['role'] === 'customer') {
        $sql .= " AND b.customer_id = ?";
        $params[] = $user['id'];
        $types .= "i";
    }
    
    // Filter by property
    if (isset($_GET['property_id'])) {
        $sql .= " AND b.property_id = ?";
        $params[] = $_GET['property_id'];
        $types .= "i";
    }
    
    // Filter by unit
    if (isset($_GET['unit_id'])) {
        $sql .= " AND b.unit_id = ?";
        $params[] = $_GET['unit_id'];
        $types .= "i";
    }
    
    // Filter by status
    if (isset($_GET['status'])) {
        $sql .= " AND b.status = ?";
        $params[] = $_GET['status'];
        $types .= "s";
    }
    
    // Filter by date range
    if (isset($_GET['start_date'])) {
        $sql .= " AND b.start_datetime >= ?";
        $params[] = $_GET['start_date'] . ' 00:00:00';
        $types .= "s";
    }
    
    if (isset($_GET['end_date'])) {
        $sql .= " AND b.end_datetime <= ?";
        $params[] = $_GET['end_date'] . ' 23:59:59';
        $types .= "s";
    }
    
    // Search by booking number or customer name
    if (isset($_GET['search'])) {
        $sql .= " AND (b.booking_number LIKE ? OR c.name LIKE ?)";
        $searchTerm = '%' . $_GET['search'] . '%';
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $types .= "ss";
    }
    
    // Count total records
    $countSql = "SELECT COUNT(*) as total FROM ($sql) as count_query";
    
    if (!empty($params)) {
        $countStmt = $db->prepare($countSql);
        $countStmt->bind_param($types, ...$params);
        $countStmt->execute();
        $countResult = $countStmt->get_result();
        $total = $countResult->fetch_assoc()['total'];
    } else {
        $countResult = $db->query($countSql);
        $total = $countResult->fetch_assoc()['total'];
    }
    
    // Pagination
    $page = isset($_GET['page']) ? (int)$_GET['page'] : DEFAULT_PAGE;
    $perPage = isset($_GET['per_page']) ? min((int)$_GET['per_page'], MAX_PER_PAGE) : DEFAULT_PER_PAGE;
    $offset = ($page - 1) * $perPage;
    
    // Order by
    $orderBy = $_GET['order_by'] ?? 'created_at';
    $orderDir = $_GET['order_dir'] ?? 'DESC';
    $allowedOrderBy = ['created_at', 'start_datetime', 'end_datetime', 'total_price', 'status'];
    
    if (!in_array($orderBy, $allowedOrderBy)) {
        $orderBy = 'created_at';
    }
    
    if (!in_array(strtoupper($orderDir), ['ASC', 'DESC'])) {
        $orderDir = 'DESC';
    }
    
    $sql .= " ORDER BY b.$orderBy $orderDir LIMIT ? OFFSET ?";
    $params[] = $perPage;
    $params[] = $offset;
    $types .= "ii";
    
    // Execute query
    $stmt = $db->prepare($sql);
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
    
    Response::paginated($bookings, $page, $perPage, $total);
    
} catch (Exception $e) {
    error_log("List bookings error: " . $e->getMessage());
    Response::serverError('Failed to fetch bookings');
}
