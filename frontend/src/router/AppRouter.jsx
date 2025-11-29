import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';
import CustomerLayout from '../components/layout/CustomerLayout';

// Public pages
import HomePage from '../pages/public/HomePage';
import PropertyListPage from '../pages/public/PropertyListPage';
import PropertyDetailPage from '../pages/public/PropertyDetailPage';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Customer pages
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import MyBookings from '../pages/customer/MyBookings';
import BookingDetail from '../pages/customer/BookingDetail';
import MyInvoices from '../pages/customer/MyInvoices';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import PropertiesPage from '../pages/admin/PropertiesPage';
import UnitsPage from '../pages/admin/UnitsPage';
import BookingsPage from '../pages/admin/BookingsPage';
import CalendarPage from '../pages/admin/CalendarPage';
import InvoicesPage from '../pages/admin/InvoicesPage';
import CustomersPage from '../pages/admin/CustomersPage';
import SettingsPage from '../pages/admin/SettingsPage';

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children, requiredRoles }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && !hasRole(requiredRoles)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Guest route wrapper (redirect if authenticated)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRouter = () => {
  const { isCustomer } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertyListPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
      </Route>

      {/* Auth routes */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      {/* Customer routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute requiredRoles="customer">
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="bookings/:id" element={<BookingDetail />} />
        <Route path="invoices" element={<MyInvoices />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRoles={['staff', 'owner', 'super_admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="units" element={<UnitsPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Default dashboard redirect based on role */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {isCustomer() ? (
              <Navigate to="/customer/dashboard" replace />
            ) : (
              <Navigate to="/admin/dashboard" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
