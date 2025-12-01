import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const { loginAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    loginAdmin();
    navigate('/admin/dashboard');
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-logo">🏢</div>
            <h1>Somansa Admin Panel</h1>
            <p>Demo Administration Dashboard</p>
          </div>

          <div className="demo-info">
            <div className="info-badge">
              <span className="badge-icon">ℹ️</span>
              <div>
                <strong>Demo Mode</strong>
                <p>No authentication required - instant access to demo admin panel</p>
              </div>
            </div>
          </div>

          <div className="demo-credentials">
            <h3>Demo Account Details</h3>
            <div className="credential-item">
              <span className="credential-label">Username:</span>
              <span className="credential-value">demo_admin</span>
            </div>
            <div className="credential-item">
              <span className="credential-label">Email:</span>
              <span className="credential-value">admin@somansa.demo</span>
            </div>
            <div className="credential-item">
              <span className="credential-label">Role:</span>
              <span className="credential-value">Super Admin</span>
            </div>
          </div>

          <button onClick={handleDemoLogin} className="btn-demo-login">
            Enter Admin Dashboard
            <span className="btn-icon">→</span>
          </button>

          <div className="admin-features">
            <h3>Admin Panel Features</h3>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">🏠</span>
                <span>Property Management</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📅</span>
                <span>Booking Management</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <span>User Management</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Analytics & Reports</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⭐</span>
                <span>Review Moderation</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚙️</span>
                <span>System Settings</span>
              </div>
            </div>
          </div>

          <div className="back-to-site">
            <a href="/" className="back-link">
              ← Back to Main Site
            </a>
          </div>
        </div>

        <div className="admin-login-footer">
          <p>© 2024 Somansa Rental System. Demo Admin Panel.</p>
          <p className="demo-note">
            This is a demonstration admin panel with no real authentication.
            All data is for demo purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
