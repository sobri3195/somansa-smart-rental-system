import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCompare } from '../../hooks/useCompare';
import { useFavorites } from '../../hooks/useFavorites';

export default function Header() {
  const { count } = useCompare();
  const { favorites } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Somansa</span>
          </Link>
          
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          
          <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/properties" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Browse</Link>
            <Link to="/favorites" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              <span className="nav-link-text">Favorites</span>
              {favorites.length > 0 && <span className="nav-badge">{favorites.length}</span>}
            </Link>
            <Link to="/compare" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              <span className="nav-link-text">Compare</span>
              {count > 0 && <span className="nav-badge">{count}</span>}
            </Link>
            <Link to="/booking-lookup" className="nav-link" onClick={() => setMobileMenuOpen(false)}>My Booking</Link>
            <Link to="/overview" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Overview</Link>
            <Link to="/adminsuper" className="nav-link admin-link" onClick={() => setMobileMenuOpen(false)}>
              <span className="admin-icon">🔐</span> Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
