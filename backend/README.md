# Somansa Rental System - Backend API

Pure PHP backend with MySQLi for the Somansa Smart Rental System.

## Tech Stack

- **PHP 7.4+** (pure PHP, no framework)
- **MySQLi** for database operations
- **MySQL 5.7+** or **MariaDB 10.3+**
- **JWT** for authentication (custom implementation)

## Project Structure

```
backend/
├── config/
│   ├── database.php       # MySQLi connection singleton
│   ├── constants.php      # Application constants
│   └── cors.php           # CORS configuration
├── src/
│   ├── middleware/
│   │   └── auth.php       # Authentication middleware
│   ├── services/
│   │   ├── BookingService.php   # Booking business logic
│   │   └── InvoiceService.php   # Invoice and payment logic
│   └── utils/
│       ├── response.php   # API response helper
│       └── validator.php  # Input validation
├── public/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── bookings/      # Booking endpoints
│   │   └── calendar.php   # Calendar endpoint
│   └── index.php          # API info page
├── database/
│   ├── schema.sql         # Complete database schema
│   └── seeds.sql          # Sample data
├── .htaccess              # Apache rewrite rules
└── README.md
```

## Installation

### 1. Database Setup

```bash
# Create database
mysql -u root -p

CREATE DATABASE somansa_rental CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE somansa_rental;

# Import schema
SOURCE database/schema.sql;

# Import sample data (optional)
SOURCE database/seeds.sql;

# Create database user
CREATE USER 'somansa_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON somansa_rental.* TO 'somansa_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Environment Configuration

Create a `.env` file or set environment variables:

```env
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=somansa_rental
DB_USERNAME=somansa_user
DB_PASSWORD=your_secure_password

JWT_SECRET=your-secret-key-min-32-characters-long

APP_ENV=production
FRONTEND_URL=https://your-app.netlify.app
```

For Apache, you can set these in `.htaccess`:

```apache
SetEnv DB_HOST localhost
SetEnv DB_DATABASE somansa_rental
SetEnv DB_USERNAME somansa_user
SetEnv DB_PASSWORD your_secure_password
SetEnv JWT_SECRET your-secret-key
```

### 3. Web Server Configuration

#### Apache

Ensure `mod_rewrite` is enabled:

```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

Point your virtual host to the `public` directory:

```apache
<VirtualHost *:80>
    ServerName api.somansa.com
    DocumentRoot /path/to/backend/public
    
    <Directory /path/to/backend/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/somansa_error.log
    CustomLog ${APACHE_LOG_DIR}/somansa_access.log combined
</VirtualHost>
```

#### Nginx

```nginx
server {
    listen 80;
    server_name api.somansa.com;
    root /path/to/backend/public;
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\.(env|sql|md) {
        deny all;
    }
}
```

### 4. CORS Configuration

Edit `config/cors.php` to add your Netlify domain:

```php
$allowedOrigins = [
    'http://localhost:5173',
    'https://your-app.netlify.app',
    getenv('FRONTEND_URL')
];
```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+628123456789",
  "tenant_id": 1
}
```

Response:
```json
{
  "success": true,
  "message": "Registration successful",
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

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
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
      "role": "customer"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "Bearer",
    "expires_in": 2592000
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Bookings

#### Create Booking
```http
POST /api/bookings/create.php
Authorization: Bearer {token}
Content-Type: application/json

{
  "property_id": 1,
  "unit_id": 1,
  "start_datetime": "2024-12-01 14:00:00",
  "end_datetime": "2024-12-05 12:00:00",
  "notes": "Birthday celebration",
  "special_requests": "Late check-out if possible"
}
```

#### List Bookings
```http
GET /api/bookings/list.php?page=1&per_page=20&status=confirmed
Authorization: Bearer {token}
```

Query parameters:
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 20, max: 100)
- `status` - Filter by status
- `property_id` - Filter by property
- `unit_id` - Filter by unit
- `start_date` - Filter from date (Y-m-d)
- `end_date` - Filter to date (Y-m-d)
- `search` - Search by booking number or customer name

### Calendar

#### Get Calendar Data
```http
GET /api/calendar.php?start=2024-12-01&end=2024-12-31&property_id=1
Authorization: Bearer {token}
```

Query parameters:
- `start` - Start date (required)
- `end` - End date (required)
- `property_id` - Filter by property (optional)
- `unit_id` - Filter by unit (optional)

Returns FullCalendar-compatible event format.

## Security Features

### Authentication

- JWT-based token authentication
- Password hashing with bcrypt
- Token expiration (30 days default)
- Role-based access control (RBAC)

### SQL Injection Prevention

- All queries use prepared statements with MySQLi
- Input validation on all endpoints
- Parameter binding for all user inputs

### CORS Protection

- Whitelist of allowed origins
- Proper preflight handling
- Credentials support

### Additional Security

- HTTPS recommended for production
- Rate limiting (implement using middleware)
- Activity logging for audit trail
- Session management

## Default Credentials (Sample Data)

After running `seeds.sql`:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@somansa.com | password |
| Owner | owner@demorental.com | password |
| Staff | staff@demorental.com | password |
| Customer | customer@example.com | password |

⚠️ **Change these in production!**

## Booking Conflict Detection

The `BookingService` automatically checks for overlapping bookings:

```php
// Detects conflicts when:
// 1. New booking starts during existing booking
// 2. New booking ends during existing booking
// 3. New booking completely overlaps existing booking
```

## Recurring Invoices (Kos/Boarding)

For monthly bookings, invoices are generated automatically:

```php
$invoiceService = new InvoiceService();
$invoices = $invoiceService->generateRecurringInvoices($bookingId);
```

## Extending the API

### Adding New Endpoints

1. Create PHP file in `public/api/`
2. Include required files:
   ```php
   require_once __DIR__ . '/../../config/cors.php';
   require_once __DIR__ . '/../../config/database.php';
   require_once __DIR__ . '/../../src/middleware/auth.php';
   require_once __DIR__ . '/../../src/utils/response.php';
   ```
3. Implement logic with proper error handling
4. Use `Response` helper for consistent responses

### Adding New Services

Create service class in `src/services/`:

```php
<?php
require_once __DIR__ . '/../../config/database.php';

class MyService {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function myMethod() {
        // Business logic here
    }
}
```

## Error Handling

All API responses follow this format:

Success:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error:
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

## Performance Tips

1. **Database Indexing**: All foreign keys and frequently queried fields are indexed
2. **Connection Pooling**: Use persistent connections in production
3. **Query Optimization**: Use EXPLAIN to optimize slow queries
4. **Caching**: Implement Redis/Memcached for frequently accessed data
5. **CDN**: Serve static assets via CDN

## Deployment

### Shared Hosting

1. Upload files via FTP/SFTP
2. Import database via phpMyAdmin
3. Configure environment variables in `.htaccess`
4. Ensure `public` is web root

### VPS/Cloud (Ubuntu)

```bash
# Install dependencies
sudo apt update
sudo apt install apache2 php php-mysqli mysql-server

# Configure Apache
sudo cp somansa.conf /etc/apache2/sites-available/
sudo a2ensite somansa
sudo a2enmod rewrite
sudo systemctl restart apache2

# Set permissions
sudo chown -R www-data:www-data /var/www/somansa
sudo chmod -R 755 /var/www/somansa
```

## Troubleshooting

### CORS Errors

- Check allowed origins in `config/cors.php`
- Ensure `Authorization` header is in allowed headers
- Verify preflight OPTIONS requests return 200

### Database Connection Failed

- Verify MySQL service is running
- Check credentials in environment variables
- Ensure database exists and user has permissions

### Token Invalid/Expired

- Tokens expire after 30 days by default
- Generate new token via `/api/auth/login`
- Check JWT_SECRET is consistent

## License

Proprietary - Somansa Rental System

## Support

For support, contact: support@somansa.com
