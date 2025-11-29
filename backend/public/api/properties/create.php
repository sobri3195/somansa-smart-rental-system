<?php
/**
 * Create Property Endpoint
 * POST /api/properties/create.php
 */

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/constants.php';
require_once __DIR__ . '/../../../src/middleware/auth.php';
require_once __DIR__ . '/../../../src/utils/response.php';
require_once __DIR__ . '/../../../src/utils/validator.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
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

try {
    $tenantId = $user['tenant_id'];
    
    $photos = isset($data['photos']) && is_array($data['photos']) 
        ? json_encode($data['photos']) 
        : null;
    
    $stmt = $db->prepare("
        INSERT INTO properties (
            tenant_id, name, type, address, city, latitude, longitude, 
            description, photos, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    ");
    
    $latitude = $data['latitude'] ?? null;
    $longitude = $data['longitude'] ?? null;
    $description = $data['description'] ?? null;
    
    $stmt->bind_param(
        "issssddss",
        $tenantId,
        $data['name'],
        $data['type'],
        $data['address'],
        $data['city'],
        $latitude,
        $longitude,
        $description,
        $photos
    );
    
    if ($stmt->execute()) {
        $propertyId = $db->insert_id;
        
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
            VALUES (?, ?, 'create', 'property', ?, ?)
        ");
        $logDesc = "Created property: " . $data['name'];
        $logStmt->bind_param("iiis", $tenantId, $user['id'], $propertyId, $logDesc);
        $logStmt->execute();
        
        Response::created($property, 'Property created successfully');
    } else {
        Response::serverError('Failed to create property');
    }
    
} catch (Exception $e) {
    error_log("Error creating property: " . $e->getMessage());
    Response::serverError('Failed to create property');
}
