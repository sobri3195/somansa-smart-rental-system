import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { adminUser } = useAdmin();
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingBookings: 0,
    occupancyRate: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const mockStats = {
      totalProperties: 48,
      totalBookings: 256,
      totalRevenue: 1250000000,
      activeUsers: 892,
      pendingBookings: 12,
      occupancyRate: 78.5,
    };

    const mockRecentBookings = [
      {
        id: 1,
        bookingCode: 'BK20240101001',
        guestName: 'John Doe',
        property: 'Apartment Central Jakarta',
        checkIn: '2024-01-15',
        checkOut: '2024-01-20',
        total: 7500000,
        status: 'confirmed',
      },
      {
        id: 2,
        bookingCode: 'BK20240101002',
        guestName: 'Jane Smith',
        property: 'Villa Bali Paradise',
        checkIn: '2024-01-18',
        checkOut: '2024-01-25',
        total: 15000000,
        status: 'pending',
      },
      {
        id: 3,
        bookingCode: 'BK20240101003',
        guestName: 'Michael Johnson',
        property: 'Studio Bandung',
        checkIn: '2024-01-20',
        checkOut: '2024-01-22',
        total: 3000000,
        status: 'confirmed',
      },
    ];

    const mockActivities = [
      { id: 1, type: 'booking', message: 'New booking received: BK20240101003', time: '5 minutes ago' },
      { id: 2, type: 'property', message: 'Property "Villa Bali Paradise" updated', time: '15 minutes ago' },
      { id: 3, type: 'payment', message: 'Payment received for BK20240101001', time: '1 hour ago' },
      { id: 4, type: 'review', message: 'New review for "Apartment Central Jakarta"', time: '2 hours ago' },
      { id: 5, type: 'user', message: 'New user registered', time: '3 hours ago' },
    ];

    setStats(mockStats);
    setRecentBookings(mockRecentBookings);
    setRecentActivities(mockActivities);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      confirmed: 'badge-success',
      cancelled: 'badge-danger',
      completed: 'badge-info',
    };
    return badges[status] || 'badge-default';
  };

  const getActivityIcon = (type) => {
    const icons = {
      booking: '📅',
      property: '🏠',
      payment: '💰',
      review: '⭐',
      user: '👤',
    };
    return icons[type] || '📌';
  };

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {adminUser?.name}!</p>
          </div>
          <div className="dashboard-actions">
            <Link to="/admin/properties/new" className="btn btn-primary">
              + Add Property
            </Link>
            <Link to="/admin/bookings/new" className="btn btn-secondary">
              + New Booking
            </Link>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon bg-blue">🏢</div>
            <div className="stat-content">
              <p className="stat-label">Total Properties</p>
              <h3 className="stat-value">{stats.totalProperties}</h3>
              <span className="stat-change positive">+3 this month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-green">📅</div>
            <div className="stat-content">
              <p className="stat-label">Total Bookings</p>
              <h3 className="stat-value">{stats.totalBookings}</h3>
              <span className="stat-change positive">+18 this week</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-purple">💰</div>
            <div className="stat-content">
              <p className="stat-label">Total Revenue</p>
              <h3 className="stat-value">{formatCurrency(stats.totalRevenue)}</h3>
              <span className="stat-change positive">+12% from last month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-orange">👥</div>
            <div className="stat-content">
              <p className="stat-label">Active Users</p>
              <h3 className="stat-value">{stats.activeUsers}</h3>
              <span className="stat-change positive">+45 this month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-yellow">⏳</div>
            <div className="stat-content">
              <p className="stat-label">Pending Bookings</p>
              <h3 className="stat-value">{stats.pendingBookings}</h3>
              <span className="stat-change neutral">Needs attention</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-teal">📊</div>
            <div className="stat-content">
              <p className="stat-label">Occupancy Rate</p>
              <h3 className="stat-value">{stats.occupancyRate}%</h3>
              <span className="stat-change positive">+5% from last month</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Bookings</h2>
              <Link to="/admin/bookings" className="view-all-link">
                View All →
              </Link>
            </div>
            <div className="bookings-table">
              <table>
                <thead>
                  <tr>
                    <th>Booking Code</th>
                    <th>Guest</th>
                    <th>Property</th>
                    <th>Check In</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <Link to={`/admin/bookings/${booking.id}`} className="booking-link">
                          {booking.bookingCode}
                        </Link>
                      </td>
                      <td>{booking.guestName}</td>
                      <td>{booking.property}</td>
                      <td>{booking.checkIn}</td>
                      <td>{formatCurrency(booking.total)}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Activity</h2>
            </div>
            <div className="activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="quick-links">
          <h2>Quick Actions</h2>
          <div className="quick-links-grid">
            <Link to="/admin/properties" className="quick-link-card">
              <div className="quick-link-icon">🏠</div>
              <h3>Manage Properties</h3>
              <p>View and edit properties</p>
            </Link>
            <Link to="/admin/bookings" className="quick-link-card">
              <div className="quick-link-icon">📅</div>
              <h3>Manage Bookings</h3>
              <p>Handle bookings and reservations</p>
            </Link>
            <Link to="/admin/analytics" className="quick-link-card">
              <div className="quick-link-icon">📊</div>
              <h3>View Analytics</h3>
              <p>Insights and reports</p>
            </Link>
            <Link to="/admin/settings" className="quick-link-card">
              <div className="quick-link-icon">⚙️</div>
              <h3>Settings</h3>
              <p>Configure system settings</p>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
