<?php
/**
 * Get Property Detail Endpoint
 * GET /api/properties/detail.php?id={id}
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
    Response::error('Property ID is required', HTTP_BAD_REQUEST);
}

$auth = new AuthMiddleware();
$user = $auth->getCurrentUser();

$db = Database::getInstance()->getConnection();
$propertyId = intval($_GET['id']);

try {
    $sql = "
        SELECT 
            p.*,
            (SELECT COUNT(*) FROM units WHERE property_id = p.id) as unit_count,
            (SELECT COUNT(*) FROM units WHERE property_id = p.id AND status = 'available') as available_units
        FROM properties p
        WHERE p.id = ?
    ";
    
    if ($user && $user['role'] !== ROLE_SUPER_ADMIN && $user['role'] !== ROLE_CUSTOMER) {
        $sql .= " AND p.tenant_id = ?";
    }
    
    $stmt = $db->prepare($sql);
    
    if ($user && $user['role'] !== ROLE_SUPER_ADMIN && $user['role'] !== ROLE_CUSTOMER) {
        $stmt->bind_param("ii", $propertyId, $user['tenant_id']);
    } else {
        $stmt->bind_param("i", $propertyId);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        Response::notFound('Property not found');
    }
    
    $property = $result->fetch_assoc();
    
    if ($property['photos']) {
        $property['photos'] = json_decode($property['photos'], true);
    }
    
    $stmt = $db->prepare("
        SELECT id, name, code, type, capacity, pricing_mode, base_price, 
               deposit_amount, status, facilities
        FROM units
        WHERE property_id = ?
        ORDER BY name ASC
    ");
    $stmt->bind_param("i", $propertyId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $units = [];
    while ($row = $result->fetch_assoc()) {
        if ($row['facilities']) {
            $row['facilities'] = json_decode($row['facilities'], true);
        }
        $units[] = $row;
    }
    
    $property['units'] = $units;
    
    Response::success(['property' => $property]);
    
} catch (Exception $e) {
    error_log("Error fetching property: " . $e->getMessage());
    Response::serverError('Failed to fetch property');
}
