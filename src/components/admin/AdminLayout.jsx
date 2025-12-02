import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { adminUser, logoutAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { path: '/adminsuper/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/adminsuper/properties', icon: '🏠', label: 'Properties' },
    { path: '/adminsuper/bookings', icon: '📅', label: 'Bookings' },
    { path: '/adminsuper/users', icon: '👥', label: 'Users' },
    { path: '/adminsuper/analytics', icon: '📈', label: 'Analytics' },
    { path: '/adminsuper/reviews', icon: '⭐', label: 'Reviews' },
    { path: '/adminsuper/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Link to="/adminsuper/dashboard" className="logo">
            <span className="logo-icon">🏢</span>
            <span className="logo-text">Somansa Admin</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="nav-item">
            <span className="nav-icon">🌐</span>
            <span className="nav-label">Back to Site</span>
          </Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="header-search">
            <input type="text" placeholder="Search..." className="search-input" />
          </div>

          <div className="header-actions">
            <button className="header-btn notification-btn">
              🔔
              <span className="notification-badge">3</span>
            </button>

            <div className="user-menu">
              <button className="user-menu-trigger">
                <img src={adminUser?.avatar} alt={adminUser?.name} className="user-avatar" />
                <div className="user-info">
                  <span className="user-name">{adminUser?.name}</span>
                  <span className="user-role">{adminUser?.role}</span>
                </div>
              </button>
              <div className="user-menu-dropdown">
                <Link to="/adminsuper/profile" className="dropdown-item">
                  👤 Profile
                </Link>
                <Link to="/adminsuper/settings" className="dropdown-item">
                  ⚙️ Settings
                </Link>
                <button onClick={handleLogout} className="dropdown-item">
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
