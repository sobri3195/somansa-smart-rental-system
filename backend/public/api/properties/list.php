<?php
/**
 * List Properties Endpoint
 * GET /api/properties/list.php
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
    
    $tenantId = $user['tenant_id'];
    $type = $_GET['type'] ?? null;
    $city = $_GET['city'] ?? null;
    $search = $_GET['search'] ?? null;
    
    $whereConditions = [];
    $params = [];
    $types = "";
    
    if ($user['role'] !== ROLE_SUPER_ADMIN) {
        $whereConditions[] = "tenant_id = ?";
        $params[] = $tenantId;
        $types .= "i";
    }
    
    if ($type) {
        $whereConditions[] = "type = ?";
        $params[] = $type;
        $types .= "s";
    }
    
    if ($city) {
        $whereConditions[] = "city LIKE ?";
        $params[] = "%$city%";
        $types .= "s";
    }
    
    if ($search) {
        $whereConditions[] = "(name LIKE ? OR address LIKE ? OR description LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $types .= "sss";
    }
    
    $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";
    
    $countSql = "SELECT COUNT(*) as total FROM properties $whereClause";
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
            (SELECT COUNT(*) FROM units WHERE property_id = p.id) as unit_count,
            (SELECT COUNT(*) FROM units WHERE property_id = p.id AND status = 'available') as available_units
        FROM properties p
        $whereClause
        ORDER BY p.created_at DESC
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
    
    $properties = [];
    while ($row = $result->fetch_assoc()) {
        if ($row['photos']) {
            $row['photos'] = json_decode($row['photos'], true);
        }
        $properties[] = $row;
    }
    
    Response::paginated($properties, $page, $perPage, $total);
    
} catch (Exception $e) {
    error_log("Error listing properties: " . $e->getMessage());
    Response::serverError('Failed to fetch properties');
}
