<?php
/**
 * User Registration Endpoint
 * POST /api/auth/register
 */

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/constants.php';
require_once __DIR__ . '/../../../src/utils/response.php';
require_once __DIR__ . '/../../../src/utils/validator.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

$data = json_decode(file_get_contents('php://input'), true);

// Validate input
$validator = Validator::make($data)
    ->required('name')
    ->required('email')
    ->email('email')
    ->required('password')
    ->min('password', 8)
    ->required('phone');

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

$db = Database::getInstance()->getConnection();

try {
    // Check if email already exists
    $stmt = $db->prepare("
        SELECT id FROM users 
        WHERE email = ? AND (tenant_id = ? OR tenant_id IS NULL)
    ");
    
    $tenantId = $data['tenant_id'] ?? null;
    $stmt->bind_param("si", $data['email'], $tenantId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        Response::conflict('Email already registered');
    }
    
    // Hash password
    $passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);
    
    // Default role is customer
    $role = $data['role'] ?? 'customer';
    
    // Only super_admin can create users with roles other than customer
    // For now, we'll allow customer registration only
    if ($role !== 'customer') {
        $role = 'customer';
    }
    
    // Insert user
    $stmt = $db->prepare("
        INSERT INTO users (tenant_id, name, email, password_hash, phone, role, is_active)
        VALUES (?, ?, ?, ?, ?, ?, TRUE)
    ");
    
    $stmt->bind_param(
        "isssss",
        $tenantId,
        $data['name'],
        $data['email'],
        $passwordHash,
        $data['phone'],
        $role
    );
    
    if ($stmt->execute()) {
        $userId = $db->insert_id;
        
        // Get created user
        $stmt = $db->prepare("
            SELECT id, tenant_id, name, email, phone, role, is_active, created_at
            FROM users
            WHERE id = ?
        ");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        
        Response::created([
            'user' => $user,
            'message' => 'Registration successful. Please login.'
        ]);
    } else {
        Response::serverError('Failed to create user');
    }
    
} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    Response::serverError('Registration failed');
}
