# Somansa API Endpoints Reference

## Complete List of Available Endpoints

### Authentication (3 endpoints)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login (returns JWT token)
- `GET /api/auth/me` - Get current authenticated user

### Properties (5 endpoints)
- `GET /api/properties/list.php` - List all properties with filters
- `POST /api/properties/create.php` - Create new property
- `GET /api/properties/detail.php?id={id}` - Get property details
- `PUT /api/properties/update.php?id={id}` - Update property
- `DELETE /api/properties/delete.php?id={id}` - Delete property

### Units (5 endpoints)
- `GET /api/units/list.php` - List all units with filters
- `POST /api/units/create.php` - Create new unit
- `GET /api/units/detail.php?id={id}` - Get unit details
- `PUT /api/units/update.php?id={id}` - Update unit
- `DELETE /api/units/delete.php?id={id}` - Delete unit

### Bookings (8 endpoints)
- `GET /api/bookings/list.php` - List all bookings with filters
- `POST /api/bookings/create.php` - Create new booking
- `GET /api/bookings/detail.php?id={id}` - Get booking details
- `PUT /api/bookings/update.php?id={id}` - Update booking
- `PATCH /api/bookings/update-status.php?id={id}` - Update booking status
- `DELETE /api/bookings/delete.php?id={id}` - Cancel booking
- `GET /api/bookings/availability.php` - Check unit availability
- `POST /api/bookings/calculate-price.php` - Calculate booking price

### Calendar (1 endpoint)
- `GET /api/calendar.php` - Get calendar events (FullCalendar compatible)

### Invoices (2 endpoints)
- `GET /api/invoices/list.php` - List all invoices with filters
- `GET /api/invoices/detail.php?id={id}` - Get invoice details with payments

### Payments (2 endpoints)
- `POST /api/payments/create.php` - Record new payment
- `GET /api/payments/list.php` - List all payments with filters

---

## Total: 26 API Endpoints

## Authentication
All endpoints (except auth endpoints) require a JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

## Role-Based Access Control

### Super Admin
- Full access to all endpoints across all tenants

### Owner
- Full access to their tenant's data
- Can create/update/delete properties, units, bookings
- Can manage staff and customers
- Can view all reports

### Staff
- Can create/update bookings
- Can record payments
- Can view properties and units
- Cannot delete major resources

### Customer
- Can register and login
- Can create their own bookings
- Can view their own bookings and invoices
- Cannot access other customers' data
- Cannot access admin endpoints

## Request Methods
- `GET` - Retrieve data (read-only)
- `POST` - Create new resource
- `PUT` - Update existing resource (full update)
- `PATCH` - Partial update of resource
- `DELETE` - Delete or cancel resource

## Response Format
All endpoints return JSON in this format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

## Common Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 20, max: 100)

### Filtering
- `status` - Filter by status
- `type` - Filter by type
- `property_id` - Filter by property
- `unit_id` - Filter by unit
- `customer_id` - Filter by customer
- `search` - Search in text fields

### Sorting
- Most endpoints return data sorted by `created_at DESC` by default

## HTTP Status Codes
- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., booking overlap)
- `422 Unprocessable Entity` - Validation failed
- `500 Internal Server Error` - Server error

## CORS Configuration
The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative dev port)
- `https://*.netlify.app` (Netlify deployments)
- Custom domain configured in `FRONTEND_URL` environment variable

## Rate Limiting
Currently no rate limiting is implemented. For production use, consider implementing rate limiting to prevent abuse.

## Caching
- GET requests can be cached on the client side
- Use appropriate cache headers in production
- Real-time data (calendar, availability) should have short cache times

## Testing Endpoints

### Using curl
```bash
# Login
curl -X POST http://api.somansa.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@demorental.com","password":"password"}'

# Get properties (with token)
curl -X GET http://api.somansa.com/api/properties/list.php \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman
1. Import the API base URL
2. Set up authentication with Bearer token
3. Test each endpoint with sample data
4. Verify responses match expected format

---

**Note**: For detailed request/response examples for each endpoint, refer to `API_DOCUMENTATION.md`.

**Version**: 1.0.0  
**Last Updated**: November 29, 2024
