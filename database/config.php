<?php
/**
 * =====================================================
 * Somansa Smart Rental System - Database Configuration
 * MySQL/MySQLi Configuration (Not Connected - Demo Only)
 * =====================================================
 * 
 * This file contains database configuration for reference only.
 * The application does not connect to a real database.
 * All data is served through the mock API.
 */

// Database Configuration Constants
define('DB_HOST', 'localhost');
define('DB_NAME', 'somansa_rental_db');
define('DB_USER', 'somansa_user');
define('DB_PASS', 'your_secure_password_here');
define('DB_PORT', 3306);
define('DB_CHARSET', 'utf8mb4');

// Demo Admin Credentials (No Real Auth)
define('DEMO_ADMIN_USERNAME', 'demo_admin');
define('DEMO_ADMIN_EMAIL', 'admin@somansa.demo');
define('DEMO_ADMIN_NAME', 'Demo Administrator');
define('DEMO_ADMIN_ROLE', 'super_admin');

/**
 * Database Connection Class (Not Used - Reference Only)
 */
class Database {
    private $host = DB_HOST;
    private $db_name = DB_NAME;
    private $username = DB_USER;
    private $password = DB_PASS;
    private $port = DB_PORT;
    private $charset = DB_CHARSET;
    public $conn;

    /**
     * Get database connection (Not Used)
     * @return mysqli|null
     */
    public function getConnection() {
        $this->conn = null;

        try {
            // MySQLi connection (example - not actually used)
            $this->conn = new mysqli(
                $this->host,
                $this->username,
                $this->password,
                $this->db_name,
                $this->port
            );

            // Set charset
            $this->conn->set_charset($this->charset);

            // Check connection
            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }

        } catch(Exception $e) {
            echo "Connection error: " . $e->getMessage();
        }

        return $this->conn;
    }

    /**
     * Close database connection
     */
    public function closeConnection() {
        if ($this->conn) {
            $this->conn->close();
        }
    }
}

/**
 * Query Helper Functions (Reference Only)
 */

/**
 * Execute a SELECT query
 * @param mysqli $conn
 * @param string $query
 * @return array
 */
function executeQuery($conn, $query) {
    $result = $conn->query($query);
    $data = [];
    
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }
    
    return $data;
}

/**
 * Execute an INSERT/UPDATE/DELETE query
 * @param mysqli $conn
 * @param string $query
 * @return bool
 */
function executeNonQuery($conn, $query) {
    return $conn->query($query);
}

/**
 * Escape string for SQL
 * @param mysqli $conn
 * @param string $string
 * @return string
 */
function escapeString($conn, $string) {
    return $conn->real_escape_string($string);
}

/**
 * Get last insert ID
 * @param mysqli $conn
 * @return int
 */
function getLastInsertId($conn) {
    return $conn->insert_id;
}

/**
 * Begin transaction
 * @param mysqli $conn
 */
function beginTransaction($conn) {
    $conn->begin_transaction();
}

/**
 * Commit transaction
 * @param mysqli $conn
 */
function commitTransaction($conn) {
    $conn->commit();
}

/**
 * Rollback transaction
 * @param mysqli $conn
 */
function rollbackTransaction($conn) {
    $conn->rollback();
}

/**
 * Sample Query Examples
 */

// Example 1: Get all properties
function getAllProperties($conn, $limit = 10, $offset = 0) {
    $query = "SELECT * FROM properties WHERE status = 'active' LIMIT $limit OFFSET $offset";
    return executeQuery($conn, $query);
}

// Example 2: Get property by ID
function getPropertyById($conn, $propertyId) {
    $propertyId = escapeString($conn, $propertyId);
    $query = "SELECT * FROM properties WHERE id = '$propertyId' AND status = 'active'";
    $result = executeQuery($conn, $query);
    return !empty($result) ? $result[0] : null;
}

// Example 3: Create booking
function createBooking($conn, $data) {
    $booking_code = $data['booking_code'];
    $property_id = $data['property_id'];
    $unit_id = $data['unit_id'];
    $guest_name = escapeString($conn, $data['guest_name']);
    $guest_email = escapeString($conn, $data['guest_email']);
    $guest_phone = escapeString($conn, $data['guest_phone']);
    $check_in = $data['check_in'];
    $check_out = $data['check_out'];
    $nights = $data['nights'];
    $total_price = $data['total_price'];
    
    $query = "INSERT INTO bookings 
              (booking_code, property_id, unit_id, guest_name, guest_email, guest_phone, 
               check_in, check_out, nights, total_price, status, payment_status)
              VALUES 
              ('$booking_code', $property_id, $unit_id, '$guest_name', '$guest_email', '$guest_phone',
               '$check_in', '$check_out', $nights, $total_price, 'pending', 'unpaid')";
    
    if (executeNonQuery($conn, $query)) {
        return getLastInsertId($conn);
    }
    
    return false;
}

// Example 4: Update booking status
function updateBookingStatus($conn, $bookingId, $status) {
    $bookingId = escapeString($conn, $bookingId);
    $status = escapeString($conn, $status);
    $query = "UPDATE bookings SET status = '$status' WHERE id = '$bookingId'";
    return executeNonQuery($conn, $query);
}

// Example 5: Get bookings with filters
function getBookings($conn, $filters = []) {
    $query = "SELECT b.*, p.name as property_name, u.unit_number 
              FROM bookings b
              LEFT JOIN properties p ON b.property_id = p.id
              LEFT JOIN units u ON b.unit_id = u.id
              WHERE 1=1";
    
    if (!empty($filters['status'])) {
        $status = escapeString($conn, $filters['status']);
        $query .= " AND b.status = '$status'";
    }
    
    if (!empty($filters['property_id'])) {
        $property_id = escapeString($conn, $filters['property_id']);
        $query .= " AND b.property_id = '$property_id'";
    }
    
    if (!empty($filters['date_from'])) {
        $date_from = escapeString($conn, $filters['date_from']);
        $query .= " AND b.check_in >= '$date_from'";
    }
    
    if (!empty($filters['date_to'])) {
        $date_to = escapeString($conn, $filters['date_to']);
        $query .= " AND b.check_out <= '$date_to'";
    }
    
    $query .= " ORDER BY b.created_at DESC";
    
    if (!empty($filters['limit'])) {
        $limit = (int)$filters['limit'];
        $offset = !empty($filters['offset']) ? (int)$filters['offset'] : 0;
        $query .= " LIMIT $limit OFFSET $offset";
    }
    
    return executeQuery($conn, $query);
}

// Example 6: Get analytics data
function getAnalyticsStats($conn, $dateFrom, $dateTo) {
    $dateFrom = escapeString($conn, $dateFrom);
    $dateTo = escapeString($conn, $dateTo);
    
    $query = "SELECT 
                event_type,
                COUNT(*) as count,
                DATE(created_at) as date
              FROM analytics_events
              WHERE created_at BETWEEN '$dateFrom' AND '$dateTo'
              GROUP BY event_type, DATE(created_at)
              ORDER BY date DESC, count DESC";
    
    return executeQuery($conn, $query);
}

// Example 7: Search properties
function searchProperties($conn, $searchTerm, $filters = []) {
    $searchTerm = escapeString($conn, $searchTerm);
    
    $query = "SELECT p.*, c.name as category_name
              FROM properties p
              LEFT JOIN categories c ON p.category_id = c.id
              WHERE p.status = 'active'
              AND (p.name LIKE '%$searchTerm%' 
                   OR p.description LIKE '%$searchTerm%'
                   OR p.city LIKE '%$searchTerm%')";
    
    if (!empty($filters['category_id'])) {
        $category_id = (int)$filters['category_id'];
        $query .= " AND p.category_id = $category_id";
    }
    
    if (!empty($filters['min_price'])) {
        $min_price = (float)$filters['min_price'];
        $query .= " AND p.base_price >= $min_price";
    }
    
    if (!empty($filters['max_price'])) {
        $max_price = (float)$filters['max_price'];
        $query .= " AND p.base_price <= $max_price";
    }
    
    $query .= " ORDER BY p.featured DESC, p.rating DESC";
    
    return executeQuery($conn, $query);
}

/**
 * =====================================================
 * NOTE: This file is for reference only.
 * The actual application uses a frontend-only approach
 * with mock API data. No real database connection is made.
 * =====================================================
 */
?>
