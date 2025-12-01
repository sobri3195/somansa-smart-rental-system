# Database Documentation

## Overview

This directory contains the database schema and configuration files for the Somansa Smart Rental System. 

**IMPORTANT**: These files are **NOT CONNECTED** to the application. They serve as reference documentation for the database structure and are provided for future backend integration.

## Files

### 1. `schema.sql`
Complete MySQL database schema including:
- **Tables**: 15+ tables covering properties, bookings, users, admin, analytics, reviews, etc.
- **Indexes**: Optimized indexes for performance
- **Views**: Pre-built views for common queries
- **Stored Procedures**: Business logic procedures
- **Triggers**: Automated data integrity checks
- **Demo Data**: Sample records for testing

### 2. `config.php`
MySQLi configuration and helper functions:
- Database connection settings
- Query helper functions
- Sample query examples
- Demo admin credentials

## Database Tables

### Core Tables
- `properties` - Property listings
- `units` - Individual rental units
- `bookings` - Booking records
- `availability` - Unit availability calendar
- `users` - Customer accounts
- `admin_users` - Admin accounts (includes demo)

### Support Tables
- `categories` - Property categories
- `amenities` - Available amenities
- `property_amenities` - Many-to-many relationship
- `property_images` - Property photos
- `invoices` - Booking invoices
- `invoice_items` - Invoice line items
- `price_alerts` - Price alert subscriptions
- `analytics_events` - User activity tracking
- `reviews` - Property reviews and ratings

## Demo Admin Account

**Username**: `demo_admin`  
**Email**: `admin@somansa.demo`  
**Role**: `super_admin`  
**Is Demo**: `true`

## Database Setup (For Future Use)

If you want to set up the database for backend integration:

### Step 1: Create Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE somansa_rental_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'somansa_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON somansa_rental_db.* TO 'somansa_user'@'localhost';
FLUSH PRIVILEGES;
```

### Step 2: Import Schema
```bash
mysql -u somansa_user -p somansa_rental_db < schema.sql
```

### Step 3: Verify Installation
```sql
USE somansa_rental_db;
SHOW TABLES;
SELECT * FROM admin_users WHERE is_demo = 1;
```

## Performance Optimizations

The schema includes several optimizations:

1. **Indexes**: Composite and single-column indexes on frequently queried fields
2. **Full-Text Search**: Enabled on properties and units for fast text search
3. **Views**: Pre-computed views for complex queries
4. **Stored Procedures**: Reusable business logic
5. **Triggers**: Automated data updates
6. **Query Cache**: Enabled for repeated queries
7. **InnoDB Engine**: ACID compliance and row-level locking

## API Integration (Future)

When integrating with a backend API, the following endpoints should be implemented:

### Properties
- `GET /api/properties` - List properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (admin)
- `PUT /api/properties/:id` - Update property (admin)
- `DELETE /api/properties/:id` - Delete property (admin)

### Bookings
- `GET /api/bookings` - List bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `GET /api/bookings/lookup/:code` - Lookup by code

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/analytics` - Analytics data
- `GET /api/admin/bookings` - Admin booking management
- `GET /api/admin/properties` - Admin property management

## Security Considerations

### For Production Use:
1. Change default credentials in `config.php`
2. Use environment variables for sensitive data
3. Enable SSL/TLS for database connections
4. Implement prepared statements for all queries
5. Add rate limiting for API endpoints
6. Implement proper authentication and authorization
7. Regular backups and disaster recovery plan
8. SQL injection prevention (prepared statements)
9. XSS and CSRF protection
10. Input validation and sanitization

## Migration Scripts

For database migrations, consider using:
- **Laravel Migrations** (PHP)
- **Sequelize** (Node.js)
- **Alembic** (Python)
- **Flyway** (Java)

## Backup Strategy

Recommended backup strategy:
1. **Daily**: Automated full database backup
2. **Hourly**: Incremental backups
3. **Real-time**: Binary log replication
4. **Retention**: 30 days minimum

## Monitoring

Monitor these metrics:
- Query response times
- Connection pool usage
- Slow query log
- Disk space usage
- Index efficiency
- Replication lag (if applicable)

## Current Application Status

**The React application currently:**
- Uses mock API data (no real backend)
- All data is hardcoded or generated in the frontend
- No authentication required (demo mode)
- No database connection

**For production deployment, you would need to:**
1. Set up MySQL database using `schema.sql`
2. Create backend API (PHP, Node.js, Python, etc.)
3. Connect frontend to real API endpoints
4. Implement authentication and authorization
5. Deploy database and API to production servers

## Support

For questions about the database schema or integration, refer to:
- `API_EXAMPLES.md` - API endpoint examples
- `ARCHITECTURE.md` - System architecture
- `DEPLOYMENT.md` - Deployment guide

## License

This database schema is part of the Somansa Smart Rental System project.
