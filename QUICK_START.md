# 🚀 Somansa - Quick Start Guide

## Get Started in 15 Minutes!

This guide will help you deploy and test the Somansa Rental System quickly.

---

## 📋 Prerequisites

- PHP 7.4+ with MySQLi
- MySQL 5.7+ or MariaDB 10.3+
- Node.js 16+ and npm
- Git

---

## 🎯 Quick Deploy - Backend

### Step 1: Setup Database (5 minutes)

```bash
# Create database
mysql -u root -p << EOF
CREATE DATABASE somansa_rental CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EOF

# Import schema
mysql -u root -p somansa_rental < backend/database/schema.sql

# Import sample data (optional)
mysql -u root -p somansa_rental < backend/database/seeds.sql
```

### Step 2: Configure Backend (2 minutes)

```bash
cd backend
cp .env.example .env

# Edit .env with your values:
# DB_HOST=localhost
# DB_USERNAME=root
# DB_PASSWORD=your_password
# DB_DATABASE=somansa_rental
# JWT_SECRET=your-random-32-char-secret
```

### Step 3: Test Backend (1 minute)

```bash
# Start PHP dev server
php -S localhost:8000 -t public

# Test in browser or curl:
# http://localhost:8000/
```

---

## 🎨 Quick Deploy - Frontend

### Step 1: Install Dependencies (3 minutes)

```bash
cd frontend
npm install
```

### Step 2: Configure Frontend (1 minute)

```bash
cp .env.example .env

# Edit .env:
# VITE_API_BASE_URL=http://localhost:8000
```

### Step 3: Run Development Server (1 minute)

```bash
npm run dev

# Visit: http://localhost:5173
```

---

## 🧪 Quick Test (2 minutes)

### Test with Sample Users

The system comes with pre-seeded test users:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Super Admin | superadmin@somansa.com | password | Full system access |
| Owner | owner@demorental.com | password | Demo Rental tenant owner |
| Staff | staff@demorental.com | password | Demo Rental staff member |
| Customer | customer@example.com | password | Test customer |

### Quick Flow Test

1. **Login as Owner**
   - Email: `owner@demorental.com`
   - Password: `password`

2. **Create a Property**
   - Go to Properties
   - Click "Add Property"
   - Fill in details

3. **Add a Unit**
   - Go to Units
   - Click "Add Unit"
   - Select your property

4. **Login as Customer**
   - Logout
   - Login with: `customer@example.com` / `password`

5. **Create a Booking**
   - Browse properties
   - Select dates
   - Complete booking

---

## 🌐 Production Deployment

### Backend to VPS/Hosting

```bash
# 1. Upload backend/ folder to server
# 2. Point document root to backend/public/
# 3. Create .env with production values
# 4. Import database schema
# 5. Enable HTTPS
```

### Frontend to Netlify

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Netlify:
# - Base directory: frontend
# - Build command: npm run build
# - Publish directory: frontend/dist
# - Add env variable: VITE_API_BASE_URL=https://api.yourdomain.com

# 3. Deploy!
```

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT token)
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties/list.php` - List properties
- `POST /api/properties/create.php` - Create property
- `GET /api/properties/detail.php?id={id}` - Get property details
- `PUT /api/properties/update.php?id={id}` - Update property
- `DELETE /api/properties/delete.php?id={id}` - Delete property

### Bookings
- `GET /api/bookings/list.php` - List bookings
- `POST /api/bookings/create.php` - Create booking
- `GET /api/bookings/availability.php` - Check availability
- `POST /api/bookings/calculate-price.php` - Calculate price

**See `API_DOCUMENTATION.md` for complete API reference.**

---

## 🔧 Troubleshooting

### Backend Issues

**Database connection failed**
```bash
# Check MySQL is running
sudo service mysql status

# Verify credentials in .env
cat backend/.env
```

**CORS errors**
```bash
# Check backend/config/cors.php
# Make sure frontend URL is in allowed origins
```

### Frontend Issues

**Module not found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**API calls fail**
```bash
# Check VITE_API_BASE_URL in .env
# Verify backend is running
curl http://localhost:8000/
```

---

## 📱 PWA Installation

Once deployed on Netlify:

1. Visit your app on mobile device
2. Browser will prompt "Add to Home Screen"
3. Accept to install
4. App will work offline!

---

## 🎓 Next Steps

1. ✅ Read `README.md` for complete overview
2. ✅ Check `SYSTEM_OVERVIEW.md` for architecture
3. ✅ Review `DEPLOYMENT_GUIDE.md` for production deploy
4. ✅ Explore `API_DOCUMENTATION.md` for API details
5. ✅ Customize for your needs!

---

## 💡 Tips

- **Development**: Use `npm run dev` for hot reload
- **Production Build**: Run `npm run build` before deploying
- **Testing**: Use sample data from `seeds.sql`
- **Security**: Change JWT_SECRET in production
- **Backups**: Backup database regularly

---

## 🆘 Need Help?

- **Documentation**: Check all `.md` files in root
- **Code Comments**: All code is well-documented
- **API Reference**: See `API_DOCUMENTATION.md`
- **Deployment**: See `DEPLOYMENT_GUIDE.md`

---

## ✨ Features Summary

✅ Multi-property management  
✅ Real-time booking with conflict detection  
✅ Automatic invoice generation  
✅ Role-based access control  
✅ PWA capabilities  
✅ Mobile-responsive  
✅ Multi-tenant SaaS ready  

---

**Happy Coding! 🚀**

Need customization? The code is clean, modular, and easy to extend!
