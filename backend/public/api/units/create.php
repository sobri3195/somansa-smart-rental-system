<?php
/**
 * Create Unit Endpoint
 * POST /api/units/create.php
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
    ->required('property_id')
    ->required('name')
    ->required('type')
    ->in('type', array_keys(UNIT_TYPES))
    ->required('pricing_mode')
    ->in('pricing_mode', array_keys(PRICING_MODES))
    ->required('base_price')
    ->numeric('base_price');

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

$db = Database::getInstance()->getConnection();

try {
    $stmt = $db->prepare("
        SELECT id FROM properties WHERE id = ? AND tenant_id = ?
    ");
    $stmt->bind_param("ii", $data['property_id'], $user['tenant_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        Response::notFound('Property not found');
    }
    
    $facilities = isset($data['facilities']) && is_array($data['facilities']) 
        ? json_encode($data['facilities']) 
        : null;
    
    $stmt = $db->prepare("
        INSERT INTO units (
            tenant_id, property_id, name, code, type, capacity, 
            pricing_mode, base_price, deposit_amount, status, facilities, 
            created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    ");
    
    $code = $data['code'] ?? null;
    $capacity = $data['capacity'] ?? null;
    $depositAmount = $data['deposit_amount'] ?? 0;
    $status = $data['status'] ?? 'available';
    
    $stmt->bind_param(
        "iisssissdss",
        $user['tenant_id'],
        $data['property_id'],
        $data['name'],
        $code,
        $data['type'],
        $capacity,
        $data['pricing_mode'],
        $data['base_price'],
        $depositAmount,
        $status,
        $facilities
    );
    
    if ($stmt->execute()) {
        $unitId = $db->insert_id;
        
        $stmt = $db->prepare("
            SELECT u.*, p.name as property_name 
            FROM units u
            LEFT JOIN properties p ON u.property_id = p.id
            WHERE u.id = ?
        ");
        $stmt->bind_param("i", $unitId);
        $stmt->execute();
        $result = $stmt->get_result();
        $unit = $result->fetch_assoc();
        
        if ($unit['facilities']) {
            $unit['facilities'] = json_decode($unit['facilities'], true);
        }
        
        $logStmt = $db->prepare("
            INSERT INTO activity_logs (tenant_id, user_id, action, entity_type, entity_id, description)
            VALUES (?, ?, 'create', 'unit', ?, ?)
        ");
        $logDesc = "Created unit: " . $data['name'];
        $logStmt->bind_param("iiis", $user['tenant_id'], $user['id'], $unitId, $logDesc);
        $logStmt->execute();
        
        Response::created($unit, 'Unit created successfully');
    } else {
        Response::serverError('Failed to create unit');
    }
    
} catch (Exception $e) {
    error_log("Error creating unit: " . $e->getMessage());
    Response::serverError('Failed to create unit');
}
