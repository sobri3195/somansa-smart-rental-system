# Somansa - Architecture Documentation

## Overview

Somansa is a modern React Single Page Application (SPA) built for managing rental properties including houses, boarding (kos), and car rentals. The application is designed to be deployed as static files on Netlify and consumes a REST JSON API.

## Tech Stack

### Core
- **React 18.2** - UI framework with hooks
- **Vite 5.0** - Fast build tool and dev server
- **React Router v6** - Client-side routing

### Data Management
- **TanStack Query v5** (React Query) - Server state management, caching, and data fetching
- **Axios 1.6** - HTTP client for API communication

### UI Components
- **React DatePicker 4.25** - Date selection component
- **Custom CSS** - Mobile-first responsive design with CSS variables

### PWA Support
- **vite-plugin-pwa 0.17** - PWA integration with Workbox
- Service Worker for offline support
- Web App Manifest for installability

## Architecture Patterns

### Component Structure

```
src/
├── api/
│   └── client.js              # Axios instance + API endpoints
├── components/
│   ├── layout/                # Layout components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.jsx
│   ├── property/              # Property-related components
│   │   ├── PropertyCard.jsx
│   │   ├── PropertyFilter.jsx
│   │   └── UnitCard.jsx
│   ├── booking/               # Booking-related components
│   │   ├── BookingForm.jsx
│   │   ├── BookingCard.jsx
│   │   └── BookingSuccess.jsx
│   ├── calendar/              # Calendar components
│   │   └── CalendarView.jsx
│   └── common/                # Reusable components
│       ├── LoadingSpinner.jsx
│       ├── ErrorMessage.jsx
│       ├── Card.jsx
│       └── Badge.jsx
├── pages/                     # Route-level pages
│   ├── Home.jsx
│   ├── PropertyList.jsx
│   ├── PropertyDetail.jsx
│   ├── BookingLookup.jsx
│   ├── Overview.jsx
│   └── Calendar.jsx
├── hooks/                     # Custom React hooks
│   ├── useProperties.js
│   ├── useBookings.js
│   ├── useAvailability.js
│   └── useInvoice.js
├── utils/                     # Utility functions
│   ├── dateUtils.js
│   └── formatters.js
├── App.jsx                    # Main app with routing
├── main.jsx                   # Application entry point
└── index.css                  # Global styles
```

### Data Flow

1. **API Client** (`src/api/client.js`)
   - Axios instance configured with base URL from environment
   - Organized API methods by domain (properties, bookings, availability, invoices)
   - Global error interceptor for logging

2. **Custom Hooks** (`src/hooks/`)
   - Encapsulate React Query logic
   - Provide consistent data fetching interface
   - Handle loading, error, and success states
   - Configure caching strategies per endpoint

3. **Components** 
   - Use custom hooks to fetch data
   - Display loading and error states
   - Pass data to child components via props
   - Handle user interactions and form submissions

### State Management

- **Server State**: Managed by React Query (TanStack Query)
  - Automatic caching and invalidation
  - Background refetching
  - Optimistic updates for mutations
  - Stale-while-revalidate strategy

- **Local State**: React useState and useReducer
  - Form inputs
  - UI state (selected units, filters, etc.)
  - No global state management needed

### Routing

React Router v6 with the following routes:

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with features |
| `/properties` | PropertyList | Browse and filter properties |
| `/properties/:id` | PropertyDetail | Property details with booking form |
| `/booking-lookup` | BookingLookup | Look up booking by code |
| `/overview` | Overview | Statistics dashboard |
| `/calendar` | Calendar | Booking calendar view |

All routes use client-side navigation with `<Link>` components.

## API Integration

### Expected API Endpoints

```javascript
// Properties
GET    /api/properties              // List all (with optional filters)
GET    /api/properties/:id          // Get property details
GET    /api/properties/:id/units    // Get units for property

// Bookings
GET    /api/bookings                // List bookings
GET    /api/bookings/:id            // Get booking details
POST   /api/bookings                // Create new booking
GET    /api/bookings/lookup/:code   // Look up by reference code

// Availability
GET    /api/availability/:propertyId/:unitId?start=YYYY-MM-DD&end=YYYY-MM-DD

// Invoices
GET    /api/invoices/:bookingId     // Get invoice for booking
```

### Request/Response Examples

**Create Booking (POST /api/bookings)**
```json
{
  "property_id": "123",
  "unit_id": "456",
  "start_date": "2024-01-15T10:00:00Z",
  "end_date": "2024-01-20T10:00:00Z",
  "guest_name": "John Doe",
  "guest_email": "john@example.com",
  "guest_phone": "+62 812 3456 7890",
  "notes": "Early check-in requested"
}
```

**Response**
```json
{
  "id": "789",
  "code": "BK12345",
  "status": "pending",
  "property_id": "123",
  "unit_id": "456",
  // ... other fields
}
```

### Caching Strategy

- **Properties**: 5 minutes stale time (frequently viewed, rarely change)
- **Bookings**: 2 minutes stale time (moderate change frequency)
- **Availability**: 1 minute stale time (frequently changes)
- **Mutations**: Invalidate related queries on success

## Styling

### CSS Architecture

- **CSS Variables** for theming (colors, spacing, shadows)
- **Mobile-First** responsive design
- **BEM-inspired** naming convention
- **No CSS preprocessor** - vanilla CSS with variables

### Responsive Breakpoints

```css
/* Mobile: < 768px (default) */
/* Tablet & Desktop: >= 768px */

@media (max-width: 768px) {
  /* Mobile adjustments */
}
```

### Design Tokens

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --spacing-md: 1rem;
  --border-radius: 8px;
  /* ... more tokens */
}
```

## PWA Features

### Service Worker

- **Strategy**: GenerateSW (Workbox)
- **Precaching**: All static assets (JS, CSS, HTML, icons)
- **Runtime Caching**: API responses with NetworkFirst strategy

### Manifest

```json
{
  "name": "Somansa - Smart Rental System",
  "short_name": "Somansa",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#2563eb",
  "background_color": "#ffffff"
}
```

### Offline Support

- Static assets served from cache
- API calls fall back to cache when offline
- User-friendly offline indicators (future enhancement)

## Deployment

### Netlify Configuration

**netlify.toml**
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Environment Variables**
- `VITE_API_BASE_URL` - Backend API base URL (required)

### Build Process

1. `npm install` - Install dependencies
2. `npm run build` - Build production bundle
3. Output to `dist/` directory
4. Deploy `dist/` to Netlify

### Netlify Redirects

The `_redirects` file ensures all routes resolve to `index.html` for client-side routing:

```
/*    /index.html   200
```

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env to set VITE_API_BASE_URL

# Start dev server
npm run dev
# App runs on http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Run ESLint
npm run lint
```

## Performance Optimizations

1. **Code Splitting**: React Router automatically splits code by route
2. **React Query Caching**: Reduces unnecessary API calls
3. **Service Worker**: Caches static assets for instant loading
4. **Image Optimization**: Lazy loading for property images (if implemented)
5. **Stale-While-Revalidate**: Show cached data while fetching fresh data

## Security Considerations

- **No Authentication**: All endpoints are public (as per requirements)
- **Input Validation**: Form validation on client-side
- **HTTPS**: Recommended for production deployment
- **CORS**: API must allow requests from the deployed domain

## Future Enhancements

Potential improvements for future iterations:

1. **Authentication**: User login and protected routes
2. **Payment Integration**: Online payment for bookings
3. **Real-time Updates**: WebSocket for live availability
4. **Push Notifications**: Booking reminders and updates
5. **Image Upload**: Property and unit photo management
6. **Multi-language**: i18n support for multiple languages
7. **Dark Mode**: Theme switcher
8. **Analytics**: Google Analytics or similar
9. **SEO**: Server-side rendering or static generation
10. **Advanced Filters**: Map view, amenities, ratings

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Common Issues

**API Connection Errors**
- Check `VITE_API_BASE_URL` environment variable
- Verify CORS is enabled on the API
- Check network tab for failed requests

**Build Failures**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (18+ recommended)

**Routing Issues on Netlify**
- Ensure `_redirects` file is in `public/` directory
- Verify netlify.toml redirect configuration

**PWA Not Installing**
- Check manifest.json is served correctly
- Ensure HTTPS is used (required for service workers)
- Check browser console for PWA errors
