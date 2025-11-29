# Somansa Deployment Guide

Complete guide to deploy Somansa Rental System to production.

## Architecture Overview

```
Netlify (Frontend)  ←→  VPS/Hosting (Backend)  ←→  MySQL Database
     (Static)              (PHP API)                (Data)
```

---

## Prerequisites

### Backend Requirements
- PHP 7.4 or higher
- MySQL 5.7 or MariaDB 10.3 or higher
- Apache 2.4 or Nginx
- mod_rewrite (Apache) or URL rewriting (Nginx)
- SSL certificate (Let's Encrypt recommended)
- cURL extension enabled
- MySQLi extension enabled

### Frontend Requirements
- Node.js 18 or higher
- npm or yarn
- Netlify account (free tier works)

---

## Part 1: Backend Deployment (VPS/Hosting)

### Option A: VPS (Ubuntu 20.04/22.04)

#### 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y apache2 mysql-server php php-mysqli php-curl php-json php-mbstring

# Enable Apache modules
sudo a2enmod rewrite
sudo a2enmod headers
sudo systemctl restart apache2
```

#### 2. Secure MySQL

```bash
sudo mysql_secure_installation

# Answer prompts:
# - Set root password: YES
# - Remove anonymous users: YES
# - Disallow root login remotely: YES
# - Remove test database: YES
# - Reload privilege tables: YES
```

#### 3. Create Database and User

```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE somansa_rental CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'somansa_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';

GRANT ALL PRIVILEGES ON somansa_rental.* TO 'somansa_user'@'localhost';

FLUSH PRIVILEGES;

USE somansa_rental;

-- Import schema
SOURCE /path/to/backend/database/schema.sql;

-- Optional: Import sample data
SOURCE /path/to/backend/database/seeds.sql;

EXIT;
```

#### 4. Upload Backend Files

```bash
# Clone or upload your code
cd /var/www
sudo git clone https://github.com/your-repo/somansa.git
cd somansa/backend

# Set permissions
sudo chown -R www-data:www-data /var/www/somansa
sudo chmod -R 755 /var/www/somansa
sudo chmod -R 775 /var/www/somansa/backend/storage # If you have storage
```

#### 5. Configure Environment

```bash
cd /var/www/somansa/backend

# Create .env file (or use Apache SetEnv)
sudo nano .env
```

Add:
```env
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=somansa_rental
DB_USERNAME=somansa_user
DB_PASSWORD=STRONG_PASSWORD_HERE
JWT_SECRET=YOUR_RANDOM_32_CHAR_SECRET_KEY_HERE
APP_ENV=production
FRONTEND_URL=https://your-app.netlify.app
```

Or configure in Apache (recommended):

```bash
sudo nano /etc/apache2/sites-available/somansa.conf
```

#### 6. Configure Apache Virtual Host

```apache
<VirtualHost *:80>
    ServerName api.somansa.com
    DocumentRoot /var/www/somansa/backend/public
    
    <Directory /var/www/somansa/backend/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Set environment variables
        SetEnv DB_HOST localhost
        SetEnv DB_DATABASE somansa_rental
        SetEnv DB_USERNAME somansa_user
        SetEnv DB_PASSWORD STRONG_PASSWORD_HERE
        SetEnv JWT_SECRET YOUR_SECRET_KEY
        SetEnv APP_ENV production
        SetEnv FRONTEND_URL https://your-app.netlify.app
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/somansa_error.log
    CustomLog ${APACHE_LOG_DIR}/somansa_access.log combined
</VirtualHost>
```

Enable site:
```bash
sudo a2ensite somansa
sudo systemctl reload apache2
```

#### 7. Install SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-apache

# Get certificate
sudo certbot --apache -d api.somansa.com

# Auto-renewal is set up automatically
# Test renewal:
sudo certbot renew --dry-run
```

#### 8. Update CORS Configuration

```bash
sudo nano /var/www/somansa/backend/config/cors.php
```

Update allowed origins:
```php
$allowedOrigins = [
    'https://your-app.netlify.app',
    'https://somansa.com',
    getenv('FRONTEND_URL')
];
```

#### 9. Test Backend API

```bash
curl https://api.somansa.com/
```

Should return:
```json
{
  "name": "Somansa Rental System API",
  "version": "1.0.0",
  "status": "active"
}
```

Test login:
```bash
curl -X POST https://api.somansa.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"password"}'
```

---

### Option B: Shared Hosting (cPanel)

#### 1. Upload Files

1. Compress backend folder: `backend.zip`
2. Upload via cPanel File Manager to `public_html/api/`
3. Extract files
4. Move files from `backend/public/` to `public_html/api/`
5. Move other folders (`config`, `src`, `database`) outside `public_html` (one level up)

Final structure:
```
/home/username/
├── backend/
│   ├── config/
│   ├── src/
│   └── database/
└── public_html/
    └── api/
        ├── .htaccess
        ├── index.php
        └── api/
```

#### 2. Create Database via cPanel

1. Go to MySQL Databases
2. Create database: `username_somansa`
3. Create user: `username_somansa_user`
4. Add user to database with ALL PRIVILEGES
5. Note the credentials

#### 3. Import Database

1. Go to phpMyAdmin
2. Select your database
3. Click Import
4. Upload `schema.sql`
5. Optional: Upload `seeds.sql`

#### 4. Configure Environment

Edit `config/database.php` or create `.env` file:

```php
// In config/database.php, update:
private $host = 'localhost';
private $username = 'username_somansa_user';
private $password = 'YOUR_PASSWORD';
private $database = 'username_somansa';
```

#### 5. Update .htaccess

Ensure `.htaccess` in `public_html/api/` has:

```apache
RewriteEngine On
RewriteBase /api/

# Protect directories
RewriteRule ^(config|src|database)/ - [F,L]

# API routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ $1 [L,QSA]

# Protect sensitive files
<FilesMatch "\.(env|sql|md)$">
    Order allow,deny
    Deny from all
</FilesMatch>
```

#### 6. Update CORS

Edit `config/cors.php` with your Netlify domain.

#### 7. Test API

Visit: `https://yourdomain.com/api/`

---

## Part 2: Frontend Deployment (Netlify)

### Option A: Connect Git Repository (Recommended)

#### 1. Prepare Repository

```bash
cd frontend

# Ensure .env is in .gitignore
echo ".env" >> .gitignore

# Commit and push
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

#### 2. Create Netlify Site

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Authorize Netlify
5. Select your repository

#### 3. Configure Build Settings

**Build settings:**
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`
- Functions directory: (leave empty)

#### 4. Set Environment Variables

Go to Site settings → Build & deploy → Environment:

Add variables:
```
VITE_API_BASE_URL = https://api.somansa.com
VITE_APP_NAME = Somansa
VITE_ENABLE_PWA = true
```

#### 5. Deploy

Click "Deploy site"

Netlify will:
1. Clone your repository
2. Install dependencies (`npm install`)
3. Run build (`npm run build`)
4. Deploy to CDN

#### 6. Custom Domain (Optional)

Go to Site settings → Domain management:

1. Add custom domain: `somansa.com` or `app.somansa.com`
2. Follow DNS configuration instructions
3. Enable HTTPS (automatic with Netlify)

#### 7. Configure Redirects

Ensure `frontend/public/_redirects` exists:

```
/*    /index.html   200
```

This is crucial for React Router to work!

---

### Option B: Manual Deployment

#### 1. Build Locally

```bash
cd frontend

# Install dependencies
npm install

# Create .env.production
echo "VITE_API_BASE_URL=https://api.somansa.com" > .env.production

# Build
npm run build
```

#### 2. Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### 3. Login

```bash
netlify login
```

#### 4. Deploy

```bash
# From frontend directory
netlify deploy --prod --dir=dist
```

Follow prompts to create new site or select existing one.

---

### Option C: Drag & Drop

1. Build locally: `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag `frontend/dist` folder
4. Site deployed instantly!

⚠️ Note: You'll need to configure environment variables in Netlify UI afterward.

---

## Part 3: Post-Deployment

### 1. Update Backend CORS

Ensure backend `config/cors.php` includes your Netlify domain:

```php
$allowedOrigins = [
    'https://your-actual-netlify-domain.netlify.app',
    'https://your-custom-domain.com',
];
```

### 2. Test Complete Flow

1. **Test API**: `curl https://api.somansa.com/`
2. **Test Frontend**: Visit your Netlify URL
3. **Test Login**: Try logging in with test credentials
4. **Test Booking**: Create a test booking
5. **Test PWA**: Check if installable

### 3. Update DNS (If using custom domain)

**For Backend:**
```
A Record:
api.somansa.com → Your VPS IP

OR

CNAME Record:
api.somansa.com → your-server-hostname.com
```

**For Frontend:**
Netlify provides DNS instructions when you add custom domain.

### 4. Set Up Monitoring

#### Backend Health Check

Create a monitoring endpoint:

```php
// backend/public/health.php
<?php
header('Content-Type: application/json');

$dbStatus = 'unknown';
try {
    require_once __DIR__ . '/../config/database.php';
    $db = Database::getInstance()->getConnection();
    $dbStatus = $db->ping() ? 'ok' : 'error';
} catch (Exception $e) {
    $dbStatus = 'error';
}

echo json_encode([
    'status' => 'ok',
    'database' => $dbStatus,
    'timestamp' => time()
]);
```

Monitor with:
- UptimeRobot
- Pingdom
- StatusCake

#### Frontend Monitoring

Netlify provides built-in:
- Deploy logs
- Function logs (if using)
- Analytics (paid)
- Performance insights

### 5. Configure Backups

#### Database Backup Script

```bash
#!/bin/bash
# /usr/local/bin/backup-somansa-db.sh

BACKUP_DIR="/home/backups/somansa"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="somansa_rental"
DB_USER="somansa_user"
DB_PASS="YOUR_PASSWORD"

mkdir -p $BACKUP_DIR

mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

Make executable:
```bash
sudo chmod +x /usr/local/bin/backup-somansa-db.sh
```

Add to crontab:
```bash
sudo crontab -e
```

Add line:
```
0 2 * * * /usr/local/bin/backup-somansa-db.sh
```

This backs up daily at 2 AM.

### 6. Set Up Email Notifications

For booking confirmations, use:
- PHPMailer
- SendGrid
- Mailgun
- AWS SES

### 7. Configure Logging

#### Backend (PHP Error Logging)

```php
// In config/constants.php or init script
if (getenv('APP_ENV') === 'production') {
    error_reporting(E_ALL);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', '/var/log/somansa/php_errors.log');
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}
```

Create log directory:
```bash
sudo mkdir -p /var/log/somansa
sudo chown www-data:www-data /var/log/somansa
sudo chmod 755 /var/log/somansa
```

#### Log Rotation

```bash
sudo nano /etc/logrotate.d/somansa
```

Add:
```
/var/log/somansa/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

---

## Part 4: Security Hardening

### 1. Backend Security

#### Disable Directory Listing

In Apache config:
```apache
<Directory /var/www/somansa/backend/public>
    Options -Indexes +FollowSymLinks
</Directory>
```

#### Protect Sensitive Files

```apache
<FilesMatch "\.(env|sql|md|json|lock)$">
    Order allow,deny
    Deny from all
</FilesMatch>
```

#### Set Strong JWT Secret

Generate secure secret:
```bash
openssl rand -base64 32
```

Update in environment configuration.

#### Implement Rate Limiting

Install mod_evasive (Apache):
```bash
sudo apt install libapache2-mod-evasive
sudo a2enmod evasive
```

Configure:
```bash
sudo nano /etc/apache2/mods-available/evasive.conf
```

### 2. Frontend Security

#### Content Security Policy

Add in Netlify:

Create `frontend/public/_headers`:
```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.somansa.com
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 3. Database Security

- Use strong passwords
- Limit database user privileges
- Enable MySQL slow query log
- Regular security updates

```bash
sudo mysql -u root -p
```

```sql
-- Revoke unnecessary privileges
REVOKE FILE ON *.* FROM 'somansa_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. SSL/TLS Configuration

Test SSL with: https://www.ssllabs.com/ssltest/

Ensure you have A or A+ rating.

---

## Part 5: Performance Optimization

### Backend

#### Enable OPcache

```bash
sudo nano /etc/php/7.4/apache2/php.ini
```

Uncomment/add:
```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
opcache.validate_timestamps=0  # In production
```

#### Enable Gzip Compression

Already in `.htaccess`, ensure mod_deflate is enabled:
```bash
sudo a2enmod deflate
sudo systemctl restart apache2
```

#### Database Query Optimization

- Add indexes on frequently queried columns
- Use EXPLAIN to analyze slow queries
- Enable MySQL slow query log

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Add:
```ini
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow-query.log
long_query_time = 2
```

### Frontend (Netlify)

- Already optimized with CDN
- Automatic asset compression
- HTTP/2 enabled
- Smart CDN with global edge network

Additional optimizations in `vite.config.js`:
- Code splitting (already configured)
- Tree shaking (automatic)
- Minification (automatic)

---

## Part 6: Troubleshooting

### Issue: 500 Internal Server Error

**Check:**
1. Apache error log: `sudo tail -f /var/log/apache2/somansa_error.log`
2. PHP error log: `sudo tail -f /var/log/somansa/php_errors.log`
3. Permissions: `ls -la /var/www/somansa`

**Solutions:**
- Check file permissions
- Verify database connection
- Check .htaccess syntax

### Issue: CORS Errors

**Check:**
1. Backend CORS configuration
2. Allowed origins list
3. Preflight OPTIONS handling

**Solution:**
Update `backend/config/cors.php` with correct Netlify domain.

### Issue: 404 on React Routes

**Check:**
1. `_redirects` file exists in build
2. Content: `/* /index.html 200`

**Solution:**
Ensure file is in `frontend/public/_redirects`.

### Issue: Database Connection Failed

**Check:**
1. MySQL service: `sudo systemctl status mysql`
2. Credentials in environment variables
3. User permissions: `SHOW GRANTS FOR 'somansa_user'@'localhost';`

**Solution:**
- Restart MySQL: `sudo systemctl restart mysql`
- Verify credentials
- Check firewall rules

---

## Part 7: Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check disk space: `df -h`

**Weekly:**
- Review activity logs
- Check backup status
- Monitor performance

**Monthly:**
- Update dependencies
- Review security patches
- Optimize database
- Clean old logs

### Update Deployment

**Backend:**
```bash
cd /var/www/somansa/backend
sudo git pull origin main
sudo systemctl reload apache2
```

**Frontend:**
Just push to Git - Netlify auto-deploys!

Or manual:
```bash
cd frontend
git pull
npm run build
netlify deploy --prod --dir=dist
```

### Database Maintenance

```bash
# Optimize tables
mysql -u root -p somansa_rental -e "OPTIMIZE TABLE bookings, invoices, payments;"

# Check tables
mysql -u root -p somansa_rental -e "CHECK TABLE bookings, invoices;"

# Analyze tables
mysql -u root -p somansa_rental -e "ANALYZE TABLE bookings;"
```

---

## Support

For deployment support:
- 📧 Email: support@somansa.com
- 📖 Docs: https://docs.somansa.com
- 💬 Community: https://community.somansa.com

---

## Checklist

Use this checklist before going live:

### Backend
- [ ] Database created and schema imported
- [ ] Database user created with proper permissions
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] CORS configured with correct domains
- [ ] Error logging enabled
- [ ] Backups scheduled
- [ ] Test API endpoints
- [ ] Change default passwords

### Frontend
- [ ] Build successful
- [ ] Environment variables set in Netlify
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled
- [ ] _redirects file present
- [ ] PWA manifest configured
- [ ] Test all routes
- [ ] Test on mobile devices

### Security
- [ ] Strong passwords used
- [ ] JWT secret generated and secured
- [ ] Directory listing disabled
- [ ] Sensitive files protected
- [ ] SSL/TLS properly configured
- [ ] Security headers configured
- [ ] Rate limiting enabled

### Monitoring
- [ ] Health check endpoint created
- [ ] Uptime monitoring configured
- [ ] Error tracking set up
- [ ] Backup verification scheduled
- [ ] Log rotation configured

---

**Congratulations! Your Somansa system is now live! 🎉**
