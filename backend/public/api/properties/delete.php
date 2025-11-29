<?php
/**
 * Delete Property Endpoint
 * DELETE /api/properties/delete.php?id={id}
 */

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/constants.php';
require_once __DIR__ . '/../../../src/middleware/auth.php';
require_once __DIR__ . '/../../../src/utils/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    Response::error('Method not allowed', 405);
}

if (!isset($_GET['id'])) {
    Response::error('Property ID is required', HTTP_BAD_REQUEST);
}

$auth = new AuthMiddleware();
$user = $auth->requireRole([ROLE_SUPER_ADMIN, ROLE_OWNER]);

$db = Database::getInstance()->getConnection();
$propertyId = intval($_GET['id']);

try {
    $stmt = $db->prepare("
        SELECT id, name FROM properties WHERE id = ? AND tenant_id = ?
    ");
    $stmt->bind_param("ii", $propertyId, $user['tenant_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        Response::notFound('Property not found');
    }
    
    $property = $result->fetch_assoc();
    
    $stmt = $db->prepare("
        SELECT COUNT(*) as count FROM bookings 
        WHERE property_id = ? AND status NOT IN ('canceled', 'completed')
    ");
    $stmt->bind_param("i", $propertyId);
    $stmt->execute();
    $result = $stmt->get_result();
    $bookingCount = $result->fetch_assoc()['count'];
    
    if ($bookingCount > 0) {
        Response::conflict('Cannot delete property with active bookings');
    }
    
    $stmt = $db->prepare("
        DELETE FROM properties WHERE id = ? AND tenant_id = ?
    ");
    $stmt->bind_param("ii", $propertyId, $user['tenant_id']);
    
    if ($stmt->execute()) {
        $logStmt = $db->prepare("
            INSERT INTO activity_logs (tenant_id, user_id, action, entity_type, entity_id, description)
            VALUES (?, ?, 'delete', 'property', ?, ?)
        ");
        $logDesc = "Deleted property: " . $property['name'];
        $logStmt->bind_param("iiis", $user['tenant_id'], $user['id'], $propertyId, $logDesc);
        $logStmt->execute();
        
        Response::success(null, 'Property deleted successfully');
    } else {
        Response::serverError('Failed to delete property');
    }
    
} catch (Exception $e) {
    error_log("Error deleting property: " . $e->getMessage());
    Response::serverError('Failed to delete property');
}
