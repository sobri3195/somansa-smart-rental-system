<?php
/**
 * API Response Helper
 */

class Response {
    
    public static function success($data = null, $message = null, $code = 200) {
        http_response_code($code);
        $response = ['success' => true];
        
        if ($message !== null) {
            $response['message'] = $message;
        }
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        echo json_encode($response);
        exit();
    }
    
    public static function error($error, $code = 400, $details = null) {
        http_response_code($code);
        $response = [
            'success' => false,
            'error' => $error
        ];
        
        if ($details !== null) {
            $response['details'] = $details;
        }
        
        echo json_encode($response);
        exit();
    }
    
    public static function paginated($data, $page, $perPage, $total) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $data,
            'pagination' => [
                'current_page' => (int)$page,
                'per_page' => (int)$perPage,
                'total' => (int)$total,
                'total_pages' => ceil($total / $perPage)
            ]
        ]);
        exit();
    }
    
    public static function created($data, $message = 'Resource created successfully') {
        self::success($data, $message, HTTP_CREATED);
    }
    
    public static function notFound($message = 'Resource not found') {
        self::error($message, HTTP_NOT_FOUND);
    }
    
    public static function unauthorized($message = 'Unauthorized') {
        self::error($message, HTTP_UNAUTHORIZED);
    }
    
    public static function forbidden($message = 'Forbidden') {
        self::error($message, HTTP_FORBIDDEN);
    }
    
    public static function validationError($errors) {
        self::error('Validation failed', HTTP_UNPROCESSABLE_ENTITY, $errors);
    }
    
    public static function conflict($message = 'Resource conflict') {
        self::error($message, HTTP_CONFLICT);
    }
    
    public static function serverError($message = 'Internal server error') {
        self::error($message, HTTP_INTERNAL_SERVER_ERROR);
    }
}
