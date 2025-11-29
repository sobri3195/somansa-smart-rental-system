<?php
/**
 * Photo Upload Endpoint
 * POST /api/photos/upload.php
 */

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/constants.php';
require_once __DIR__ . '/../../../src/middleware/auth.php';
require_once __DIR__ . '/../../../src/utils/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

$auth = new AuthMiddleware();
$user = $auth->requireAuth(['owner', 'staff', 'super_admin']);

// Validate required fields
if (!isset($_POST['entity_type']) || !isset($_POST['entity_id'])) {
    Response::error('entity_type and entity_id are required', HTTP_BAD_REQUEST);
}

$entityType = $_POST['entity_type']; // 'property' or 'unit'
$entityId = intval($_POST['entity_id']);

// Validate entity type
if (!in_array($entityType, ['property', 'unit'])) {
    Response::error('Invalid entity_type. Must be "property" or "unit"', HTTP_BAD_REQUEST);
}

// Check if file was uploaded
if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
    Response::error('No file uploaded or upload error', HTTP_BAD_REQUEST);
}

$file = $_FILES['photo'];

// Validate file type
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowedTypes)) {
    Response::error('Invalid file type. Only JPEG, PNG, and WebP are allowed', HTTP_BAD_REQUEST);
}

// Validate file size (max 5MB)
if ($file['size'] > MAX_UPLOAD_SIZE) {
    Response::error('File too large. Maximum size is 5MB', HTTP_BAD_REQUEST);
}

$db = Database::getInstance()->getConnection();

try {
    // Verify entity exists and user has access
    $table = $entityType === 'property' ? 'properties' : 'units';
    $stmt = $db->prepare("SELECT tenant_id FROM $table WHERE id = ?");
    $stmt->bind_param("i", $entityId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        Response::notFound(ucfirst($entityType) . ' not found');
    }
    
    $entity = $result->fetch_assoc();
    
    // Check tenant access
    if ($user['role'] !== 'super_admin' && $entity['tenant_id'] != $user['tenant_id']) {
        Response::forbidden('Access denied');
    }
    
    // Create upload directory if not exists
    $uploadDir = __DIR__ . '/../../../../uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '_' . time() . '.' . $extension;
    $filepath = $uploadDir . $filename;
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        Response::serverError('Failed to save file');
    }
    
    // Generate URL path
    $photoUrl = '/uploads/' . $filename;
    
    // Save to database
    $caption = $_POST['caption'] ?? '';
    $isMain = isset($_POST['is_main']) && $_POST['is_main'] === '1';
    
    // If this is main photo, unset other main photos
    if ($isMain) {
        $updateStmt = $db->prepare("
            UPDATE photos 
            SET is_main = FALSE 
            WHERE entity_type = ? AND entity_id = ?
        ");
        $updateStmt->bind_param("si", $entityType, $entityId);
        $updateStmt->execute();
    }
    
    $stmt = $db->prepare("
        INSERT INTO photos (tenant_id, entity_type, entity_id, filename, url, caption, is_main, uploaded_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->bind_param(
        "isisssii",
        $entity['tenant_id'],
        $entityType,
        $entityId,
        $filename,
        $photoUrl,
        $caption,
        $isMain,
        $user['id']
    );
    
    if ($stmt->execute()) {
        $photoId = $db->insert_id;
        
        // Get created photo
        $stmt = $db->prepare("SELECT * FROM photos WHERE id = ?");
        $stmt->bind_param("i", $photoId);
        $stmt->execute();
        $result = $stmt->get_result();
        $photo = $result->fetch_assoc();
        
        // Log activity
        $logStmt = $db->prepare("
            INSERT INTO activity_logs (tenant_id, user_id, action, entity_type, entity_id, description)
            VALUES (?, ?, 'upload_photo', ?, ?, ?)
        ");
        $logDesc = "Uploaded photo for $entityType #$entityId";
        $logStmt->bind_param("iisis", $entity['tenant_id'], $user['id'], $entityType, $entityId, $logDesc);
        $logStmt->execute();
        
        Response::created(['photo' => $photo], 'Photo uploaded successfully');
    } else {
        // Remove file if database insert fails
        unlink($filepath);
        Response::serverError('Failed to save photo');
    }
    
} catch (Exception $e) {
    error_log("Photo upload error: " . $e->getMessage());
    Response::serverError('Failed to upload photo');
}
