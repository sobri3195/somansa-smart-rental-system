import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import BookingLookup from './pages/BookingLookup';
import Overview from './pages/Overview';
import Calendar from './pages/Calendar';
import Favorites from './pages/Favorites';
import Compare from './pages/Compare';
import { ToastProvider } from './components/common/Toast';
import { AdminProvider } from './contexts/AdminContext';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSettings from './pages/admin/AdminSettings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AdminProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<PropertyList />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/booking-lookup" element={<BookingLookup />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/compare" element={<Compare />} />
              
              <Route path="/adminsuper" element={<AdminLogin />} />
              <Route path="/adminsuper/dashboard" element={<AdminDashboard />} />
              <Route path="/adminsuper/properties" element={<AdminProperties />} />
              <Route path="/adminsuper/bookings" element={<AdminBookings />} />
              <Route path="/adminsuper/users" element={<AdminUsers />} />
              <Route path="/adminsuper/analytics" element={<AdminAnalytics />} />
              <Route path="/adminsuper/reviews" element={<AdminReviews />} />
              <Route path="/adminsuper/settings" element={<AdminSettings />} />
            </Routes>
          </BrowserRouter>
        </AdminProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
