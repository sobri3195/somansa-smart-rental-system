<?php
/**
 * User Login Endpoint
 * POST /api/auth/login
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

$data = json_decode(file_get_contents('php://input'), true);

// Validate input
$validator = Validator::make($data)
    ->required('email')
    ->email('email')
    ->required('password');

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

$db = Database::getInstance()->getConnection();

try {
    // Find user by email
    $stmt = $db->prepare("
        SELECT id, tenant_id, name, email, password_hash, phone, role, is_active
        FROM users
        WHERE email = ?
    ");
    
    $stmt->bind_param("s", $data['email']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        Response::unauthorized('Invalid email or password');
    }
    
    $user = $result->fetch_assoc();
    
    // Check if user is active
    if (!$user['is_active']) {
        Response::forbidden('Account is inactive. Please contact support.');
    }
    
    // Verify password
    if (!password_verify($data['password'], $user['password_hash'])) {
        Response::unauthorized('Invalid email or password');
    }
    
    // Check tenant status if user has tenant
    if ($user['tenant_id']) {
        $stmt = $db->prepare("
            SELECT status FROM tenants WHERE id = ?
        ");
        $stmt->bind_param("i", $user['tenant_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $tenant = $result->fetch_assoc();
        
        if ($tenant && $tenant['status'] !== 'active') {
            Response::forbidden('Your organization account is ' . $tenant['status']);
        }
    }
    
    // Generate token
    $auth = new AuthMiddleware();
    $token = $auth->generateToken($user['id'], $user['tenant_id'], $user['role']);
    
    // Log activity
    $stmt = $db->prepare("
        INSERT INTO activity_logs (tenant_id, user_id, action, description, ip_address, user_agent)
        VALUES (?, ?, 'login', 'User logged in', ?, ?)
    ");
    
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;
    
    $stmt->bind_param(
        "iiss",
        $user['tenant_id'],
        $user['id'],
        $ipAddress,
        $userAgent
    );
    $stmt->execute();
    
    // Remove sensitive data
    unset($user['password_hash']);
    
    Response::success([
        'user' => $user,
        'token' => $token,
        'token_type' => 'Bearer',
        'expires_in' => TOKEN_EXPIRATION
    ], 'Login successful');
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    Response::serverError('Login failed');
}
