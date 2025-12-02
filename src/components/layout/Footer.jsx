export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Somansa</h3>
            <p>Smart Rental System for houses, boarding, and car rentals.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/properties">Browse Properties</a></li>
              <li><a href="/favorites">My Favorites</a></li>
              <li><a href="/compare">Compare Properties</a></li>
              <li><a href="/booking-lookup">Check Booking</a></li>
              <li><a href="/overview">Overview</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Somansa Smart Rental System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
