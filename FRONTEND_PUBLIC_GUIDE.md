# 📱 Somansa Frontend - Public Pages Guide

## Overview

The Somansa frontend is a modern React SPA built with Vite, designed to be deployed on **Netlify** as a static site. This guide focuses on the **public-facing pages** that allow users to browse properties and make bookings without authentication.

---

## 🏗️ Architecture

### Tech Stack
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Folder Structure

```
frontend/
├── public/
│   ├── _redirects          # Netlify SPA routing
│   └── manifest.json       # PWA manifest
├── src/
│   ├── api/
│   │   ├── client.js       # Axios instance with base URL
│   │   ├── authApi.js
│   │   ├── bookingsApi.js
│   │   ├── propertiesApi.js
│   │   ├── calendarApi.js
│   │   └── invoicesApi.js
│   ├── components/
│   │   └── layout/
│   │       ├── PublicLayout.jsx     # Header + Footer
│   │       ├── AdminLayout.jsx
│   │       └── CustomerLayout.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.jsx              # Landing page
│   │   │   ├── PropertyListPage.jsx      # Browse properties
│   │   │   ├── PropertyDetailPage.jsx    # Property details + booking
│   │   │   ├── BookingLookupPage.jsx     # Track bookings
│   │   │   └── CalendarViewPage.jsx      # Calendar view
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── customer/
│   │   │   └── ... (customer portal)
│   │   └── admin/
│   │       └── ... (admin panel)
│   ├── router/
│   │   └── AppRouter.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.example
```

---

## 🌐 Public Pages

### 1. Home Page (`/`)

**File:** `src/pages/public/HomePage.jsx`

**Features:**
- Hero section with branding
- Features showcase (Houses, Boarding, Cars)
- CTA buttons to browse properties

**Components Used:**
- Hero with gradient background
- Feature cards with icons
- Call-to-action sections

**Code Snippet:**
```jsx
const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <h1>Smart Rental Management</h1>
        <Link to="/properties">Browse Properties</Link>
      </div>
      
      {/* Features */}
      <div className="py-20 bg-white">
        {/* Feature cards */}
      </div>
    </div>
  );
};
```

---

### 2. Property List Page (`/properties`)

**File:** `src/pages/public/PropertyListPage.jsx`

**Features:**
- Search properties by name
- Filter by:
  - Type (house, kos, car)
  - City
  - Price range (min/max)
- Responsive grid layout
- Loading and error states

**API Call:**
```javascript
const { data, isLoading, error } = useQuery({
  queryKey: ['properties', filters],
  queryFn: () => propertiesApi.list(filters)
});
```

**Filters:**
```jsx
<input
  type="text"
  placeholder="Search properties..."
  value={filters.search}
  onChange={(e) => handleFilterChange('search', e.target.value)}
/>

<select value={filters.type} onChange={...}>
  <option value="">All Types</option>
  <option value="house">House/Villa</option>
  <option value="kos">Boarding/Kos</option>
  <option value="car">Car/Vehicle</option>
</select>
```

**Property Card:**
- Photo with type badge
- Name, city, description
- Unit count
- Link to detail page

---

### 3. Property Detail Page (`/properties/:id`)

**File:** `src/pages/public/PropertyDetailPage.jsx`

**Features:**
- Property photos gallery
- Full description and location
- List of available units with:
  - Capacity
  - Price and pricing mode
  - Facilities
  - Status badge
- Inline booking form
- Success message with booking reference

**Booking Flow:**
1. User clicks "Book Now" on a unit
2. Booking form appears at top of page
3. User selects:
   - Start date & time
   - End date & time
   - Optional notes
4. Form submits to API
5. Success message shows booking reference number

**API Calls:**
```javascript
// Fetch property with units
const { data } = useQuery({
  queryKey: ['property', id],
  queryFn: () => propertiesApi.getById(id)
});

// Create booking
const createBooking = useMutation({
  mutationFn: (data) => bookingsApi.create(data),
  onSuccess: (response) => {
    setBookingSuccess(response.data);
    toast.success('Booking created!');
  }
});
```

**Booking Form:**
```jsx
<form onSubmit={handleSubmitBooking}>
  <input
    type="datetime-local"
    value={bookingData.start_datetime}
    onChange={...}
    required
  />
  <input
    type="datetime-local"
    value={bookingData.end_datetime}
    required
  />
  <textarea
    placeholder="Notes..."
    value={bookingData.notes}
  />
  <button type="submit">Confirm Booking</button>
</form>
```

---

### 4. Booking Lookup Page (`/booking-lookup`)

**File:** `src/pages/public/BookingLookupPage.jsx`

**Features:**
- Search by booking reference number
- Display booking details:
  - Status with timeline
  - Check-in/check-out dates
  - Property and unit info
  - Total price
  - Notes
- Visual status timeline
- Timestamps

**API Call:**
```javascript
const { data, refetch } = useQuery({
  queryKey: ['booking-lookup', searchTerm],
  queryFn: () => bookingsApi.list({ search: searchTerm }),
  enabled: false  // Manual trigger
});

// Trigger search
const handleSearch = (e) => {
  e.preventDefault();
  setSearchTerm(bookingNumber);
  refetch();
};
```

**Status Timeline:**
- Visual progress indicator
- Shows completed steps in green
- Current status highlighted
- Canceled status shown separately

---

### 5. Calendar View Page (`/calendar`)

**File:** `src/pages/public/CalendarViewPage.jsx`

**Features:**
- Select property (required)
- Select unit (optional)
- Month navigation (previous/next)
- Calendar grid showing:
  - Bookings by date
  - Color-coded by status
  - Multiple bookings per day
- Statistics:
  - Total bookings
  - Confirmed count
  - Checked-in count
  - Pending count
- Legend for status colors

**API Call:**
```javascript
const { data } = useQuery({
  queryKey: ['calendar', selectedProperty, selectedUnit, startOfMonth, endOfMonth],
  queryFn: () => calendarApi.getEvents({
    property_id: selectedProperty,
    unit_id: selectedUnit,
    start: startOfMonth.toISOString().split('T')[0],
    end: endOfMonth.toISOString().split('T')[0]
  }),
  enabled: !!selectedProperty
});
```

**Calendar Generation:**
```javascript
const generateCalendar = () => {
  // Calculate first day of month
  // Calculate days in month
  // Map events to dates
  // Return 6-week grid
};
```

**Status Colors:**
- Draft: Gray
- Pending Payment: Yellow
- Confirmed: Blue
- Checked In: Green
- Checked Out: Purple
- Canceled: Red

---

## 🔌 API Integration

### API Client Configuration

**File:** `src/api/client.js`

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data || {};
    return Promise.reject(errorData);
  }
);

export default apiClient;
```

### Environment Variables

**File:** `frontend/.env`

```env
VITE_API_BASE_URL=https://api.somansa.com
VITE_APP_NAME=Somansa
```

**Netlify Configuration:**
- Set in: Site Settings → Environment Variables
- Add: `VITE_API_BASE_URL` = your backend URL

---

## 🎨 Styling

### Tailwind CSS Configuration

**File:** `tailwind.config.js`

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... through to 900
          600: '#4F46E5',  // Main brand color
          700: '#4338CA',
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
};
```

### Common Classes Used

```css
/* Buttons */
.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded-lg 
         font-medium hover:bg-primary-700 transition;
}

.btn-secondary {
  @apply border border-gray-300 px-4 py-2 rounded-lg 
         font-medium hover:bg-gray-50 transition;
}

/* Cards */
.card {
  @apply bg-white rounded-lg shadow-sm p-6;
}

/* Input Fields */
.input {
  @apply w-full border border-gray-300 rounded-lg px-3 py-2 
         focus:ring-2 focus:ring-primary-500 focus:border-transparent;
}
```

---

## 📦 Build & Deployment

### Development

```bash
cd frontend
npm install
npm run dev
```

Access at: `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output: `frontend/dist/`

### Netlify Deployment

#### Option 1: Netlify CLI

```bash
npm install -g netlify-cli
netlify init
netlify deploy --prod
```

#### Option 2: GitHub Integration

1. Push code to GitHub
2. Connect repository to Netlify
3. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
4. Add environment variables:
   - `VITE_API_BASE_URL` = your backend URL
5. Deploy!

### Netlify Configuration

**File:** `frontend/public/_redirects`

```
# SPA routing - all routes to index.html
/*    /index.html   200
```

This ensures that React Router handles all routes client-side.

---

## 🔄 State Management

### React Query Setup

**File:** `src/App.jsx`

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

### Query Examples

**Fetch data:**
```javascript
const { data, isLoading, error } = useQuery({
  queryKey: ['properties'],
  queryFn: () => propertiesApi.list()
});
```

**Create/Update data:**
```javascript
const mutation = useMutation({
  mutationFn: (data) => bookingsApi.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries(['bookings']);
  }
});
```

---

## 📱 PWA Configuration

### Manifest

**File:** `frontend/public/manifest.json`

```json
{
  "name": "Somansa - Smart Rental System",
  "short_name": "Somansa",
  "description": "Rental management for houses, boarding, and cars",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#4F46E5",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker

**File:** `vite.config.js`

```javascript
import { VitePWA } from 'vite-plugin-pwa';

export default {
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Somansa',
        short_name: 'Somansa',
        theme_color: '#4F46E5'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.somansa\.com\/api\/properties/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-properties',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60 // 5 minutes
              }
            }
          }
        ]
      }
    })
  ]
};
```

---

## 🧪 Testing the Public Pages

### Manual Testing Checklist

#### Home Page
- [ ] Hero section displays correctly
- [ ] Feature cards render
- [ ] CTA buttons navigate correctly
- [ ] Responsive on mobile

#### Property List
- [ ] Properties load from API
- [ ] Search filter works
- [ ] Type filter works
- [ ] City filter works
- [ ] Price range filters work
- [ ] Cards display property info
- [ ] Click navigates to detail page
- [ ] Loading state shows spinner
- [ ] Error state shows message
- [ ] Empty state shows when no results

#### Property Detail
- [ ] Property details load
- [ ] Photos display correctly
- [ ] Units list shows
- [ ] "Book Now" opens form
- [ ] Date validation works
- [ ] Booking submission works
- [ ] Success message shows booking number
- [ ] Error messages display
- [ ] Back button works

#### Booking Lookup
- [ ] Search form appears
- [ ] Enter booking reference
- [ ] Booking details display
- [ ] Status timeline renders correctly
- [ ] No results shows message
- [ ] Search another booking works

#### Calendar View
- [ ] Property select populates
- [ ] Unit select filters correctly
- [ ] Calendar grid renders
- [ ] Month navigation works
- [ ] Bookings appear on correct dates
- [ ] Status colors match legend
- [ ] Statistics calculate correctly
- [ ] Responsive on mobile

### API Testing

```bash
# Test property list
curl http://localhost:8000/api/properties/list.php

# Test property detail
curl http://localhost:8000/api/properties/detail.php?id=1

# Test create booking
curl -X POST http://localhost:8000/api/bookings/create.php \
  -H "Content-Type: application/json" \
  -d '{
    "property_id": 1,
    "unit_id": 1,
    "start_datetime": "2024-12-01 14:00:00",
    "end_datetime": "2024-12-03 12:00:00",
    "booking_source": "online",
    "status": "draft"
  }'

# Test calendar
curl "http://localhost:8000/api/calendar.php?property_id=1&start=2024-12-01&end=2024-12-31"
```

---

## 🐛 Common Issues & Solutions

### Issue: CORS Errors

**Solution:**
Check backend `config/cors.php`:
```php
$allowedOrigins = [
    'http://localhost:5173',
    'https://your-netlify-url.netlify.app'
];
```

### Issue: API Base URL Not Working

**Solution:**
1. Check `.env` file exists
2. Verify variable name starts with `VITE_`
3. Restart dev server after env changes
4. On Netlify, set in environment variables UI

### Issue: Routes Return 404 on Netlify

**Solution:**
Ensure `_redirects` file exists:
```
/*    /index.html   200
```

### Issue: Images Not Loading

**Solution:**
- Use relative paths: `/images/photo.jpg`
- Or full URLs from backend/CDN
- Check CORS for external images

---

## 📚 Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@tanstack/react-query": "^5.12.0",
    "axios": "^1.6.2",
    "react-hot-toast": "^2.4.1",
    "@heroicons/react": "^2.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "vite-plugin-pwa": "^0.17.4",
    "tailwindcss": "^3.3.6",
    "@tailwindcss/forms": "^0.5.7"
  }
}
```

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
cd frontend && npm install

# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Deploy to Netlify (with CLI)
netlify deploy --prod --dir=dist
```

---

## 📖 Additional Resources

- **React Router**: https://reactrouter.com/
- **React Query**: https://tanstack.com/query/latest
- **Tailwind CSS**: https://tailwindcss.com/
- **Vite**: https://vitejs.dev/
- **Netlify Docs**: https://docs.netlify.com/

---

## ✨ Summary

The Somansa frontend provides a complete, modern, and responsive interface for rental property management:

- ✅ **Public browsing** without authentication
- ✅ **Direct booking** with simple form
- ✅ **Booking tracking** by reference number
- ✅ **Calendar view** for availability
- ✅ **Mobile-responsive** design
- ✅ **PWA-ready** for installation
- ✅ **Netlify-optimized** for static deployment
- ✅ **Real-time** API integration with React Query

All public pages work independently and can be used without login, making it easy for customers to browse and book properties instantly!

---

**Last Updated:** November 29, 2024  
**Version:** 1.0.0
