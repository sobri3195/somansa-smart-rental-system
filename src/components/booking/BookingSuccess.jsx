import { Link } from 'react-router-dom';

export default function BookingSuccess({ booking }) {
  return (
    <div className="booking-success">
      <div className="success-icon">✓</div>
      <h2>Booking Successful!</h2>
      <p className="success-message">
        Your booking has been created successfully.
      </p>
      
      <div className="booking-info">
        <div className="info-item">
          <span className="info-label">Booking Reference:</span>
          <span className="info-value booking-code">{booking.code || booking.id}</span>
        </div>
        
        {booking.email && (
          <p className="info-note">
            A confirmation email has been sent to <strong>{booking.email}</strong>
          </p>
        )}
      </div>

      <div className="success-actions">
        <Link to={`/booking-lookup?code=${booking.code || booking.id}`} className="btn btn-primary">
          View Booking Details
        </Link>
        <Link to="/properties" className="btn btn-secondary">
          Browse More Properties
        </Link>
      </div>
    </div>
  );
}
