# Somansa - Smart Rental Management System

Complete rental management solution for houses, boarding rooms (kos), and vehicles, built with **React (Netlify)** + **PHP (MySQLi)** + **MySQL**.

![Architecture](https://img.shields.io/badge/Frontend-React%20%2B%20Netlify-61DAFB?logo=react)
![Backend](https://img.shields.io/badge/Backend-PHP%20%2B%20MySQLi-777BB4?logo=php)
![Database](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql)

## 🎯 Overview

Somansa is a comprehensive rental management system designed for:

- **Houses & Villas** - Daily/weekly/monthly rentals
- **Boarding Rooms (Kos)** - Monthly rentals with recurring billing
- **Cars & Vehicles** - Hourly/daily rentals with optional driver

### Key Features

✅ **Multi-Property & Multi-Unit Management**  
✅ **Real-Time Booking Calendar** with conflict detection  
✅ **Automatic Invoice Generation** including recurring monthly invoices  
✅ **WhatsApp Notifications** for bookings, payments, reminders  
✅ **PWA (Progressive Web App)** - Install as mobile/desktop app  
✅ **Multi-Tenant SaaS** support (optional)  
✅ **Role-Based Access Control** (Super Admin, Owner, Staff, Customer)  
✅ **Netlify Deployment** for frontend (static hosting)  
✅ **RESTful API** with MySQLi (no framework)  

## 🏗️ Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│                     │         │                     │
│  React Frontend     │◄────────┤  PHP Backend API    │
│  (Netlify)          │  HTTPS  │  (VPS/Hosting)      │
│                     │         │                     │
│  - PWA              │         │  - MySQLi           │
│  - React Router     │         │  - JWT Auth         │
│  - React Query      │         │  - CORS Enabled     │
│  - Tailwind CSS     │         │  - RESTful          │
│                     │         │                     │
└─────────────────────┘         └──────────┬──────────┘
                                           │
                                           ▼
                                ┌─────────────────────┐
                                │                     │
                                │   MySQL Database    │
                                │                     │
                                │  - 12 Tables        │
                                │  - Indexed          │
                                │  - Normalized       │
                                │                     │
                                └─────────────────────┘
```

## 📁 Project Structure

```
somansa/
├── backend/              # PHP API Backend
│   ├── config/           # Database, CORS, constants
│   ├── src/
│   │   ├── middleware/   # Auth middleware
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helpers (Response, Validator)
│   ├── public/
│   │   ├── api/          # API endpoints
│   │   └── index.php     # Entry point
│   ├── database/
│   │   ├── schema.sql    # Complete DDL
│   │   └── seeds.sql     # Sample data
│   └── README.md
│
├── frontend/             # React Frontend
│   ├── public/
│   │   ├── _redirects    # Netlify routing
│   │   └── manifest.json # PWA manifest
│   ├── src/
│   │   ├── api/          # API client layer
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # React contexts
│   │   ├── pages/        # Page components
│   │   ├── router/       # Routing config
│   │   └── App.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- **Backend**: PHP 7.4+, MySQL 5.7+, Apache/Nginx
- **Frontend**: Node.js 18+, npm
- **Deployment**: Netlify account (free tier works)

### 1. Database Setup

```bash
# Create database
mysql -u root -p

CREATE DATABASE somansa_rental CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE somansa_rental;

# Import schema
SOURCE backend/database/schema.sql;

# Import sample data (optional)
SOURCE backend/database/seeds.sql;
```

### 2. Backend Setup

```bash
cd backend

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# For Apache, ensure mod_rewrite is enabled
sudo a2enmod rewrite
sudo systemctl restart apache2

# Point DocumentRoot to backend/public/
```

Update `backend/config/cors.php` with your Netlify domain.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your backend API URL

# Development
npm run dev

# Build for production
npm run build
```

### 4. Deploy to Netlify

**Via Git (Recommended):**

1. Push to GitHub/GitLab
2. Connect repository to Netlify
3. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. Set environment variable: `VITE_API_BASE_URL`
5. Deploy!

**Manual:**

```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

## 🗄️ Database Schema

### Core Tables

1. **tenants** - Multi-tenant support
2. **users** - Multi-role users (super_admin, owner, staff, customer)
3. **properties** - Properties (houses, kos, car locations)
4. **units** - Individual units (rooms, houses, cars)
5. **bookings** - Reservations with conflict detection
6. **invoices** - Manual and recurring invoices
7. **payments** - Payment records
8. **add_ons** - Extra services/items
9. **booking_add_ons** - Many-to-many relationship
10. **notifications** - WhatsApp/Email/SMS logs
11. **settings** - Tenant-specific settings
12. **activity_logs** - Audit trail

See `backend/database/schema.sql` for complete DDL.

## 🔐 Authentication & Authorization

### Roles

- **Super Admin** - Manage all tenants, global access
- **Owner** - Manage their tenant's properties, bookings, invoices
- **Staff** - Create/manage bookings, check-ins, payments
- **Customer** - Make bookings, view invoices, payment history

### Token-Based Auth

- JWT tokens (custom implementation in PHP)
- 30-day expiration
- Stored in localStorage (consider httpOnly cookies for production)
- Auto-logout on 401 response

### Protected Routes

Frontend uses route guards based on user role:

```jsx
<ProtectedRoute requiredRoles={['owner', 'staff']}>
  <AdminDashboard />
</ProtectedRoute>
```

Backend checks roles on every API endpoint:

```php
$auth = new AuthMiddleware();
$user = $auth->requireRole(['owner', 'staff']);
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new customer |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user info |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings/list.php` | List bookings with filters |
| POST | `/api/bookings/create.php` | Create new booking |
| GET | `/api/bookings/detail.php?id={id}` | Get booking details |
| PUT | `/api/bookings/update.php?id={id}` | Update booking |
| PATCH | `/api/bookings/status.php?id={id}` | Update status |

### Calendar

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/calendar.php?start=...&end=...` | Get calendar events |

### Properties & Units

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties/list.php` | List properties |
| POST | `/api/properties/create.php` | Create property |
| GET | `/api/units/list.php` | List units |
| POST | `/api/units/create.php` | Create unit |

See `backend/README.md` for complete API documentation.

## 🎨 Frontend Pages

### Public Routes

- `/` - Home page with hero and features
- `/properties` - Browse available properties
- `/properties/:id` - Property details and booking form
- `/login` - User login
- `/register` - Customer registration

### Customer Routes

- `/customer/dashboard` - Overview, stats
- `/customer/bookings` - Booking history
- `/customer/bookings/:id` - Booking details
- `/customer/invoices` - Invoices and payments

### Admin Routes

- `/admin/dashboard` - Admin overview, stats
- `/admin/properties` - Property management
- `/admin/units` - Unit management
- `/admin/bookings` - Booking management
- `/admin/calendar` - Visual booking calendar
- `/admin/invoices` - Invoice and payment tracking
- `/admin/customers` - Customer management
- `/admin/settings` - Tenant settings

## 🔔 WhatsApp Notifications

Configure WhatsApp API in settings:

```php
// In settings table
'whatsapp_api_url' => 'https://api.whatsapp.com/...'
'whatsapp_api_token' => 'your_token'
'whatsapp_sender_number' => '+628...'
```

Auto-send notifications for:

- ✉️ New booking created
- 💳 Payment received → booking confirmed
- ⏰ Reminder before check-in/check-out
- 📅 Monthly invoice created (kos)
- ⚠️ Upcoming due date
- 🔴 Overdue invoice

## 🔄 Recurring Invoices (Kos/Boarding)

For monthly bookings:

```php
$invoiceService = new InvoiceService();
$invoices = $invoiceService->generateRecurringInvoices($bookingId);
```

Automatically generates invoices for each month of the contract period.

## 🛡️ Security Features

- ✅ SQL injection prevention (prepared statements)
- ✅ Password hashing (bcrypt)
- ✅ JWT token authentication
- ✅ CORS protection
- ✅ Input validation
- ✅ Role-based access control
- ✅ Activity logging
- ✅ HTTPS recommended

## 📱 PWA Features

- ✅ Installable on mobile and desktop
- ✅ Offline support for static assets
- ✅ Service worker caching
- ✅ App manifest
- ✅ Fast loading with code splitting

## 🧪 Default Test Credentials

After running `seeds.sql`:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@somansa.com | password |
| Owner | owner@demorental.com | password |
| Staff | staff@demorental.com | password |
| Customer | customer@example.com | password |

⚠️ **Change these in production!**

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env` or set in Apache/Nginx:

```env
DB_HOST=localhost
DB_DATABASE=somansa_rental
DB_USERNAME=somansa_user
DB_PASSWORD=your_password
JWT_SECRET=your-32-char-secret
APP_ENV=production
FRONTEND_URL=https://your-app.netlify.app
```

### Frontend Environment Variables

Create `frontend/.env` or configure in Netlify:

```env
VITE_API_BASE_URL=https://api.somansa.com
VITE_APP_NAME=Somansa
VITE_ENABLE_PWA=true
```

## 📊 Features in Detail

### 1. Booking Conflict Detection

Automatically prevents double booking:

```php
// Checks for overlapping bookings
if (!$bookingService->checkAvailability($unitId, $start, $end)) {
    throw new Exception('Unit not available');
}
```

### 2. Dynamic Pricing

Calculates price based on unit's pricing mode:

```php
$pricing = $bookingService->calculatePrice($unitId, $start, $end);
// Supports: hourly, daily, weekly, monthly
```

### 3. Multi-Tenant Isolation

Each tenant's data is isolated:

```sql
WHERE tenant_id = ? AND ...
```

### 4. Audit Trail

All actions logged:

```php
INSERT INTO activity_logs (tenant_id, user_id, action, entity_type, entity_id, ...)
```

## 🚧 Extending the System

### Adding New API Endpoint

1. Create PHP file in `backend/public/api/`
2. Use services for business logic
3. Use Response helper for consistent output
4. Add to frontend API layer

### Adding New React Page

1. Create component in `src/pages/`
2. Add route in `AppRouter.jsx`
3. Create API methods if needed
4. Use React Query for data fetching

## 📈 Performance Tips

### Backend

- Use indexes on frequently queried columns
- Implement caching (Redis/Memcached)
- Use connection pooling
- Optimize MySQL queries (use EXPLAIN)

### Frontend

- Code splitting (automatic with Vite)
- React Query caching (5 min default)
- Lazy load images
- CDN for static assets

## 🐛 Troubleshooting

### CORS Errors

- Check `backend/config/cors.php` allowed origins
- Ensure backend sends proper headers
- Verify Netlify domain is whitelisted

### 404 on Netlify Routes

- Ensure `public/_redirects` exists with `/* /index.html 200`

### Database Connection Failed

- Verify MySQL is running
- Check credentials in backend config
- Ensure user has proper permissions

### Build Fails on Netlify

- Check Node.js version (18+)
- Verify base directory is set to `frontend`
- Check environment variables are set

## 📝 License

Proprietary - Somansa Rental System  
© 2024 All rights reserved

## 👥 Support

For support and inquiries:

- 📧 Email: support@somansa.com
- 💬 WhatsApp: +62 812 3456 7890
- 🌐 Website: https://somansa.com

## 🎉 Acknowledgments

Built with:
- React + Vite
- PHP + MySQLi
- Tailwind CSS
- TanStack Query
- Netlify

---

**Made with ❤️ for the rental management community**
