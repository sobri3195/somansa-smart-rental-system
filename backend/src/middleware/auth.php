<?php
/**
 * Authentication Middleware
 * Validates JWT tokens and manages user sessions
 */

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/constants.php';

class AuthMiddleware {
    
    private $db;
    private $secretKey;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->secretKey = getenv('JWT_SECRET') ?: 'your-secret-key-change-in-production';
    }
    
    /**
     * Generate JWT token
     */
    public function generateToken($userId, $tenantId, $role) {
        $issuedAt = time();
        $expirationTime = $issuedAt + TOKEN_EXPIRATION;
        
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'user_id' => $userId,
            'tenant_id' => $tenantId,
            'role' => $role
        ];
        
        return $this->createJWT($payload);
    }
    
    /**
     * Validate JWT token and return payload
     */
    public function validateToken($token) {
        try {
            $payload = $this->decodeJWT($token);
            
            if (!$payload) {
                return null;
            }
            
            // Check expiration
            if (isset($payload['exp']) && $payload['exp'] < time()) {
                return null;
            }
            
            return $payload;
        } catch (Exception $e) {
            return null;
        }
    }
    
    /**
     * Get current authenticated user from token
     */
    public function getCurrentUser() {
        $token = $this->getTokenFromHeader();
        
        if (!$token) {
            return null;
        }
        
        $payload = $this->validateToken($token);
        
        if (!$payload) {
            return null;
        }
        
        // Fetch user from database
        $userId = $payload['user_id'];
        $stmt = $this->db->prepare("
            SELECT id, tenant_id, name, email, phone, role, is_active
            FROM users
            WHERE id = ? AND is_active = TRUE
        ");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            return null;
        }
        
        return $result->fetch_assoc();
    }
    
    /**
     * Require authentication
     */
    public function requireAuth() {
        $user = $this->getCurrentUser();
        
        if (!$user) {
            http_response_code(HTTP_UNAUTHORIZED);
            echo json_encode([
                'success' => false,
                'error' => ERROR_UNAUTHORIZED
            ]);
            exit();
        }
        
        return $user;
    }
    
    /**
     * Require specific role(s)
     */
    public function requireRole($roles) {
        $user = $this->requireAuth();
        
        if (!is_array($roles)) {
            $roles = [$roles];
        }
        
        if (!in_array($user['role'], $roles)) {
            http_response_code(HTTP_FORBIDDEN);
            echo json_encode([
                'success' => false,
                'error' => ERROR_FORBIDDEN
            ]);
            exit();
        }
        
        return $user;
    }
    
    /**
     * Check if user belongs to tenant
     */
    public function checkTenantAccess($user, $tenantId) {
        // Super admin can access all tenants
        if ($user['role'] === ROLE_SUPER_ADMIN) {
            return true;
        }
        
        // Check if user's tenant matches
        if ($user['tenant_id'] != $tenantId) {
            http_response_code(HTTP_FORBIDDEN);
            echo json_encode([
                'success' => false,
                'error' => 'Access denied to this tenant'
            ]);
            exit();
        }
        
        return true;
    }
    
    /**
     * Extract token from Authorization header
     */
    private function getTokenFromHeader() {
        $headers = getallheaders();
        
        if (isset($headers['Authorization'])) {
            $matches = [];
            if (preg_match('/Bearer\s+(.*)$/i', $headers['Authorization'], $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }
    
    /**
     * Simple JWT creation (base64 encoded)
     * For production, use a proper JWT library like firebase/php-jwt
     */
    private function createJWT($payload) {
        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];
        
        $headerEncoded = $this->base64UrlEncode(json_encode($header));
        $payloadEncoded = $this->base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac('SHA256', "$headerEncoded.$payloadEncoded", $this->secretKey, true);
        $signatureEncoded = $this->base64UrlEncode($signature);
        
        return "$headerEncoded.$payloadEncoded.$signatureEncoded";
    }
    
    /**
     * Simple JWT decoding
     */
    private function decodeJWT($token) {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return null;
        }
        
        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;
        
        // Verify signature
        $signature = hash_hmac('SHA256', "$headerEncoded.$payloadEncoded", $this->secretKey, true);
        $signatureCheck = $this->base64UrlEncode($signature);
        
        if ($signatureCheck !== $signatureEncoded) {
            return null;
        }
        
        $payload = json_decode($this->base64UrlDecode($payloadEncoded), true);
        
        return $payload;
    }
    
    private function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
