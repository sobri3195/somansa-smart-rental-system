<?php
/**
 * List Reviews Endpoint
 * GET /api/reviews/list.php
 */

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/constants.php';
require_once __DIR__ . '/../../../src/utils/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error('Method not allowed', 405);
}

$db = Database::getInstance()->getConnection();

try {
    $where = ["r.is_approved = TRUE"];
    $params = [];
    $types = "";
    
    // Filter by property
    if (isset($_GET['property_id'])) {
        $where[] = "r.property_id = ?";
        $params[] = intval($_GET['property_id']);
        $types .= "i";
    }
    
    // Filter by unit
    if (isset($_GET['unit_id'])) {
        $where[] = "r.unit_id = ?";
        $params[] = intval($_GET['unit_id']);
        $types .= "i";
    }
    
    // Filter by rating
    if (isset($_GET['rating'])) {
        $where[] = "r.rating = ?";
        $params[] = intval($_GET['rating']);
        $types .= "i";
    }
    
    // Pagination
    $page = isset($_GET['page']) ? intval($_GET['page']) : DEFAULT_PAGE;
    $perPage = isset($_GET['per_page']) ? min(intval($_GET['per_page']), MAX_PER_PAGE) : DEFAULT_PER_PAGE;
    $offset = ($page - 1) * $perPage;
    
    $whereClause = implode(' AND ', $where);
    
    // Get total count
    $countSql = "
        SELECT COUNT(*) as total
        FROM reviews r
        WHERE $whereClause
    ";
    
    $countStmt = $db->prepare($countSql);
    if ($types) {
        $countStmt->bind_param($types, ...$params);
    }
    $countStmt->execute();
    $countResult = $countStmt->get_result();
    $total = $countResult->fetch_assoc()['total'];
    
    // Get reviews
    $sql = "
        SELECT 
            r.*,
            u.name as customer_name,
            p.name as property_name,
            un.name as unit_name
        FROM reviews r
        LEFT JOIN users u ON r.customer_id = u.id
        LEFT JOIN properties p ON r.property_id = p.id
        LEFT JOIN units un ON r.unit_id = un.id
        WHERE $whereClause
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
    ";
    
    $stmt = $db->prepare($sql);
    $params[] = $perPage;
    $params[] = $offset;
    $types .= "ii";
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $reviews = [];
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }
    
    Response::paginated($reviews, $page, $perPage, $total);
    
} catch (Exception $e) {
    error_log("Error fetching reviews: " . $e->getMessage());
    Response::serverError('Failed to fetch reviews');
}
