import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import { formatCurrency, getStatusColor } from '../../utils/formatters';

export default function BookingCard({ booking }) {
  const isCarBooking = booking.propertyType === 'car';
  
  return (
    <Card className="booking-card">
      <div className="booking-header">
        <div>
          <h4>Booking #{booking.code || booking.id}</h4>
          <p className="booking-property">{booking.propertyName}</p>
        </div>
        <Badge variant={getStatusColor(booking.status)}>
          {booking.status}
        </Badge>
      </div>

      <div className="booking-details">
        <div className="booking-detail">
          <span className="detail-label">
            {isCarBooking ? 'Pick-up:' : 'Check-in:'}
          </span>
          <span className="detail-value">
            {isCarBooking ? formatDateTime(booking.startDate) : formatDate(booking.startDate)}
          </span>
        </div>

        <div className="booking-detail">
          <span className="detail-label">
            {isCarBooking ? 'Return:' : 'Check-out:'}
          </span>
          <span className="detail-value">
            {isCarBooking ? formatDateTime(booking.endDate) : formatDate(booking.endDate)}
          </span>
        </div>

        {booking.unitName && (
          <div className="booking-detail">
            <span className="detail-label">Unit:</span>
            <span className="detail-value">{booking.unitName}</span>
          </div>
        )}

        {booking.guestName && (
          <div className="booking-detail">
            <span className="detail-label">Guest:</span>
            <span className="detail-value">{booking.guestName}</span>
          </div>
        )}

        {booking.totalPrice && (
          <div className="booking-detail">
            <span className="detail-label">Total:</span>
            <span className="detail-value price">{formatCurrency(booking.totalPrice)}</span>
          </div>
        )}
      </div>

      <div className="booking-footer">
        <Link to={`/booking-lookup?code=${booking.code || booking.id}`} className="btn btn-sm btn-secondary">
          View Details
        </Link>
      </div>
    </Card>
  );
}
