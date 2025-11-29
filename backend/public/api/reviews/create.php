<?php
/**
 * Create Review Endpoint
 * POST /api/reviews/create.php
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
$user = $auth->requireAuth(['customer']);

$data = json_decode(file_get_contents('php://input'), true);

// Validate input
$validator = Validator::make($data)
    ->required('booking_id')
    ->required('rating')
    ->required('comment');

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

// Validate rating (1-5)
$rating = intval($data['rating']);
if ($rating < 1 || $rating > 5) {
    Response::error('Rating must be between 1 and 5', HTTP_BAD_REQUEST);
}

$db = Database::getInstance()->getConnection();

try {
    // Check if booking exists and belongs to user
    $stmt = $db->prepare("
        SELECT b.*, p.name as property_name, u.name as unit_name
        FROM bookings b
        LEFT JOIN properties p ON b.property_id = p.id
        LEFT JOIN units u ON b.unit_id = u.id
        WHERE b.id = ? AND b.customer_id = ?
    ");
    
    $bookingId = intval($data['booking_id']);
    $stmt->bind_param("ii", $bookingId, $user['id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        Response::notFound('Booking not found or does not belong to you');
    }
    
    $booking = $result->fetch_assoc();
    
    // Check if booking is completed or checked_out
    if (!in_array($booking['status'], ['completed', 'checked_out'])) {
        Response::error('Can only review completed bookings', HTTP_BAD_REQUEST);
    }
    
    // Check if review already exists
    $stmt = $db->prepare("
        SELECT id FROM reviews WHERE booking_id = ?
    ");
    $stmt->bind_param("i", $bookingId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        Response::conflict('Review already exists for this booking');
    }
    
    // Create review
    $stmt = $db->prepare("
        INSERT INTO reviews (
            tenant_id, 
            booking_id, 
            property_id, 
            unit_id, 
            customer_id, 
            rating, 
            comment,
            is_approved
        ) VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)
    ");
    
    $stmt->bind_param(
        "iiiiiss",
        $booking['tenant_id'],
        $bookingId,
        $booking['property_id'],
        $booking['unit_id'],
        $user['id'],
        $rating,
        $data['comment']
    );
    
    if ($stmt->execute()) {
        $reviewId = $db->insert_id();
        
        // Update property/unit average rating
        updateAverageRating($db, $booking['property_id'], 'property');
        updateAverageRating($db, $booking['unit_id'], 'unit');
        
        // Get created review
        $stmt = $db->prepare("
            SELECT 
                r.*,
                u.name as customer_name,
                p.name as property_name,
                un.name as unit_name
            FROM reviews r
            LEFT JOIN users u ON r.customer_id = u.id
            LEFT JOIN properties p ON r.property_id = p.id
            LEFT JOIN units un ON r.unit_id = un.id
            WHERE r.id = ?
        ");
        $stmt->bind_param("i", $reviewId);
        $stmt->execute();
        $result = $stmt->get_result();
        $review = $result->fetch_assoc();
        
        // Log activity
        $logStmt = $db->prepare("
            INSERT INTO activity_logs (tenant_id, user_id, action, entity_type, entity_id, description)
            VALUES (?, ?, 'create_review', 'review', ?, ?)
        ");
        $logDesc = "Created review for booking #$bookingId";
        $logStmt->bind_param("iiis", $booking['tenant_id'], $user['id'], $reviewId, $logDesc);
        $logStmt->execute();
        
        Response::created(['review' => $review], 'Review created successfully');
    } else {
        Response::serverError('Failed to create review');
    }
    
} catch (Exception $e) {
    error_log("Review creation error: " . $e->getMessage());
    Response::serverError('Failed to create review');
}

function updateAverageRating($db, $entityId, $entityType) {
    $table = $entityType === 'property' ? 'properties' : 'units';
    $column = $entityType === 'property' ? 'property_id' : 'unit_id';
    
    $stmt = $db->prepare("
        SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
        FROM reviews
        WHERE $column = ? AND is_approved = TRUE
    ");
    $stmt->bind_param("i", $entityId);
    $stmt->execute();
    $result = $stmt->get_result();
    $stats = $result->fetch_assoc();
    
    $avgRating = round($stats['avg_rating'], 1);
    $reviewCount = intval($stats['review_count']);
    
    $updateStmt = $db->prepare("
        UPDATE $table 
        SET average_rating = ?, review_count = ?
        WHERE id = ?
    ");
    $updateStmt->bind_param("dii", $avgRating, $reviewCount, $entityId);
    $updateStmt->execute();
}
