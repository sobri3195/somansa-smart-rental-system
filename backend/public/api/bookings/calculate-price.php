<?php
/**
 * Calculate Booking Price Endpoint
 * POST /api/bookings/calculate-price.php
 */

require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../config/database.php';
require_once __DIR__ . '/../../../config/constants.php';
require_once __DIR__ . '/../../../src/utils/response.php';
require_once __DIR__ . '/../../../src/utils/validator.php';
require_once __DIR__ . '/../../../src/services/BookingService.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

$data = json_decode(file_get_contents('php://input'), true);

$validator = Validator::make($data)
    ->required('unit_id')
    ->required('start_datetime')
    ->required('end_datetime');

if ($validator->fails()) {
    Response::validationError($validator->errors());
}

try {
    $bookingService = new BookingService();
    $priceCalc = $bookingService->calculatePrice(
        $data['unit_id'],
        $data['start_datetime'],
        $data['end_datetime']
    );
    
    if (!$priceCalc) {
        Response::notFound('Unit not found');
    }
    
    if (isset($data['add_ons']) && is_array($data['add_ons'])) {
        $db = Database::getInstance()->getConnection();
        $addOnTotal = 0;
        $addOnDetails = [];
        
        foreach ($data['add_ons'] as $addOn) {
            if (!isset($addOn['id']) || !isset($addOn['quantity'])) {
                continue;
            }
            
            $stmt = $db->prepare("
                SELECT id, name, price, charge_type 
                FROM add_ons 
                WHERE id = ? AND is_active = TRUE
            ");
            $stmt->bind_param("i", $addOn['id']);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows > 0) {
                $addOnData = $result->fetch_assoc();
                $quantity = intval($addOn['quantity']);
                
                $addOnPrice = 0;
                switch ($addOnData['charge_type']) {
                    case 'per_booking':
                        $addOnPrice = $addOnData['price'] * $quantity;
                        break;
                    case 'per_day':
                        $addOnPrice = $addOnData['price'] * $quantity * $priceCalc['duration_value'];
                        break;
                    case 'per_hour':
                        $hours = max(1, ($priceCalc['duration_value'] * 24));
                        $addOnPrice = $addOnData['price'] * $quantity * $hours;
                        break;
                }
                
                $addOnTotal += $addOnPrice;
                $addOnDetails[] = [
                    'id' => $addOnData['id'],
                    'name' => $addOnData['name'],
                    'quantity' => $quantity,
                    'unit_price' => $addOnData['price'],
                    'total_price' => $addOnPrice
                ];
            }
        }
        
        $priceCalc['add_ons_total'] = $addOnTotal;
        $priceCalc['add_ons'] = $addOnDetails;
        $priceCalc['total_price'] += $addOnTotal;
    }
    
    Response::success($priceCalc);
    
} catch (Exception $e) {
    error_log("Error calculating price: " . $e->getMessage());
    Response::serverError('Failed to calculate price');
}
