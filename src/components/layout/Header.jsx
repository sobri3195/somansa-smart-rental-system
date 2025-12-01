import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Somansa</span>
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/properties" className="nav-link">Browse</Link>
            <Link to="/booking-lookup" className="nav-link">My Booking</Link>
            <Link to="/overview" className="nav-link">Overview</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
