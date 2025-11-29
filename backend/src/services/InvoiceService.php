<?php
/**
 * Invoice Service
 * Handles invoice generation and recurring billing
 */

require_once __DIR__ . '/../../config/database.php';

class InvoiceService {
    
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Generate invoice number
     */
    public function generateInvoiceNumber($tenantId) {
        $prefix = $this->getSettingValue($tenantId, 'invoice_prefix', 'INV');
        $date = date('Ym');
        
        $stmt = $this->db->prepare("
            SELECT COUNT(*) as count
            FROM invoices
            WHERE tenant_id = ? AND YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())
        ");
        $stmt->bind_param("i", $tenantId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        $sequence = str_pad($row['count'] + 1, 4, '0', STR_PAD_LEFT);
        
        return "$prefix-$date-$sequence";
    }
    
    /**
     * Create invoice from booking
     */
    public function createInvoiceFromBooking($bookingId, $periodMonth = null, $periodYear = null) {
        $this->db->begin_transaction();
        
        try {
            // Get booking details
            $stmt = $this->db->prepare("
                SELECT 
                    b.*,
                    u.pricing_mode
                FROM bookings b
                JOIN units u ON b.unit_id = u.id
                WHERE b.id = ?
            ");
            $stmt->bind_param("i", $bookingId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 0) {
                throw new Exception('Booking not found');
            }
            
            $booking = $result->fetch_assoc();
            
            // Generate invoice number
            $invoiceNumber = $this->generateInvoiceNumber($booking['tenant_id']);
            
            // Calculate dates
            $issueDate = date('Y-m-d');
            $dueDays = $this->getSettingValue($booking['tenant_id'], 'invoice_due_days', 7);
            $dueDate = date('Y-m-d', strtotime("+$dueDays days"));
            
            // For recurring monthly invoices
            if ($periodMonth && $periodYear) {
                $issueDate = "$periodYear-" . str_pad($periodMonth, 2, '0', STR_PAD_LEFT) . "-01";
                $dueDate = date('Y-m-d', strtotime($issueDate . " +$dueDays days"));
            }
            
            // Insert invoice
            $stmt = $this->db->prepare("
                INSERT INTO invoices (
                    tenant_id, booking_id, customer_id, invoice_number,
                    issue_date, due_date, period_month, period_year,
                    subtotal, tax_amount, discount_amount, total_amount,
                    status, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $status = 'unpaid';
            $notes = $periodMonth ? "Monthly invoice for period $periodMonth/$periodYear" : null;
            
            $stmt->bind_param(
                "iiiissiidddds",
                $booking['tenant_id'],
                $bookingId,
                $booking['customer_id'],
                $invoiceNumber,
                $issueDate,
                $dueDate,
                $periodMonth,
                $periodYear,
                $booking['subtotal'],
                $booking['tax_amount'],
                $booking['discount_amount'],
                $booking['total_price'],
                $status,
                $notes
            );
            
            $stmt->execute();
            $invoiceId = $this->db->insert_id;
            
            $this->db->commit();
            
            return $this->getInvoiceById($invoiceId);
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    /**
     * Generate recurring monthly invoices for kos/boarding
     */
    public function generateRecurringInvoices($bookingId) {
        $this->db->begin_transaction();
        
        try {
            // Get booking details
            $stmt = $this->db->prepare("
                SELECT 
                    b.*,
                    u.pricing_mode
                FROM bookings b
                JOIN units u ON b.unit_id = u.id
                WHERE b.id = ?
            ");
            $stmt->bind_param("i", $bookingId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 0) {
                throw new Exception('Booking not found');
            }
            
            $booking = $result->fetch_assoc();
            
            // Only for monthly pricing
            if ($booking['pricing_mode'] !== 'monthly') {
                throw new Exception('Recurring invoices only for monthly bookings');
            }
            
            $invoices = [];
            $start = new DateTime($booking['start_datetime']);
            $end = new DateTime($booking['end_datetime']);
            
            // Generate invoice for each month
            while ($start <= $end) {
                $month = (int)$start->format('m');
                $year = (int)$start->format('Y');
                
                // Check if invoice already exists for this period
                $stmt = $this->db->prepare("
                    SELECT id FROM invoices
                    WHERE booking_id = ? AND period_month = ? AND period_year = ?
                ");
                $stmt->bind_param("iii", $bookingId, $month, $year);
                $stmt->execute();
                $result = $stmt->get_result();
                
                if ($result->num_rows === 0) {
                    $invoice = $this->createInvoiceFromBooking($bookingId, $month, $year);
                    $invoices[] = $invoice;
                }
                
                $start->modify('+1 month');
            }
            
            $this->db->commit();
            
            return $invoices;
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    /**
     * Record a payment for an invoice
     */
    public function recordPayment($invoiceId, $data) {
        $this->db->begin_transaction();
        
        try {
            // Get invoice
            $invoice = $this->getInvoiceById($invoiceId);
            if (!$invoice) {
                throw new Exception('Invoice not found');
            }
            
            // Generate payment number
            $paymentNumber = $this->generatePaymentNumber($invoice['tenant_id']);
            
            // Insert payment
            $stmt = $this->db->prepare("
                INSERT INTO payments (
                    tenant_id, invoice_id, booking_id, payment_number,
                    amount, method, transaction_reference, payment_proof_url,
                    paid_at, status, gateway_name, raw_response, notes, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $paidAt = $data['paid_at'] ?? date('Y-m-d H:i:s');
            $status = $data['status'] ?? 'success';
            
            $stmt->bind_param(
                "iiisdssssssi",
                $invoice['tenant_id'],
                $invoiceId,
                $invoice['booking_id'],
                $paymentNumber,
                $data['amount'],
                $data['method'],
                $data['transaction_reference'] ?? null,
                $data['payment_proof_url'] ?? null,
                $paidAt,
                $status,
                $data['gateway_name'] ?? null,
                $data['raw_response'] ?? null,
                $data['notes'] ?? null,
                $data['created_by'] ?? null
            );
            
            $stmt->execute();
            $paymentId = $this->db->insert_id;
            
            // Update invoice paid amount and status
            $newPaidAmount = $invoice['paid_amount'] + $data['amount'];
            $newStatus = $this->calculateInvoiceStatus($invoice['total_amount'], $newPaidAmount);
            
            $stmt = $this->db->prepare("
                UPDATE invoices SET paid_amount = ?, status = ? WHERE id = ?
            ");
            $stmt->bind_param("dsi", $newPaidAmount, $newStatus, $invoiceId);
            $stmt->execute();
            
            // If invoice is paid, update booking status
            if ($newStatus === 'paid') {
                $stmt = $this->db->prepare("
                    UPDATE bookings SET status = 'confirmed' WHERE id = ? AND status = 'pending_payment'
                ");
                $stmt->bind_param("i", $invoice['booking_id']);
                $stmt->execute();
            }
            
            $this->db->commit();
            
            return $this->getPaymentById($paymentId);
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    /**
     * Calculate invoice status based on paid amount
     */
    private function calculateInvoiceStatus($totalAmount, $paidAmount) {
        if ($paidAmount >= $totalAmount) {
            return 'paid';
        } elseif ($paidAmount > 0) {
            return 'partial';
        } else {
            return 'unpaid';
        }
    }
    
    /**
     * Generate payment number
     */
    private function generatePaymentNumber($tenantId) {
        $prefix = $this->getSettingValue($tenantId, 'payment_prefix', 'PAY');
        $date = date('Ymd');
        
        $stmt = $this->db->prepare("
            SELECT COUNT(*) as count
            FROM payments
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
     * Get invoice by ID
     */
    public function getInvoiceById($invoiceId) {
        $stmt = $this->db->prepare("
            SELECT 
                i.*,
                c.name as customer_name,
                c.email as customer_email,
                c.phone as customer_phone,
                b.booking_number
            FROM invoices i
            JOIN users c ON i.customer_id = c.id
            LEFT JOIN bookings b ON i.booking_id = b.id
            WHERE i.id = ?
        ");
        
        $stmt->bind_param("i", $invoiceId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            return null;
        }
        
        return $result->fetch_assoc();
    }
    
    /**
     * Get payment by ID
     */
    private function getPaymentById($paymentId) {
        $stmt = $this->db->prepare("
            SELECT 
                p.*,
                i.invoice_number
            FROM payments p
            JOIN invoices i ON p.invoice_id = i.id
            WHERE p.id = ?
        ");
        
        $stmt->bind_param("i", $paymentId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            return null;
        }
        
        return $result->fetch_assoc();
    }
    
    /**
     * Mark overdue invoices
     */
    public function markOverdueInvoices() {
        $stmt = $this->db->prepare("
            UPDATE invoices
            SET status = 'overdue'
            WHERE status IN ('unpaid', 'partial')
            AND due_date < CURDATE()
        ");
        
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
