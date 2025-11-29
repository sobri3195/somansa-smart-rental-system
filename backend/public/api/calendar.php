<?php
/**
 * Calendar Availability Endpoint
 * GET /api/calendar
 * Returns bookings for calendar visualization
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/constants.php';
require_once __DIR__ . '/../../src/middleware/auth.php';
require_once __DIR__ . '/../../src/utils/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error('Method not allowed', 405);
}

$auth = new AuthMiddleware();
$user = $auth->requireAuth();

$db = Database::getInstance()->getConnection();

try {
    // Validate required parameters
    if (!isset($_GET['start']) || !isset($_GET['end'])) {
        Response::error('start and end date parameters are required');
    }
    
    $sql = "
        SELECT 
            b.id,
            b.booking_number,
            b.start_datetime,
            b.end_datetime,
            b.status,
            b.total_price,
            b.unit_id,
            b.property_id,
            u.name as unit_name,
            u.code as unit_code,
            p.name as property_name,
            p.type as property_type,
            c.name as customer_name,
            c.phone as customer_phone
        FROM bookings b
        JOIN units u ON b.unit_id = u.id
        JOIN properties p ON b.property_id = p.id
        JOIN users c ON b.customer_id = c.id
        WHERE b.status NOT IN ('canceled', 'draft')
        AND b.start_datetime <= ?
        AND b.end_datetime >= ?
    ";
    
    $params = [$_GET['end'], $_GET['start']];
    $types = "ss";
    
    // Filter by tenant
    if ($user['role'] !== 'super_admin') {
        $sql .= " AND b.tenant_id = ?";
        $params[] = $user['tenant_id'];
        $types .= "i";
    }
    
    // Filter by property
    if (isset($_GET['property_id'])) {
        $sql .= " AND b.property_id = ?";
        $params[] = $_GET['property_id'];
        $types .= "i";
    }
    
    // Filter by unit
    if (isset($_GET['unit_id'])) {
        $sql .= " AND b.unit_id = ?";
        $params[] = $_GET['unit_id'];
        $types .= "i";
    }
    
    $sql .= " ORDER BY b.start_datetime ASC";
    
    $stmt = $db->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        // Format for calendar (FullCalendar compatible)
        $bookings[] = [
            'id' => $row['id'],
            'title' => $row['unit_name'] . ' - ' . $row['customer_name'],
            'start' => $row['start_datetime'],
            'end' => $row['end_datetime'],
            'backgroundColor' => getStatusColor($row['status']),
            'borderColor' => getStatusColor($row['status']),
            'extendedProps' => [
                'booking_number' => $row['booking_number'],
                'status' => $row['status'],
                'customer_name' => $row['customer_name'],
                'customer_phone' => $row['customer_phone'],
                'unit_id' => $row['unit_id'],
                'unit_name' => $row['unit_name'],
                'unit_code' => $row['unit_code'],
                'property_id' => $row['property_id'],
                'property_name' => $row['property_name'],
                'property_type' => $row['property_type'],
                'total_price' => $row['total_price']
            ]
        ];
    }
    
    Response::success($bookings);
    
} catch (Exception $e) {
    error_log("Calendar error: " . $e->getMessage());
    Response::serverError('Failed to fetch calendar data');
}

function getStatusColor($status) {
    $colors = [
        'pending_payment' => '#FFA500', // Orange
        'confirmed' => '#4CAF50', // Green
        'checked_in' => '#2196F3', // Blue
        'checked_out' => '#9E9E9E', // Gray
        'completed' => '#607D8B', // Blue Gray
        'canceled' => '#F44336', // Red
        'draft' => '#BDBDBD' // Light Gray
    ];
    
    return $colors[$status] ?? '#9E9E9E';
}
