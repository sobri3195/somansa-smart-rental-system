# Somansa - Complete System Overview

**Smart Rental Management System**  
*Houses • Boarding • Cars*

---

## 📋 Table of Contents

1. [System Summary](#system-summary)
2. [Technology Stack](#technology-stack)
3. [Database Design](#database-design)
4. [Backend Architecture](#backend-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Security Design](#security-design)
7. [API Endpoints Summary](#api-endpoints-summary)
8. [Key Features](#key-features)
9. [File Structure](#file-structure)
10. [Quick Start](#quick-start)

---

## System Summary

Somansa is a complete, production-ready rental management system built with modern web technologies. It supports three types of rentals:

### 1. Houses & Villas
- **Pricing**: Daily, weekly, monthly
- **Features**: Multiple rooms, amenities, deposit tracking
- **Use Case**: Vacation rentals, long-term stays

### 2. Boarding Rooms (Kos)
- **Pricing**: Monthly with recurring billing
- **Features**: Individual rooms, shared facilities
- **Use Case**: Students, workers, long-term residents

### 3. Cars & Vehicles
- **Pricing**: Hourly, daily
- **Features**: With/without driver, add-ons (GPS, insurance)
- **Use Case**: Transportation rentals, tours

### Core Capabilities

✅ **Multi-Property Management** - Manage unlimited properties and units  
✅ **Real-Time Booking** - Automatic conflict detection prevents double booking  
✅ **Smart Invoicing** - Auto-generate invoices, including recurring monthly  
✅ **Payment Tracking** - Record payments, partial payments, generate receipts  
✅ **WhatsApp Integration** - Automated notifications for bookings, payments, reminders  
✅ **Multi-Tenant SaaS** - Support multiple organizations with isolated data  
✅ **Role-Based Access** - Super Admin, Owner, Staff, Customer roles  
✅ **PWA Support** - Installable as mobile/desktop app  
✅ **RESTful API** - Clean, documented API for integrations  
✅ **Calendar View** - Visual booking calendar with drag-and-drop (ready for FullCalendar)

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI library |
| **Vite** | 5.x | Build tool & dev server |
| **React Router** | 6.x | Client-side routing |
| **TanStack Query** | 5.x | Server state management |
| **Axios** | 1.x | HTTP client |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **Headless UI** | 1.x | Accessible components |
| **Heroicons** | 2.x | Icon library |
| **React Hook Form** | 7.x | Form handling |
| **React Hot Toast** | 2.x | Notifications |
| **Vite PWA Plugin** | 0.17.x | Progressive Web App |

**Deployment**: Netlify (static hosting with CDN)

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **PHP** | 7.4+ | Server-side language |
| **MySQLi** | Native | Database driver |
| **Apache/Nginx** | Latest | Web server |
| **MySQL** | 5.7+ / MariaDB 10.3+ | Relational database |

**Architecture**: Pure PHP (no framework), structured with:
- Service layer for business logic
- Middleware for authentication
- Prepared statements for security
- JSON REST API

**Deployment**: VPS, shared hosting, or cloud (AWS, DigitalOcean, etc.)

---

## Database Design

### Schema Overview (12 Tables)

```
┌─────────────┐
│   tenants   │ ─┐
└─────────────┘  │
                 │
┌─────────────┐  │       ┌─────────────┐
│    users    │←─┼──────→│   settings  │
└─────────────┘  │       └─────────────┘
       │         │
       │         │       ┌─────────────┐
       ↓         └──────→│ properties  │
┌─────────────┐          └─────────────┘
│  bookings   │                 │
└─────────────┘                 ↓
       │              ┌─────────────┐
       ├─────────────→│    units    │
       │              └─────────────┘
       ↓
┌─────────────┐       ┌─────────────┐
│  invoices   │───────│  payments   │
└─────────────┘       └─────────────┘
       │
       ↓
┌──────────────────┐  ┌─────────────┐
│ booking_add_ons  │──│   add_ons   │
└──────────────────┘  └─────────────┘

┌───────────────┐    ┌──────────────────┐
│ notifications │    │  activity_logs   │
└───────────────┘    └──────────────────┘
```

### Key Tables

#### 1. tenants
- Multi-tenant SaaS support
- Isolates data between organizations
- Fields: name, contact, plan_type, status, subscription

#### 2. users
- Multi-role system
- Roles: super_admin, owner, staff, customer
- Fields: name, email, password_hash, phone, role, is_active

#### 3. properties
- Physical locations (buildings, garages)
- Types: house, kos, car
- Fields: name, type, address, location (lat/lng), photos, amenities

#### 4. units
- Individual rentable items (rooms, houses, vehicles)
- Types: room, house, car, other
- Pricing modes: hourly, daily, weekly, monthly
- Fields: name, code, capacity, base_price, deposit, status, facilities

#### 5. bookings
- Reservation records
- Automatic conflict detection
- Status flow: draft → pending_payment → confirmed → checked_in → checked_out
- Fields: booking_number, dates, pricing, status, customer

#### 6. invoices
- Billing records
- Supports recurring (monthly kos)
- Status: unpaid, partial, paid, overdue, canceled
- Fields: invoice_number, amounts, dates, period (for recurring)

#### 7. payments
- Payment transaction records
- Multiple payments per invoice (partial support)
- Methods: cash, bank_transfer, e_wallet, gateway
- Fields: payment_number, amount, method, transaction_ref, status

#### 8. add_ons
- Extra services/items
- Charge types: per_booking, per_day, per_hour, per_unit
- Examples: cleaning, driver, GPS, insurance

#### 9. notifications
- Communication log
- Channels: whatsapp, email, sms
- Status tracking: pending, sent, failed
- Template-based with placeholders

#### 10. settings
- Tenant-specific configuration
- Key-value store
- Examples: currency, timezone, tax_rate, API keys

#### 11. activity_logs
- Audit trail
- Tracks all user actions
- Fields: user, action, entity, description, data_json, IP, user_agent

### Indexing Strategy

**Primary Indexes:**
- All tables have `id` as PRIMARY KEY AUTO_INCREMENT

**Foreign Key Indexes:**
- `tenant_id` on all tenant-related tables
- `property_id`, `unit_id`, `customer_id`, `booking_id`, etc.

**Query Optimization Indexes:**
- `start_datetime`, `end_datetime` on bookings (conflict detection)
- `status` on bookings, invoices, payments (filtering)
- `due_date` on invoices (overdue queries)
- `email` on users (login)
- `booking_number`, `invoice_number`, `payment_number` (lookups)

**Composite Indexes:**
- `(tenant_id, role)` on users
- `(property_id, unit_id)` on bookings
- `(tenant_id, key)` on settings (unique)

---

## Backend Architecture

### Project Structure

```
backend/
├── config/
│   ├── database.php      # MySQLi singleton connection
│   ├── constants.php     # App constants, statuses, formats
│   └── cors.php          # CORS headers for Netlify
│
├── src/
│   ├── middleware/
│   │   └── auth.php      # JWT authentication & role checks
│   │
│   ├── services/
│   │   ├── BookingService.php    # Booking logic, conflict detection
│   │   └── InvoiceService.php    # Invoice generation, recurring billing
│   │
│   └── utils/
│       ├── response.php   # Consistent JSON responses
│       └── validator.php  # Input validation
│
├── public/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register.php
│   │   │   ├── login.php
│   │   │   └── me.php
│   │   │
│   │   ├── bookings/
│   │   │   ├── create.php
│   │   │   ├── list.php
│   │   │   └── ... (more endpoints)
│   │   │
│   │   └── calendar.php
│   │
│   └── index.php         # API info page
│
├── database/
│   ├── schema.sql        # Complete DDL
│   └── seeds.sql         # Sample data
│
├── .htaccess             # Apache rewrite rules
└── README.md
```

### Design Patterns

#### 1. Singleton Pattern
**Database Connection:**
```php
$db = Database::getInstance()->getConnection();
```

#### 2. Service Layer Pattern
**Business Logic:**
```php
$bookingService = new BookingService();
$booking = $bookingService->createBooking($data);
```

#### 3. Middleware Pattern
**Authentication:**
```php
$auth = new AuthMiddleware();
$user = $auth->requireAuth();
$user = $auth->requireRole(['owner', 'staff']);
```

#### 4. Response Helper Pattern
**Consistent API Responses:**
```php
Response::success($data, $message);
Response::error($error, $code);
Response::paginated($data, $page, $perPage, $total);
```

### Security Measures

1. **SQL Injection Prevention**
   - All queries use prepared statements
   - Parameter binding with type specification

2. **Password Security**
   - Bcrypt hashing (cost factor 10)
   - Salted automatically

3. **JWT Authentication**
   - Custom implementation (or use firebase/php-jwt)
   - 30-day expiration
   - Signed with secret key

4. **Input Validation**
   - Custom Validator class
   - Validates types, lengths, formats
   - Returns descriptive errors

5. **CORS Protection**
   - Whitelist allowed origins
   - Preflight handling
   - Credentials support

6. **Role-Based Access Control**
   - Checked on every API endpoint
   - Tenant isolation enforced
   - Super admin bypass

---

## Frontend Architecture

### Project Structure

```
frontend/
├── public/
│   ├── _redirects        # Netlify SPA routing
│   ├── manifest.json     # PWA manifest
│   └── icons/            # App icons
│
├── src/
│   ├── api/              # API client layer
│   │   ├── client.js     # Axios with interceptors
│   │   ├── authApi.js
│   │   ├── bookingsApi.js
│   │   ├── propertiesApi.js
│   │   └── calendarApi.js
│   │
│   ├── components/
│   │   └── layout/
│   │       ├── PublicLayout.jsx
│   │       ├── AdminLayout.jsx
│   │       └── CustomerLayout.jsx
│   │
│   ├── contexts/
│   │   └── AuthContext.jsx    # Auth state & methods
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.jsx
│   │   │   ├── PropertyListPage.jsx
│   │   │   └── PropertyDetailPage.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   │
│   │   ├── customer/
│   │   │   ├── CustomerDashboard.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── BookingDetail.jsx
│   │   │   └── MyInvoices.jsx
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── PropertiesPage.jsx
│   │       ├── UnitsPage.jsx
│   │       ├── BookingsPage.jsx
│   │       ├── CalendarPage.jsx
│   │       ├── InvoicesPage.jsx
│   │       ├── CustomersPage.jsx
│   │       └── SettingsPage.jsx
│   │
│   ├── router/
│   │   └── AppRouter.jsx      # Route configuration
│   │
│   ├── index.css
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

### State Management

#### Server State (TanStack Query)
```jsx
const { data, isLoading, error } = useQuery({
  queryKey: ['bookings'],
  queryFn: bookingsApi.list
});
```

#### Client State (React Context)
```jsx
const { user, isAuthenticated, login, logout } = useAuth();
```

### Routing Strategy

**Public Routes:**
- `/` - Home
- `/properties` - Browse properties
- `/properties/:id` - Property details
- `/login`, `/register` - Authentication

**Protected Routes:**
- **Customer**: `/customer/*`
  - Dashboard, bookings, invoices
- **Admin**: `/admin/*`
  - Dashboard, properties, units, bookings, calendar, invoices, customers, settings

**Route Guards:**
```jsx
<ProtectedRoute requiredRoles={['owner', 'staff']}>
  <AdminLayout />
</ProtectedRoute>
```

### PWA Features

1. **Service Worker**
   - Caches static assets
   - Network-first for API calls
   - Cache duration: 5 minutes

2. **Web Manifest**
   - App name, icons, theme color
   - Display mode: standalone
   - Orientation: any

3. **Install Prompt**
   - Native install experience
   - Works on all platforms

4. **Offline Support**
   - Static pages cached
   - API calls fail gracefully
   - "Offline" indicator

---

## Security Design

### Authentication Flow

```
1. User enters credentials
   ↓
2. Frontend sends to /api/auth/login
   ↓
3. Backend verifies password (bcrypt)
   ↓
4. Backend generates JWT token
   ↓
5. Frontend stores token in localStorage
   ↓
6. Frontend adds "Authorization: Bearer {token}" to all requests
   ↓
7. Backend validates token on each request
   ↓
8. If token invalid/expired → 401 → Redirect to login
```

### Authorization Levels

| Role | Permissions |
|------|-------------|
| **Customer** | Create bookings, view own data, make payments |
| **Staff** | Create/edit bookings, check-in/out, record payments |
| **Owner** | All staff permissions + manage properties/units/staff |
| **Super Admin** | All permissions + manage tenants, global access |

### Data Isolation

**Tenant-Level:**
```sql
WHERE tenant_id = ? AND ...
```

**User-Level (Customers):**
```sql
WHERE tenant_id = ? AND customer_id = ? AND ...
```

**Row-Level Security:**
```php
$auth->checkTenantAccess($user, $resourceTenantId);
```

### HTTPS Enforcement

- Backend: SSL certificate (Let's Encrypt)
- Frontend: Netlify automatic HTTPS
- API calls: Always HTTPS in production

---

## API Endpoints Summary

### Authentication (Public)
- `POST /api/auth/register` - Register customer
- `POST /api/auth/login` - Login, get JWT
- `GET /api/auth/me` - Get current user

### Bookings (Authenticated)
- `GET /api/bookings/list.php` - List with filters
- `POST /api/bookings/create.php` - Create booking
- `GET /api/bookings/detail.php?id={id}` - Get details
- `PUT /api/bookings/update.php?id={id}` - Update
- `PATCH /api/bookings/status.php?id={id}` - Change status
- `POST /api/bookings/cancel.php?id={id}` - Cancel

### Calendar (Authenticated)
- `GET /api/calendar.php` - Get events (FullCalendar format)

### Properties (Authenticated)
- `GET /api/properties/list.php` - List properties
- `POST /api/properties/create.php` - Create (owner+)
- `GET /api/properties/detail.php?id={id}` - Get details
- `PUT /api/properties/update.php?id={id}` - Update (owner+)
- `DELETE /api/properties/delete.php?id={id}` - Delete (owner+)

### Units (Authenticated)
- `GET /api/units/list.php` - List units
- `POST /api/units/create.php` - Create (owner+)
- `GET /api/units/detail.php?id={id}` - Get details
- `PUT /api/units/update.php?id={id}` - Update (owner+)
- `DELETE /api/units/delete.php?id={id}` - Delete (owner+)

### Invoices (Authenticated)
- `GET /api/invoices/list.php` - List invoices
- `POST /api/invoices/create.php` - Create (staff+)
- `GET /api/invoices/detail.php?id={id}` - Get details

### Payments (Authenticated)
- `GET /api/payments/list.php` - List payments
- `POST /api/payments/create.php` - Record payment (staff+)

### Settings (Owner+)
- `GET /api/settings/list.php` - Get settings
- `PUT /api/settings/update.php` - Update settings

---

## Key Features

### 1. Real-Time Booking Conflict Detection

**Algorithm:**
```sql
SELECT COUNT(*) FROM bookings
WHERE unit_id = ?
AND status NOT IN ('canceled', 'draft')
AND (
  (start_datetime < ? AND end_datetime > ?) OR  -- New booking starts during existing
  (start_datetime < ? AND end_datetime > ?) OR  -- New booking ends during existing
  (start_datetime >= ? AND end_datetime <= ?)   -- New booking completely overlaps
)
```

**Result:** Zero conflicts = Available ✅

### 2. Dynamic Price Calculation

```php
switch ($pricing_mode) {
  case 'hourly':
    $duration = hours_between($start, $end);
    break;
  case 'daily':
    $duration = days_between($start, $end);
    break;
  case 'weekly':
    $duration = weeks_between($start, $end);
    break;
  case 'monthly':
    $duration = months_between($start, $end);
    break;
}

$total = $duration * $base_price;
```

### 3. Recurring Invoice Generation

For monthly bookings (kos):

```php
$start = booking.start_datetime;
$end = booking.end_datetime;

while ($start <= $end) {
  createInvoice(
    booking_id,
    month: $start->month,
    year: $start->year
  );
  
  $start = $start->addMonth();
}
```

### 4. WhatsApp Notifications

**Triggers:**
- Booking created → Send confirmation
- Payment received → Send receipt
- 24h before check-in → Send reminder
- Invoice due in 3 days → Send reminder
- Invoice overdue → Send notice

**Template Example:**
```
Hi {{customer_name}},

Your booking {{booking_number}} for {{unit_name}} has been confirmed!

Check-in: {{start_datetime}}
Check-out: {{end_datetime}}
Total: {{total_amount}}

Thank you for choosing {{property_name}}!
```

### 5. Multi-Tenant Isolation

**Data Segregation:**
- Every query filters by `tenant_id`
- Cross-tenant access blocked
- Super admin can switch tenant context

**Example:**
```php
$bookings = $db->query("
  SELECT * FROM bookings
  WHERE tenant_id = ? AND ...
", [$user->tenant_id]);
```

---

## Quick Start

### 1. Database Setup (5 minutes)
```bash
mysql -u root -p
CREATE DATABASE somansa_rental;
USE somansa_rental;
SOURCE backend/database/schema.sql;
SOURCE backend/database/seeds.sql;
```

### 2. Backend Setup (5 minutes)
```bash
cd backend
# Configure database in config/database.php
# Update CORS in config/cors.php
# Point Apache/Nginx to backend/public/
```

### 3. Frontend Setup (5 minutes)
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

### 4. Deploy to Netlify (10 minutes)
```bash
# Push to GitHub
git push origin main

# Connect to Netlify
# Set build: npm run build
# Set directory: frontend/dist
# Set env: VITE_API_BASE_URL
# Deploy!
```

**Total Time:** ~25 minutes to fully functional system! 🚀

---

## Default Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@somansa.com | password |
| Owner | owner@demorental.com | password |
| Staff | staff@demorental.com | password |
| Customer | customer@example.com | password |

⚠️ **Change these immediately in production!**

---

## Documentation Files

1. **README.md** - Main project overview
2. **API_DOCUMENTATION.md** - Complete API reference
3. **DEPLOYMENT_GUIDE.md** - Step-by-step deployment
4. **SYSTEM_OVERVIEW.md** - This file (architecture & design)
5. **backend/README.md** - Backend-specific docs
6. **frontend/README.md** - Frontend-specific docs

---

## Support & Resources

- 📧 Email: support@somansa.com
- 📖 Documentation: https://docs.somansa.com
- 💬 Community: https://community.somansa.com
- 🐛 Issues: https://github.com/somansa/issues
- 🎥 Video Tutorials: https://youtube.com/@somansa

---

## Roadmap

### Phase 1 (Current)
✅ Core booking system  
✅ User management  
✅ Invoice generation  
✅ Basic notifications  

### Phase 2 (Next 3 months)
- [ ] Payment gateway integration (Midtrans, Stripe)
- [ ] Advanced calendar (drag-drop, recurring events)
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Advanced reporting & analytics

### Phase 3 (Next 6 months)
- [ ] Multi-language support
- [ ] Advanced pricing (dynamic, seasonal)
- [ ] Customer reviews & ratings
- [ ] Loyalty program
- [ ] Referral system

### Phase 4 (Next 12 months)
- [ ] AI-powered pricing recommendations
- [ ] Automated customer service (chatbot)
- [ ] Integration marketplace
- [ ] White-label solution
- [ ] Mobile check-in (QR codes)

---

## License

**Proprietary**  
© 2024 Somansa. All rights reserved.

This software is provided for use under a commercial license.  
Unauthorized copying, modification, or distribution is prohibited.

---

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## Acknowledgments

Built with ❤️ using:
- React ecosystem
- PHP & MySQLi
- Tailwind CSS
- Open source libraries

Special thanks to:
- All contributors
- Open source community
- Early adopters & beta testers

---

**Made with ❤️ for the rental management community**

*Last Updated: December 2024*
