<?php
/**
 * List Photos Endpoint
 * GET /api/photos/list.php
 */

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/constants.php';
require_once __DIR__ . '/../../../src/utils/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error('Method not allowed', 405);
}

$entityType = $_GET['entity_type'] ?? null;
$entityId = isset($_GET['entity_id']) ? intval($_GET['entity_id']) : null;

if (!$entityType || !$entityId) {
    Response::error('entity_type and entity_id are required', HTTP_BAD_REQUEST);
}

$db = Database::getInstance()->getConnection();

try {
    $stmt = $db->prepare("
        SELECT 
            p.*,
            u.name as uploaded_by_name
        FROM photos p
        LEFT JOIN users u ON p.uploaded_by = u.id
        WHERE p.entity_type = ? AND p.entity_id = ?
        ORDER BY p.is_main DESC, p.created_at DESC
    ");
    
    $stmt->bind_param("si", $entityType, $entityId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $photos = [];
    while ($row = $result->fetch_assoc()) {
        $photos[] = $row;
    }
    
    Response::success(['photos' => $photos]);
    
} catch (Exception $e) {
    error_log("Error fetching photos: " . $e->getMessage());
    Response::serverError('Failed to fetch photos');
}
