import AdminLayout from '../../components/admin/AdminLayout';
import './AdminTable.css';

const AdminAnalytics = () => {
  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1>Analytics & Reports</h1>
            <p>View detailed analytics and insights</p>
          </div>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="stat-card">
            <h3>Revenue This Month</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>
              Rp 125.5M
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>+15% from last month</p>
          </div>

          <div className="stat-card">
            <h3>Bookings This Month</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>
              256
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>+12% from last month</p>
          </div>

          <div className="stat-card">
            <h3>Average Booking Value</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>
              Rp 4.8M
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>+8% from last month</p>
          </div>

          <div className="stat-card">
            <h3>Occupancy Rate</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>
              78.5%
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>+5% from last month</p>
          </div>
        </div>

        <div style={{ marginTop: '2rem', padding: '3rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📊 Advanced Analytics</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Detailed charts, graphs, and reports coming soon...
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            This demo admin panel includes basic analytics. Full analytics dashboard with charts can be implemented.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
