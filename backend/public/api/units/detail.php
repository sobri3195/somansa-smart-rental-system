<?php
/**
 * Get Unit Detail Endpoint
 * GET /api/units/detail.php?id={id}
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
    Response::error('Unit ID is required', HTTP_BAD_REQUEST);
}

$auth = new AuthMiddleware();
$user = $auth->getCurrentUser();

$db = Database::getInstance()->getConnection();
$unitId = intval($_GET['id']);

try {
    $sql = "
        SELECT 
            u.*,
            p.name as property_name,
            p.type as property_type,
            p.address as property_address,
            p.city as property_city
        FROM units u
        LEFT JOIN properties p ON u.property_id = p.id
        WHERE u.id = ?
    ";
    
    if ($user && $user['role'] !== ROLE_SUPER_ADMIN && $user['role'] !== ROLE_CUSTOMER) {
        $sql .= " AND u.tenant_id = ?";
    }
    
    $stmt = $db->prepare($sql);
    
    if ($user && $user['role'] !== ROLE_SUPER_ADMIN && $user['role'] !== ROLE_CUSTOMER) {
        $stmt->bind_param("ii", $unitId, $user['tenant_id']);
    } else {
        $stmt->bind_param("i", $unitId);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        Response::notFound('Unit not found');
    }
    
    $unit = $result->fetch_assoc();
    
    if ($unit['facilities']) {
        $unit['facilities'] = json_decode($unit['facilities'], true);
    }
    
    Response::success(['unit' => $unit]);
    
} catch (Exception $e) {
    error_log("Error fetching unit: " . $e->getMessage());
    Response::serverError('Failed to fetch unit');
}
