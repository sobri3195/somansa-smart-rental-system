<?php
/**
 * Update Property Endpoint
 * PUT /api/properties/update.php?id={id}
 */

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/constants.php';
require_once __DIR__ . '/../../../src/middleware/auth.php';
require_once __DIR__ . '/../../../src/utils/response.php';
require_once __DIR__ . '/../../../src/utils/validator.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    Response::error('Method not allowed', 405);
}

if (!isset($_GET['id'])) {
    Response::error('Property ID is required', HTTP_BAD_REQUEST);
}

$auth = new AuthMiddleware();
$user = $auth->requireRole([ROLE_SUPER_ADMIN, ROLE_OWNER, ROLE_STAFF]);

$data = json_decode(file_get_contents('php://input'), true);

$validator = Validator::make($data)
    ->required('name')
    ->required('type')
    ->in('type', array_keys(PROPERTY_TYPES))
    ->required('address')
    ->required('city');

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

$db = Database::getInstance()->getConnection();
$propertyId = intval($_GET['id']);

try {
    $stmt = $db->prepare("
        SELECT id FROM properties WHERE id = ? AND tenant_id = ?
    ");
    $stmt->bind_param("ii", $propertyId, $user['tenant_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        Response::notFound('Property not found');
    }
    
    $photos = isset($data['photos']) && is_array($data['photos']) 
        ? json_encode($data['photos']) 
        : null;
    
    $stmt = $db->prepare("
        UPDATE properties 
        SET name = ?, type = ?, address = ?, city = ?, latitude = ?, 
            longitude = ?, description = ?, photos = ?, updated_at = NOW()
        WHERE id = ? AND tenant_id = ?
    ");
    
    $latitude = $data['latitude'] ?? null;
    $longitude = $data['longitude'] ?? null;
    $description = $data['description'] ?? null;
    
    $stmt->bind_param(
        "ssssddssi",
        $data['name'],
        $data['type'],
        $data['address'],
        $data['city'],
        $latitude,
        $longitude,
        $description,
        $photos,
        $propertyId,
        $user['tenant_id']
    );
    
    if ($stmt->execute()) {
        $stmt = $db->prepare("
            SELECT * FROM properties WHERE id = ?
        ");
        $stmt->bind_param("i", $propertyId);
        $stmt->execute();
        $result = $stmt->get_result();
        $property = $result->fetch_assoc();
        
        if ($property['photos']) {
            $property['photos'] = json_decode($property['photos'], true);
        }
        
        $logStmt = $db->prepare("
            INSERT INTO activity_logs (tenant_id, user_id, action, entity_type, entity_id, description)
            VALUES (?, ?, 'update', 'property', ?, ?)
        ");
        $logDesc = "Updated property: " . $data['name'];
        $logStmt->bind_param("iiis", $user['tenant_id'], $user['id'], $propertyId, $logDesc);
        $logStmt->execute();
        
        Response::success($property, 'Property updated successfully');
    } else {
        Response::serverError('Failed to update property');
    }
    
} catch (Exception $e) {
    error_log("Error updating property: " . $e->getMessage());
    Response::serverError('Failed to update property');
}
