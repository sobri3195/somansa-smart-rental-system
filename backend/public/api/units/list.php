<?php
/**
 * List Units Endpoint
 * GET /api/units/list.php
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
$user = $auth->getCurrentUser();

$db = Database::getInstance()->getConnection();

try {
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : DEFAULT_PAGE;
    $perPage = isset($_GET['per_page']) ? min(intval($_GET['per_page']), MAX_PER_PAGE) : DEFAULT_PER_PAGE;
    $offset = ($page - 1) * $perPage;
    
    $propertyId = $_GET['property_id'] ?? null;
    $type = $_GET['type'] ?? null;
    $status = $_GET['status'] ?? null;
    $pricingMode = $_GET['pricing_mode'] ?? null;
    
    $whereConditions = [];
    $params = [];
    $types = "";
    
    if ($user && $user['role'] !== ROLE_SUPER_ADMIN && $user['role'] !== ROLE_CUSTOMER) {
        $whereConditions[] = "u.tenant_id = ?";
        $params[] = $user['tenant_id'];
        $types .= "i";
    }
    
    if ($propertyId) {
        $whereConditions[] = "u.property_id = ?";
        $params[] = $propertyId;
        $types .= "i";
    }
    
    if ($type) {
        $whereConditions[] = "u.type = ?";
        $params[] = $type;
        $types .= "s";
    }
    
    if ($status) {
        $whereConditions[] = "u.status = ?";
        $params[] = $status;
        $types .= "s";
    }
    
    if ($pricingMode) {
        $whereConditions[] = "u.pricing_mode = ?";
        $params[] = $pricingMode;
        $types .= "s";
    }
    
    $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";
    
    $countSql = "SELECT COUNT(*) as total FROM units u $whereClause";
    $stmt = $db->prepare($countSql);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $total = $result->fetch_assoc()['total'];
    
    $sql = "
        SELECT 
            u.*,
            p.name as property_name,
            p.type as property_type,
            (SELECT COUNT(*) FROM bookings WHERE unit_id = u.id AND status NOT IN ('canceled', 'completed')) as active_bookings
        FROM units u
        LEFT JOIN properties p ON u.property_id = p.id
        $whereClause
        ORDER BY p.name ASC, u.name ASC
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
    
    $units = [];
    while ($row = $result->fetch_assoc()) {
        if ($row['facilities']) {
            $row['facilities'] = json_decode($row['facilities'], true);
        }
        $units[] = $row;
    }
    
    Response::paginated($units, $page, $perPage, $total);
    
} catch (Exception $e) {
    error_log("Error listing units: " . $e->getMessage());
    Response::serverError('Failed to fetch units');
}
