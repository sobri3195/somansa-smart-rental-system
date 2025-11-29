<?php
/**
 * Delete Photo Endpoint
 * DELETE /api/photos/delete.php?id={id}
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
    Response::error('Photo ID is required', HTTP_BAD_REQUEST);
}

$auth = new AuthMiddleware();
$user = $auth->requireAuth(['owner', 'staff', 'super_admin']);

$db = Database::getInstance()->getConnection();
$photoId = intval($_GET['id']);

try {
    // Get photo details
    $stmt = $db->prepare("SELECT * FROM photos WHERE id = ?");
    $stmt->bind_param("i", $photoId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        Response::notFound('Photo not found');
    }
    
    $photo = $result->fetch_assoc();
    
    // Check tenant access
    if ($user['role'] !== 'super_admin' && $photo['tenant_id'] != $user['tenant_id']) {
        Response::forbidden('Access denied');
    }
    
    // Delete file from filesystem
    $filepath = __DIR__ . '/../../../../uploads/' . $photo['filename'];
    if (file_exists($filepath)) {
        unlink($filepath);
    }
    
    // Delete from database
    $stmt = $db->prepare("DELETE FROM photos WHERE id = ?");
    $stmt->bind_param("i", $photoId);
    
    if ($stmt->execute()) {
        // Log activity
        $logStmt = $db->prepare("
            INSERT INTO activity_logs (tenant_id, user_id, action, entity_type, entity_id, description)
            VALUES (?, ?, 'delete_photo', 'photo', ?, ?)
        ");
        $logDesc = "Deleted photo #$photoId for " . $photo['entity_type'] . " #" . $photo['entity_id'];
        $logStmt->bind_param("iiis", $photo['tenant_id'], $user['id'], $photoId, $logDesc);
        $logStmt->execute();
        
        Response::success(null, 'Photo deleted successfully');
    } else {
        Response::serverError('Failed to delete photo');
    }
    
} catch (Exception $e) {
    error_log("Error deleting photo: " . $e->getMessage());
    Response::serverError('Failed to delete photo');
}
