# Somansa API Documentation

Complete REST API documentation for the Somansa Rental System backend.

**Base URL:** `https://api.somansa.com`  
**Content-Type:** `application/json`  
**Authentication:** Bearer Token (JWT)

## Table of Contents

1. [Authentication](#authentication)
2. [Bookings](#bookings)
3. [Properties](#properties)
4. [Units](#units)
5. [Calendar](#calendar)
6. [Invoices](#invoices)
7. [Payments](#payments)
8. [Response Format](#response-format)
9. [Error Codes](#error-codes)

---

## Authentication

### Register User

Create a new customer account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+628123456789",
  "tenant_id": 1
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful. Please login.",
  "data": {
    "user": {
      "id": 5,
      "tenant_id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+628123456789",
      "role": "customer",
      "is_active": true,
      "created_at": "2024-01-15 10:30:00"
    }
  }
}
```

**Validation Rules:**
- `name`: required, string
- `email`: required, valid email, unique per tenant
- `password`: required, min 8 characters
- `phone`: required, string
- `tenant_id`: optional for customers

---

### Login

Authenticate user and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 5,
      "tenant_id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+628123456789",
      "role": "customer",
      "is_active": true
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "Bearer",
    "expires_in": 2592000
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

### Get Current User

Fetch authenticated user's information.

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 5,
      "tenant_id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+628123456789",
      "role": "customer",
      "is_active": true
    }
  }
}
```

---

## Bookings

### Create Booking

Create a new booking with automatic conflict detection.

**Endpoint:** `POST /api/bookings/create.php`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "property_id": 1,
  "unit_id": 1,
  "start_datetime": "2024-12-01 14:00:00",
  "end_datetime": "2024-12-05 12:00:00",
  "notes": "Birthday celebration",
  "special_requests": "Late check-out if possible",
  "add_ons": [
    {
      "add_on_id": 1,
      "quantity": 1,
      "unit_price": 200000
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 15,
    "booking_number": "BK-20241201-0001",
    "tenant_id": 1,
    "property_id": 1,
    "property_name": "Sunset Villa",
    "property_type": "house",
    "unit_id": 1,
    "unit_name": "Main Villa",
    "unit_code": "VILLA-001",
    "customer_id": 5,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+628123456789",
    "booking_source": "online",
    "start_datetime": "2024-12-01 14:00:00",
    "end_datetime": "2024-12-05 12:00:00",
    "duration_value": 4,
    "duration_unit": "day",
    "subtotal": 6000000,
    "tax_amount": 0,
    "discount_amount": 0,
    "deposit_amount": 3000000,
    "total_price": 6000000,
    "status": "pending_payment",
    "notes": "Birthday celebration",
    "special_requests": "Late check-out if possible",
    "add_ons": [
      {
        "id": 1,
        "add_on_id": 1,
        "add_on_name": "Extra Cleaning Service",
        "quantity": 1,
        "unit_price": 200000,
        "total_price": 200000
      }
    ],
    "created_at": "2024-01-15 10:30:00"
  }
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "error": "Unit is not available for the selected dates"
}
```

**Validation Rules:**
- `property_id`: required, integer, must exist
- `unit_id`: required, integer, must exist and belong to property
- `start_datetime`: required, datetime format (Y-m-d H:i:s)
- `end_datetime`: required, datetime, must be after start_datetime
- `notes`: optional, string
- `special_requests`: optional, string
- `add_ons`: optional, array of objects

**Business Logic:**
1. Validates unit belongs to property
2. Checks unit availability (no overlapping bookings)
3. Calculates price based on unit's pricing mode
4. Generates unique booking number
5. Calculates duration and total price
6. Creates booking with status `pending_payment`
7. Inserts add-ons if provided

---

### List Bookings

Fetch bookings with filtering and pagination.

**Endpoint:** `GET /api/bookings/list.php`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number, default 1
- `per_page` (optional): Items per page, default 20, max 100
- `property_id` (optional): Filter by property
- `unit_id` (optional): Filter by unit
- `status` (optional): Filter by status
- `start_date` (optional): Filter from date (Y-m-d)
- `end_date` (optional): Filter to date (Y-m-d)
- `search` (optional): Search by booking number or customer name
- `order_by` (optional): Sort field (created_at, start_datetime, total_price, status)
- `order_dir` (optional): Sort direction (ASC, DESC)

**Example Request:**
```
GET /api/bookings/list.php?page=1&per_page=20&status=confirmed&property_id=1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "booking_number": "BK-20241201-0001",
      "property_name": "Sunset Villa",
      "property_type": "house",
      "unit_name": "Main Villa",
      "unit_code": "VILLA-001",
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "start_datetime": "2024-12-01 14:00:00",
      "end_datetime": "2024-12-05 12:00:00",
      "total_price": 6000000,
      "status": "confirmed",
      "created_at": "2024-01-15 10:30:00"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

**Access Control:**
- Customers: Only see their own bookings
- Staff/Owner: See all bookings in their tenant
- Super Admin: Can filter by tenant_id

---

### Update Booking Status

Change booking status (e.g., check-in, check-out).

**Endpoint:** `PATCH /api/bookings/status.php?id={id}`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "checked_in"
}
```

For cancellation:
```json
{
  "status": "canceled",
  "cancellation_reason": "Customer request"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Booking status updated successfully",
  "data": {
    "id": 15,
    "status": "checked_in",
    "check_in_at": "2024-12-01 14:15:00"
  }
}
```

**Status Flow:**
- `draft` → `pending_payment` → `confirmed` → `checked_in` → `checked_out` → `completed`
- Any status → `canceled`

**Auto-timestamps:**
- `checked_in`: Sets `check_in_at` to current time
- `checked_out`: Sets `check_out_at` to current time
- `canceled`: Sets `canceled_at` to current time

---

## Calendar

### Get Calendar Events

Fetch bookings for calendar visualization (FullCalendar compatible).

**Endpoint:** `GET /api/calendar.php`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `start` (required): Start date (Y-m-d or Y-m-d H:i:s)
- `end` (required): End date (Y-m-d or Y-m-d H:i:s)
- `property_id` (optional): Filter by property
- `unit_id` (optional): Filter by unit

**Example Request:**
```
GET /api/calendar.php?start=2024-12-01&end=2024-12-31&property_id=1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "title": "Main Villa - John Doe",
      "start": "2024-12-01 14:00:00",
      "end": "2024-12-05 12:00:00",
      "backgroundColor": "#4CAF50",
      "borderColor": "#4CAF50",
      "extendedProps": {
        "booking_number": "BK-20241201-0001",
        "status": "confirmed",
        "customer_name": "John Doe",
        "customer_phone": "+628123456789",
        "unit_id": 1,
        "unit_name": "Main Villa",
        "unit_code": "VILLA-001",
        "property_id": 1,
        "property_name": "Sunset Villa",
        "property_type": "house",
        "total_price": 6000000
      }
    }
  ]
}
```

**Color Coding:**
- `pending_payment`: #FFA500 (Orange)
- `confirmed`: #4CAF50 (Green)
- `checked_in`: #2196F3 (Blue)
- `checked_out`: #9E9E9E (Gray)
- `completed`: #607D8B (Blue Gray)
- `canceled`: #F44336 (Red)

---

## Properties

### List Properties

**Endpoint:** `GET /api/properties/list.php`

**Query Parameters:**
- `type` (optional): house, kos, car
- `city` (optional): Filter by city
- `search` (optional): Search by name or address

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sunset Villa",
      "type": "house",
      "address": "Jl. Pantai Indah No. 123",
      "city": "Bali",
      "description": "Beautiful beachfront villa",
      "photos": ["url1.jpg", "url2.jpg"],
      "amenities": ["WiFi", "Pool", "Kitchen"],
      "is_active": true
    }
  ]
}
```

### Create Property

**Endpoint:** `POST /api/properties/create.php`

**Required Roles:** owner, super_admin

**Request Body:**
```json
{
  "name": "Sunset Villa",
  "type": "house",
  "address": "Jl. Pantai Indah No. 123",
  "city": "Bali",
  "state": "Bali",
  "country": "Indonesia",
  "latitude": -8.409518,
  "longitude": 115.188919,
  "description": "Beautiful beachfront villa",
  "photos": ["url1.jpg", "url2.jpg"],
  "amenities": ["WiFi", "Pool", "Kitchen"]
}
```

---

## Units

### List Units

**Endpoint:** `GET /api/units/list.php`

**Query Parameters:**
- `property_id` (optional): Filter by property
- `status` (optional): available, blocked, maintenance, occupied
- `type` (optional): room, house, car, other

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "property_id": 1,
      "property_name": "Sunset Villa",
      "name": "Main Villa",
      "code": "VILLA-001",
      "type": "house",
      "capacity": 6,
      "pricing_mode": "daily",
      "base_price": 1500000,
      "deposit_amount": 3000000,
      "status": "available",
      "facilities": ["3 Bedrooms", "2 Bathrooms"],
      "photos": ["url1.jpg"]
    }
  ]
}
```

### Create Unit

**Endpoint:** `POST /api/units/create.php`

**Required Roles:** owner, super_admin

**Request Body:**
```json
{
  "property_id": 1,
  "name": "Main Villa",
  "code": "VILLA-001",
  "type": "house",
  "capacity": 6,
  "pricing_mode": "daily",
  "base_price": 1500000,
  "deposit_amount": 3000000,
  "status": "available",
  "facilities": ["3 Bedrooms", "2 Bathrooms"],
  "photos": ["url1.jpg"],
  "description": "Spacious villa with ocean view"
}
```

**Pricing Modes:**
- `hourly`: Priced per hour
- `daily`: Priced per day (default for houses)
- `weekly`: Priced per week
- `monthly`: Priced per month (default for kos)

---

## Invoices

### List Invoices

**Endpoint:** `GET /api/invoices/list.php`

**Query Parameters:**
- `booking_id` (optional): Filter by booking
- `customer_id` (optional): Filter by customer
- `status` (optional): unpaid, partial, paid, overdue, canceled
- `month` (optional): Filter by month (1-12)
- `year` (optional): Filter by year

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "invoice_number": "INV-202412-0001",
      "booking_number": "BK-20241201-0001",
      "customer_name": "John Doe",
      "issue_date": "2024-12-01",
      "due_date": "2024-12-08",
      "subtotal": 6000000,
      "tax_amount": 0,
      "discount_amount": 0,
      "total_amount": 6000000,
      "paid_amount": 0,
      "status": "unpaid"
    }
  ]
}
```

### Create Invoice

**Endpoint:** `POST /api/invoices/create.php`

**Required Roles:** staff, owner, super_admin

**Request Body:**
```json
{
  "booking_id": 15,
  "due_date": "2024-12-08",
  "notes": "First month payment"
}
```

For recurring (monthly kos):
```json
{
  "booking_id": 15,
  "generate_recurring": true
}
```

---

## Payments

### Record Payment

**Endpoint:** `POST /api/payments/create.php`

**Required Roles:** staff, owner, super_admin

**Request Body:**
```json
{
  "invoice_id": 10,
  "amount": 6000000,
  "method": "bank_transfer",
  "transaction_reference": "TRX123456",
  "payment_proof_url": "https://...",
  "paid_at": "2024-12-01 15:30:00",
  "notes": "Paid via BCA"
}
```

**Payment Methods:**
- `cash`
- `bank_transfer`
- `credit_card`
- `debit_card`
- `e_wallet`
- `gateway`
- `other`

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Payment recorded successfully",
  "data": {
    "id": 5,
    "payment_number": "PAY-20241201-0001",
    "invoice_id": 10,
    "invoice_number": "INV-202412-0001",
    "amount": 6000000,
    "method": "bank_transfer",
    "paid_at": "2024-12-01 15:30:00",
    "status": "success"
  }
}
```

**Auto-actions:**
1. Updates invoice `paid_amount`
2. Updates invoice status (paid/partial/unpaid)
3. If invoice fully paid, updates booking status to `confirmed`

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Optional success message",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": {
    // Optional error details (e.g., validation errors)
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

---

## Error Codes

| HTTP Code | Meaning |
|-----------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource conflict (e.g., double booking) |
| 422 | Unprocessable Entity - Validation failed |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

Currently not implemented. Recommended to add:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## CORS

Allowed origins configured in `backend/config/cors.php`:
- Development: `http://localhost:5173`
- Production: Your Netlify domain

Allowed methods: `GET, POST, PUT, DELETE, OPTIONS, PATCH`

---

## Webhooks (Future)

For payment gateway integration:

**Endpoint:** `POST /api/webhooks/payment`

Will handle callbacks from payment gateways (Midtrans, Xendit, etc.)

---

## Testing

Use tools like:
- **Postman** - Import API collection
- **cURL** - Command-line testing
- **Insomnia** - API client

Example cURL:

```bash
# Login
curl -X POST https://api.somansa.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"password"}'

# Get bookings
curl -X GET https://api.somansa.com/api/bookings/list.php \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Support

For API support:
- 📧 Email: api-support@somansa.com
- 📚 Docs: https://docs.somansa.com
- 🐛 Issues: https://github.com/somansa/issues
