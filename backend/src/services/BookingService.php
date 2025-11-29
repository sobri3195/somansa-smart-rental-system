<?php
/**
 * Booking Service
 * Handles booking business logic including conflict detection
 */

require_once __DIR__ . '/../../config/database.php';

class BookingService {
    
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Check if unit is available for the given date range
     */
    public function checkAvailability($unitId, $startDatetime, $endDatetime, $excludeBookingId = null) {
        $sql = "
            SELECT COUNT(*) as count
            FROM bookings
            WHERE unit_id = ?
            AND status NOT IN ('canceled', 'draft')
            AND (
                (start_datetime < ? AND end_datetime > ?)
                OR (start_datetime < ? AND end_datetime > ?)
                OR (start_datetime >= ? AND end_datetime <= ?)
            )
        ";
        
        $params = [$unitId, $endDatetime, $startDatetime, $endDatetime, $startDatetime, $startDatetime, $endDatetime];
        $types = "issssss";
        
        if ($excludeBookingId) {
            $sql .= " AND id != ?";
            $params[] = $excludeBookingId;
            $types .= "i";
        }
        
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        return $row['count'] == 0;
    }
    
    /**
     * Calculate booking price based on unit pricing mode
     */
    public function calculatePrice($unitId, $startDatetime, $endDatetime) {
        $stmt = $this->db->prepare("
            SELECT pricing_mode, base_price, deposit_amount
            FROM units
            WHERE id = ?
        ");
        $stmt->bind_param("i", $unitId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            return null;
        }
        
        $unit = $result->fetch_assoc();
        $start = new DateTime($startDatetime);
        $end = new DateTime($endDatetime);
        
        $duration = 0;
        $durationUnit = '';
        
        switch ($unit['pricing_mode']) {
            case 'hourly':
                $duration = ceil(($end->getTimestamp() - $start->getTimestamp()) / 3600);
                $durationUnit = 'hour';
                break;
            case 'daily':
                $duration = max(1, $end->diff($start)->days);
                $durationUnit = 'day';
                break;
            case 'weekly':
                $duration = max(1, ceil($end->diff($start)->days / 7));
                $durationUnit = 'week';
                break;
            case 'monthly':
                $interval = $start->diff($end);
                $duration = max(1, $interval->m + ($interval->y * 12));
                $durationUnit = 'month';
                break;
        }
        
        $subtotal = $duration * $unit['base_price'];
        
        return [
            'duration_value' => $duration,
            'duration_unit' => $durationUnit,
            'base_price' => $unit['base_price'],
            'subtotal' => $subtotal,
            'deposit_amount' => $unit['deposit_amount']
        ];
    }
    
    /**
     * Generate unique booking number
     */
    public function generateBookingNumber($tenantId) {
        $prefix = $this->getSettingValue($tenantId, 'booking_prefix', 'BK');
        $date = date('Ymd');
        
        $stmt = $this->db->prepare("
            SELECT COUNT(*) as count
            FROM bookings
            WHERE tenant_id = ? AND DATE(created_at) = CURDATE()
        ");
        $stmt->bind_param("i", $tenantId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        $sequence = str_pad($row['count'] + 1, 4, '0', STR_PAD_LEFT);
        
        return "$prefix-$date-$sequence";
    }
    
    /**
     * Create a new booking
     */
    public function createBooking($data) {
        $this->db->begin_transaction();
        
        try {
            // Check availability
            if (!$this->checkAvailability($data['unit_id'], $data['start_datetime'], $data['end_datetime'])) {
                throw new Exception('Unit is not available for the selected dates');
            }
            
            // Calculate pricing
            $pricing = $this->calculatePrice($data['unit_id'], $data['start_datetime'], $data['end_datetime']);
            if (!$pricing) {
                throw new Exception('Unit not found');
            }
            
            // Generate booking number
            $bookingNumber = $this->generateBookingNumber($data['tenant_id']);
            
            // Calculate totals
            $subtotal = $pricing['subtotal'];
            $taxAmount = isset($data['tax_amount']) ? $data['tax_amount'] : 0;
            $discountAmount = isset($data['discount_amount']) ? $data['discount_amount'] : 0;
            $depositAmount = $pricing['deposit_amount'];
            $totalPrice = $subtotal + $taxAmount - $discountAmount;
            
            // Insert booking
            $stmt = $this->db->prepare("
                INSERT INTO bookings (
                    tenant_id, property_id, unit_id, customer_id, booking_number,
                    booking_source, start_datetime, end_datetime, duration_value, duration_unit,
                    subtotal, tax_amount, discount_amount, deposit_amount, total_price,
                    status, notes, special_requests
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $status = $data['status'] ?? 'pending_payment';
            
            $stmt->bind_param(
                "iiiissssissddddss",
                $data['tenant_id'],
                $data['property_id'],
                $data['unit_id'],
                $data['customer_id'],
                $bookingNumber,
                $data['booking_source'],
                $data['start_datetime'],
                $data['end_datetime'],
                $pricing['duration_value'],
                $pricing['duration_unit'],
                $subtotal,
                $taxAmount,
                $discountAmount,
                $depositAmount,
                $totalPrice,
                $status,
                $data['notes'] ?? null,
                $data['special_requests'] ?? null
            );
            
            $stmt->execute();
            $bookingId = $this->db->insert_id;
            
            // Insert add-ons if provided
            if (isset($data['add_ons']) && is_array($data['add_ons'])) {
                foreach ($data['add_ons'] as $addOn) {
                    $this->addBookingAddOn($bookingId, $addOn);
                }
            }
            
            $this->db->commit();
            
            return $this->getBookingById($bookingId);
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    /**
     * Add an add-on to a booking
     */
    private function addBookingAddOn($bookingId, $addOn) {
        $quantity = $addOn['quantity'] ?? 1;
        $totalPrice = $addOn['unit_price'] * $quantity;
        
        $stmt = $this->db->prepare("
            INSERT INTO booking_add_ons (booking_id, add_on_id, quantity, unit_price, total_price)
            VALUES (?, ?, ?, ?, ?)
        ");
        
        $stmt->bind_param(
            "iiidd",
            $bookingId,
            $addOn['add_on_id'],
            $quantity,
            $addOn['unit_price'],
            $totalPrice
        );
        
        return $stmt->execute();
    }
    
    /**
     * Get booking by ID with relations
     */
    public function getBookingById($bookingId) {
        $stmt = $this->db->prepare("
            SELECT 
                b.*,
                u.name as unit_name,
                u.code as unit_code,
                p.name as property_name,
                p.type as property_type,
                c.name as customer_name,
                c.email as customer_email,
                c.phone as customer_phone
            FROM bookings b
            JOIN units u ON b.unit_id = u.id
            JOIN properties p ON b.property_id = p.id
            JOIN users c ON b.customer_id = c.id
            WHERE b.id = ?
        ");
        
        $stmt->bind_param("i", $bookingId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            return null;
        }
        
        $booking = $result->fetch_assoc();
        
        // Get add-ons
        $booking['add_ons'] = $this->getBookingAddOns($bookingId);
        
        return $booking;
    }
    
    /**
     * Get add-ons for a booking
     */
    private function getBookingAddOns($bookingId) {
        $stmt = $this->db->prepare("
            SELECT 
                ba.*,
                a.name as add_on_name,
                a.description as add_on_description
            FROM booking_add_ons ba
            JOIN add_ons a ON ba.add_on_id = a.id
            WHERE ba.booking_id = ?
        ");
        
        $stmt->bind_param("i", $bookingId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $addOns = [];
        while ($row = $result->fetch_assoc()) {
            $addOns[] = $row;
        }
        
        return $addOns;
    }
    
    /**
     * Update booking status
     */
    public function updateStatus($bookingId, $status, $additionalData = []) {
        $allowedStatuses = ['draft', 'pending_payment', 'confirmed', 'checked_in', 'checked_out', 'canceled', 'completed'];
        
        if (!in_array($status, $allowedStatuses)) {
            throw new Exception('Invalid status');
        }
        
        $sql = "UPDATE bookings SET status = ?";
        $params = [$status];
        $types = "s";
        
        if ($status === 'checked_in' && !isset($additionalData['check_in_at'])) {
            $sql .= ", check_in_at = NOW()";
        } elseif ($status === 'checked_out' && !isset($additionalData['check_out_at'])) {
            $sql .= ", check_out_at = NOW()";
        } elseif ($status === 'canceled') {
            $sql .= ", canceled_at = NOW()";
            if (isset($additionalData['cancellation_reason'])) {
                $sql .= ", cancellation_reason = ?";
                $params[] = $additionalData['cancellation_reason'];
                $types .= "s";
            }
        }
        
        $sql .= " WHERE id = ?";
        $params[] = $bookingId;
        $types .= "i";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param($types, ...$params);
        
        return $stmt->execute();
    }
    
    /**
     * Get setting value
     */
    private function getSettingValue($tenantId, $key, $default = null) {
        $stmt = $this->db->prepare("
            SELECT value FROM settings WHERE tenant_id = ? AND `key` = ?
        ");
        $stmt->bind_param("is", $tenantId, $key);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            return $default;
        }
        
        $row = $result->fetch_assoc();
        return $row['value'];
    }
}
