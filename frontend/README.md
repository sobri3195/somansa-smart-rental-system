# Somansa Rental System - Frontend (React + Netlify)

React PWA frontend for the Somansa Smart Rental System, optimized for deployment on Netlify.

## Tech Stack

- **React 18** with Hooks
- **Vite** - Build tool and dev server
- **React Router 6** - Client-side routing
- **TanStack Query** (React Query) - Server state management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Headless UI** - Accessible UI components
- **Heroicons** - Icon library
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications
- **Zustand** - Client state management (if needed)
- **Vite PWA Plugin** - Progressive Web App features

## Project Structure

```
frontend/
├── public/
│   ├── _redirects          # Netlify redirects for SPA
│   ├── manifest.json        # PWA manifest
│   └── icons/               # App icons for PWA
├── src/
│   ├── api/                 # API client layer
│   │   ├── client.js        # Axios instance with interceptors
│   │   ├── authApi.js       # Auth endpoints
│   │   ├── bookingsApi.js   # Bookings endpoints
│   │   ├── propertiesApi.js # Properties endpoints
│   │   └── calendarApi.js   # Calendar endpoints
│   ├── components/          # Reusable components
│   │   ├── layout/          # Layout components
│   │   ├── forms/           # Form components
│   │   ├── tables/          # Table components
│   │   └── calendar/        # Calendar components
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Authentication context
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Page components
│   │   ├── public/          # Public pages
│   │   ├── auth/            # Auth pages
│   │   ├── customer/        # Customer pages
│   │   └── admin/           # Admin pages
│   ├── router/              # Routing configuration
│   │   └── AppRouter.jsx    # Main router
│   ├── utils/               # Helper functions
│   ├── index.css            # Global styles
│   ├── App.jsx              # Root component
│   └── main.jsx             # Entry point
├── .env.example             # Environment variables template
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Dependencies
```

## Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running (see backend README)

### Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:

```env
VITE_API_BASE_URL=https://api.somansa.com
```

For local development:
```env
VITE_API_BASE_URL=http://localhost:8000
```

4. Start development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Adding New Features

#### 1. Create a new page

```jsx
// src/pages/example/ExamplePage.jsx
import React from 'react';

const ExamplePage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Example Page</h1>
      {/* Your content */}
    </div>
  );
};

export default ExamplePage;
```

#### 2. Add route in AppRouter.jsx

```jsx
import ExamplePage from '../pages/example/ExamplePage';

// Inside Routes component
<Route path="/example" element={<ExamplePage />} />
```

#### 3. Create API methods

```javascript
// src/api/exampleApi.js
import apiClient from './client';

export const exampleApi = {
  list: (params) => {
    return apiClient.get('/api/example/list.php', { params });
  },
  
  create: (data) => {
    return apiClient.post('/api/example/create.php', data);
  }
};
```

#### 4. Use with React Query

```jsx
import { useQuery } from '@tanstack/react-query';
import { exampleApi } from '../api/exampleApi';

const ExampleComponent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['examples'],
    queryFn: () => exampleApi.list()
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

## Deployment to Netlify

### Option 1: Connect Git Repository (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket

2. Go to [Netlify](https://app.netlify.com)

3. Click "Add new site" → "Import an existing project"

4. Select your repository

5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

6. Add environment variables in Netlify UI:
   - Go to Site Settings → Build & deploy → Environment
   - Add: `VITE_API_BASE_URL` = `https://api.somansa.com`

7. Deploy!

### Option 2: Manual Deploy via CLI

1. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Login to Netlify:

```bash
netlify login
```

3. Build the project:

```bash
npm run build
```

4. Deploy:

```bash
netlify deploy --prod --dir=dist
```

### Option 3: Drag and Drop

1. Build the project:

```bash
npm run build
```

2. Go to [Netlify Drop](https://app.netlify.com/drop)

3. Drag the `dist` folder to the drop zone

**Note:** You'll need to manually configure environment variables in Netlify UI.

## Environment Variables on Netlify

After deployment, configure environment variables:

1. Go to your site in Netlify Dashboard
2. Site settings → Environment variables
3. Add variables:

```
VITE_API_BASE_URL=https://api.somansa.com
VITE_APP_NAME=Somansa
VITE_ENABLE_PWA=true
```

4. Trigger a redeploy for changes to take effect

## PWA Features

The app is configured as a Progressive Web App with:

- **Service Worker** - Caches assets for offline access
- **Web Manifest** - Makes app installable
- **Offline Support** - Basic offline functionality
- **Install Prompts** - Native install experience

### Testing PWA Locally

1. Build the app:
```bash
npm run build
```

2. Preview:
```bash
npm run preview
```

3. Open Chrome DevTools → Application → Service Workers

## Routing on Netlify

The `public/_redirects` file ensures client-side routing works:

```
/*    /index.html   200
```

This redirects all routes to `index.html` so React Router can handle navigation.

## API Integration

### Authentication Flow

1. User logs in via `/login`
2. Backend returns JWT token
3. Token stored in `localStorage`
4. API client automatically adds token to all requests
5. On 401 response, user redirected to login

### Making API Calls

Use the API layer and React Query:

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/bookingsApi';
import toast from 'react-hot-toast';

const CreateBookingForm = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      toast.success('Booking created!');
      queryClient.invalidateQueries(['bookings']);
    },
    onError: (error) => {
      toast.error(error.error || 'Failed to create booking');
    }
  });

  const handleSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

## Styling with Tailwind CSS

### Utility Classes

```jsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <button className="btn-primary">Action</button>
</div>
```

### Custom Components (from index.css)

Pre-defined classes:
- `btn`, `btn-primary`, `btn-secondary`, `btn-success`, `btn-danger`
- `card`
- `input`, `label`
- `badge`, `badge-primary`, `badge-success`, `badge-warning`, `badge-danger`

## Authentication & Authorization

### Protected Routes

```jsx
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRoles={['owner', 'staff']}>
      <AdminLayout />
    </ProtectedRoute>
  }
/>
```

### Using Auth Context

```jsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, hasRole, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  if (hasRole('customer')) {
    return <CustomerView />;
  }

  return <AdminView />;
};
```

## Performance Optimization

### Code Splitting

Vite automatically code-splits by route. Additional splitting is configured in `vite.config.js`:

```javascript
rollupOptions: {
  output: {
    manualChunks: {
      'react-vendor': ['react', 'react-dom', 'react-router-dom'],
      'query-vendor': ['@tanstack/react-query', 'axios']
    }
  }
}
```

### React Query Caching

Configure stale time for API calls:

```javascript
const { data } = useQuery({
  queryKey: ['properties'],
  queryFn: propertiesApi.list,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

## Troubleshooting

### Issue: 404 on page refresh

**Solution:** Ensure `_redirects` file exists in `public/` folder:
```
/*    /index.html   200
```

### Issue: Environment variables not working

**Solution:** 
1. Prefix all env vars with `VITE_`
2. Restart dev server after changing `.env`
3. For Netlify, set them in UI and redeploy

### Issue: CORS errors

**Solution:**
1. Ensure backend has proper CORS headers
2. Check `VITE_API_BASE_URL` is correct
3. For local dev, backend should allow `http://localhost:5173`

### Issue: Build fails

**Solution:**
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Check Node.js version: `node -v` (should be 18+)
3. Clear Vite cache: `rm -rf node_modules/.vite`

## Security Best Practices

1. **Never commit `.env` file** - Use `.env.example` instead
2. **Validate user input** - Use React Hook Form with validation
3. **Sanitize data** - Escape HTML when rendering user content
4. **Use HTTPS** - Always use HTTPS in production
5. **JWT in localStorage** - Consider httpOnly cookies for production
6. **CSP Headers** - Configure in Netlify for added security

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari (latest 2 versions)
- Chrome Android (latest)

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Follow code style (ESLint will check)
3. Test in multiple browsers
4. Create pull request

## License

Proprietary - Somansa Rental System

## Support

For support, contact: support@somansa.com
