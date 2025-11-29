<?php
/**
 * Record Payment Endpoint
 * POST /api/payments/create.php
 */

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/constants.php';
require_once __DIR__ . '/../../../src/middleware/auth.php';
require_once __DIR__ . '/../../../src/utils/response.php';
require_once __DIR__ . '/../../../src/utils/validator.php';
require_once __DIR__ . '/../../../src/services/InvoiceService.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

$auth = new AuthMiddleware();
$user = $auth->requireRole([ROLE_SUPER_ADMIN, ROLE_OWNER, ROLE_STAFF]);

$data = json_decode(file_get_contents('php://input'), true);

$validator = Validator::make($data)
    ->required('invoice_id')
    ->required('amount')
    ->numeric('amount')
    ->required('method')
    ->in('method', ['bank_transfer', 'cash', 'gateway']);

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

$db = Database::getInstance()->getConnection();

try {
    $db->begin_transaction();
    
    $stmt = $db->prepare("
        SELECT i.*, i.total_amount,
               (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE invoice_id = i.id AND status = 'success') as paid_amount
        FROM invoices i
        WHERE i.id = ? AND i.tenant_id = ?
    ");
    $stmt->bind_param("ii", $data['invoice_id'], $user['tenant_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        $db->rollback();
        Response::notFound('Invoice not found');
    }
    
    $invoice = $result->fetch_assoc();
    $outstandingAmount = $invoice['total_amount'] - $invoice['paid_amount'];
    
    if ($data['amount'] > $outstandingAmount) {
        $db->rollback();
        Response::error('Payment amount exceeds outstanding balance', HTTP_BAD_REQUEST);
    }
    
    $stmt = $db->prepare("
        INSERT INTO payments (
            tenant_id, invoice_id, amount, method, transaction_reference, 
            paid_at, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, NOW(), 'success', NOW(), NOW())
    ");
    
    $transactionRef = $data['transaction_reference'] ?? null;
    
    $stmt->bind_param(
        "iidss",
        $user['tenant_id'],
        $data['invoice_id'],
        $data['amount'],
        $data['method'],
        $transactionRef
    );
    
    if (!$stmt->execute()) {
        $db->rollback();
        Response::serverError('Failed to record payment');
    }
    
    $paymentId = $db->insert_id;
    
    $invoiceService = new InvoiceService();
    $invoiceService->updateInvoiceStatus($data['invoice_id']);
    
    $logStmt = $db->prepare("
        INSERT INTO activity_logs (tenant_id, user_id, action, entity_type, entity_id, description)
        VALUES (?, ?, 'create', 'payment', ?, ?)
    ");
    $logDesc = "Recorded payment of " . $data['amount'] . " for invoice " . $invoice['invoice_number'];
    $logStmt->bind_param("iiis", $user['tenant_id'], $user['id'], $paymentId, $logDesc);
    $logStmt->execute();
    
    $db->commit();
    
    $stmt = $db->prepare("
        SELECT * FROM payments WHERE id = ?
    ");
    $stmt->bind_param("i", $paymentId);
    $stmt->execute();
    $result = $stmt->get_result();
    $payment = $result->fetch_assoc();
    
    Response::created($payment, 'Payment recorded successfully');
    
} catch (Exception $e) {
    $db->rollback();
    error_log("Error recording payment: " . $e->getMessage());
    Response::serverError('Failed to record payment');
}
