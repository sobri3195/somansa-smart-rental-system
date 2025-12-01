# Somansa – Smart Rental System

A modern React SPA for managing house, boarding (kos), and car rentals.

## Features

- 🏠 Browse and search rental properties (houses, boarding, cars)
- 📅 Check availability and make bookings
- 📱 Progressive Web App (PWA) - works offline
- 🎨 Mobile-first responsive design
- ⚡ Fast loading with React Query caching
- 🔍 Booking lookup by reference code

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **TanStack Query (React Query)** - Data fetching and caching
- **Axios** - HTTP client
- **React Datepicker** - Date selection
- **PWA** - Service worker and manifest

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file in the root directory:

```bash
VITE_API_BASE_URL=https://your-api-url.com
```

Or use `.env.example` as a template:

```bash
cp .env.example .env
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment on Netlify

### Option 1: Connect Git Repository

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the repository in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_BASE_URL` with your API URL

### Option 2: Deploy via CLI

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Environment Variables

Set these in Netlify dashboard under Site settings → Build & deploy → Environment:

- `VITE_API_BASE_URL` - Your backend API base URL

## Project Structure

```
somansa-rental-system/
├── public/              # Static assets
│   ├── icon-192.png
│   ├── icon-512.png
│   └── favicon.ico
├── src/
│   ├── api/            # API client and endpoints
│   │   └── client.js
│   ├── components/     # Reusable components
│   │   ├── layout/
│   │   ├── property/
│   │   ├── booking/
│   │   └── common/
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── PropertyList.jsx
│   │   ├── PropertyDetail.jsx
│   │   ├── BookingLookup.jsx
│   │   ├── Overview.jsx
│   │   └── Calendar.jsx
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component with routes
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── netlify.toml        # Netlify configuration
├── vite.config.js      # Vite configuration
└── package.json
```

## API Integration

The app expects the following API endpoints:

### Properties
- `GET /api/properties` - List all properties
- `GET /api/properties/:id` - Get property details
- `GET /api/properties/:id/units` - Get units for a property

### Bookings
- `GET /api/bookings` - List bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/lookup/:code` - Lookup booking by code

### Availability
- `GET /api/availability/:propertyId/:unitId?start=YYYY-MM-DD&end=YYYY-MM-DD` - Check availability

### Invoices
- `GET /api/invoices/:bookingId` - Get invoice for booking

## PWA Features

- Offline capability with service worker
- Installable on mobile devices
- Cached static assets for faster loading
- Network-first strategy for API calls

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
