# API Examples - Mock Data for Testing

This document provides example API responses that the Somansa frontend expects. Use this for testing, mocking, or implementing the backend API.

## Properties API

### GET /api/properties

**Query Parameters:**
- `type` (optional): house | kos | car
- `city` (optional): string
- `minPrice` (optional): number
- `maxPrice` (optional): number

**Response:**
```json
[
  {
    "id": "prop-1",
    "name": "Modern Family House in Jakarta",
    "type": "house",
    "city": "Jakarta",
    "address": "Jl. Sudirman No. 123, Jakarta Selatan",
    "description": "Beautiful 3-bedroom house with modern amenities, spacious living area, and private garden.",
    "image": "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    "images": [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be"
    ],
    "facilities": ["WiFi", "Parking", "Air Conditioning", "Kitchen", "Garden"],
    "startingPrice": 5000000
  },
  {
    "id": "prop-2",
    "name": "Cozy Kos near University",
    "type": "kos",
    "city": "Bandung",
    "address": "Jl. Dago No. 45, Bandung",
    "description": "Affordable boarding house for students, 5 minutes walk to ITB campus.",
    "image": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    "images": ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
    "facilities": ["WiFi", "Shared Kitchen", "Laundry", "24/7 Security"],
    "startingPrice": 1500000
  },
  {
    "id": "prop-3",
    "name": "Toyota Avanza 2022",
    "type": "car",
    "city": "Surabaya",
    "address": "Jl. Ahmad Yani, Surabaya",
    "description": "Well-maintained 7-seater MPV, perfect for family trips.",
    "image": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
    "images": ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2"],
    "facilities": ["GPS", "Insurance", "24/7 Support", "Driver Available"],
    "startingPrice": 350000
  }
]
```

### GET /api/properties/:id

**Response:**
```json
{
  "id": "prop-1",
  "name": "Modern Family House in Jakarta",
  "type": "house",
  "city": "Jakarta",
  "address": "Jl. Sudirman No. 123, Jakarta Selatan 12190",
  "description": "Beautiful 3-bedroom house with modern amenities. This spacious property features a large living room, fully equipped kitchen, private garden, and parking for 2 cars. Located in a quiet neighborhood with easy access to schools, shopping centers, and public transportation.",
  "image": "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
  "images": [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
  ],
  "facilities": [
    "WiFi",
    "Parking",
    "Air Conditioning",
    "Full Kitchen",
    "Private Garden",
    "Security",
    "Laundry Room"
  ],
  "startingPrice": 5000000,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### GET /api/properties/:id/units

**Response:**
```json
[
  {
    "id": "unit-1",
    "propertyId": "prop-1",
    "name": "Main House",
    "number": "A1",
    "description": "Complete house with 3 bedrooms, 2 bathrooms",
    "capacity": 6,
    "size": 120,
    "price": 5000000,
    "facilities": ["WiFi", "Kitchen", "Parking", "AC"],
    "isAvailable": true
  },
  {
    "id": "unit-2",
    "propertyId": "prop-2",
    "name": "Room 101",
    "number": "101",
    "description": "Single room with private bathroom",
    "capacity": 1,
    "size": 12,
    "price": 1500000,
    "facilities": ["WiFi", "Private Bathroom", "Bed", "Desk"],
    "isAvailable": true
  },
  {
    "id": "unit-3",
    "propertyId": "prop-2",
    "name": "Room 102",
    "number": "102",
    "description": "Double room with shared bathroom",
    "capacity": 2,
    "size": 16,
    "price": 2500000,
    "facilities": ["WiFi", "Shared Bathroom", "2 Beds", "Desk"],
    "isAvailable": false
  }
]
```

## Bookings API

### GET /api/bookings

**Query Parameters:**
- `status` (optional): pending | confirmed | cancelled | completed
- `propertyId` (optional): string
- `limit` (optional): number
- `offset` (optional): number

**Response:**
```json
[
  {
    "id": "booking-1",
    "code": "BK12345",
    "propertyId": "prop-1",
    "propertyName": "Modern Family House in Jakarta",
    "propertyType": "house",
    "unitId": "unit-1",
    "unitName": "Main House",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "+62 812 3456 7890",
    "startDate": "2024-02-01T00:00:00Z",
    "endDate": "2024-02-28T00:00:00Z",
    "duration": 27,
    "totalPrice": 5000000,
    "status": "confirmed",
    "paymentStatus": "paid",
    "notes": "Early check-in requested",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": "booking-2",
    "code": "BK12346",
    "propertyId": "prop-3",
    "propertyName": "Toyota Avanza 2022",
    "propertyType": "car",
    "unitId": null,
    "unitName": null,
    "guestName": "Jane Smith",
    "guestEmail": "jane@example.com",
    "guestPhone": "+62 813 9876 5432",
    "startDate": "2024-02-10T08:00:00Z",
    "endDate": "2024-02-12T18:00:00Z",
    "duration": 3,
    "totalPrice": 1050000,
    "status": "pending",
    "paymentStatus": "pending",
    "notes": "Need driver for airport transfer",
    "createdAt": "2024-01-16T14:20:00Z",
    "updatedAt": "2024-01-16T14:20:00Z"
  }
]
```

### GET /api/bookings/:id

**Response:**
```json
{
  "id": "booking-1",
  "code": "BK12345",
  "propertyId": "prop-1",
  "propertyName": "Modern Family House in Jakarta",
  "propertyType": "house",
  "unitId": "unit-1",
  "unitName": "Main House",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+62 812 3456 7890",
  "startDate": "2024-02-01T00:00:00Z",
  "endDate": "2024-02-28T00:00:00Z",
  "duration": 27,
  "totalPrice": 5000000,
  "status": "confirmed",
  "paymentStatus": "paid",
  "notes": "Early check-in requested",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### POST /api/bookings

**Request Body:**
```json
{
  "property_id": "prop-1",
  "unit_id": "unit-1",
  "start_date": "2024-03-01T00:00:00Z",
  "end_date": "2024-03-31T00:00:00Z",
  "guest_name": "Alice Johnson",
  "guest_email": "alice@example.com",
  "guest_phone": "+62 811 2233 4455",
  "notes": "Will arrive late on first day"
}
```

**Response (201 Created):**
```json
{
  "id": "booking-3",
  "code": "BK12347",
  "propertyId": "prop-1",
  "propertyName": "Modern Family House in Jakarta",
  "propertyType": "house",
  "unitId": "unit-1",
  "unitName": "Main House",
  "guestName": "Alice Johnson",
  "guestEmail": "alice@example.com",
  "guestPhone": "+62 811 2233 4455",
  "startDate": "2024-03-01T00:00:00Z",
  "endDate": "2024-03-31T00:00:00Z",
  "duration": 30,
  "totalPrice": 5000000,
  "status": "pending",
  "paymentStatus": "pending",
  "notes": "Will arrive late on first day",
  "createdAt": "2024-01-17T09:15:00Z",
  "updatedAt": "2024-01-17T09:15:00Z"
}
```

### GET /api/bookings/lookup/:code

**Example: GET /api/bookings/lookup/BK12345**

**Response:**
```json
{
  "id": "booking-1",
  "code": "BK12345",
  "propertyId": "prop-1",
  "propertyName": "Modern Family House in Jakarta",
  "propertyType": "house",
  "unitId": "unit-1",
  "unitName": "Main House",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+62 812 3456 7890",
  "startDate": "2024-02-01T00:00:00Z",
  "endDate": "2024-02-28T00:00:00Z",
  "duration": 27,
  "totalPrice": 5000000,
  "status": "confirmed",
  "paymentStatus": "paid",
  "notes": "Early check-in requested",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Response (404):**
```json
{
  "error": "Booking not found",
  "message": "No booking found with code: BK99999"
}
```

## Availability API

### GET /api/availability/:propertyId/:unitId

**Query Parameters:**
- `start`: YYYY-MM-DD (required)
- `end`: YYYY-MM-DD (required)

**Example: GET /api/availability/prop-1/unit-1?start=2024-02-01&end=2024-02-28**

**Response:**
```json
{
  "propertyId": "prop-1",
  "unitId": "unit-1",
  "startDate": "2024-02-01",
  "endDate": "2024-02-28",
  "isAvailable": false,
  "bookedDates": [
    {
      "startDate": "2024-02-01",
      "endDate": "2024-02-28",
      "bookingId": "booking-1",
      "bookingCode": "BK12345"
    }
  ],
  "availableDates": []
}
```

**When Available:**
```json
{
  "propertyId": "prop-1",
  "unitId": "unit-1",
  "startDate": "2024-03-01",
  "endDate": "2024-03-31",
  "isAvailable": true,
  "bookedDates": [],
  "availableDates": [
    {
      "startDate": "2024-03-01",
      "endDate": "2024-03-31"
    }
  ]
}
```

## Invoices API

### GET /api/invoices/:bookingId

**Example: GET /api/invoices/booking-1**

**Response:**
```json
{
  "id": "invoice-1",
  "invoiceNumber": "INV-2024-001",
  "bookingId": "booking-1",
  "bookingCode": "BK12345",
  "issueDate": "2024-01-15T10:30:00Z",
  "dueDate": "2024-01-20T23:59:59Z",
  "amount": 5000000,
  "currency": "IDR",
  "status": "paid",
  "paidAt": "2024-01-16T08:15:00Z",
  "items": [
    {
      "description": "Rental - Main House (Feb 1-28, 2024)",
      "quantity": 1,
      "unitPrice": 5000000,
      "total": 5000000
    }
  ],
  "subtotal": 5000000,
  "tax": 0,
  "total": 5000000
}
```

**Error Response (404):**
```json
{
  "error": "Invoice not found",
  "message": "No invoice found for booking: booking-999"
}
```

## Error Responses

All endpoints should return consistent error responses:

### 400 Bad Request
```json
{
  "error": "Validation error",
  "message": "Invalid request parameters",
  "details": {
    "guest_email": "Invalid email format",
    "start_date": "Start date must be in the future"
  }
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## CORS Configuration

The API must enable CORS to allow requests from the frontend domain:

```javascript
// Express.js example
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-netlify-domain.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

## Testing with Mock Server

You can use tools like:
- **json-server**: Quick REST API from JSON file
- **MSW (Mock Service Worker)**: Intercept requests in the browser
- **Mirage JS**: API mocking library

Example json-server setup:

```bash
npm install -g json-server
```

Create `db.json` with the mock data above, then run:

```bash
json-server --watch db.json --port 3000
```

Set in `.env`:
```
VITE_API_BASE_URL=http://localhost:3000
```
