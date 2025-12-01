import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import BookingCard from '../components/booking/BookingCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useProperties } from '../hooks/useProperties';
import { useBookings } from '../hooks/useBookings';

export default function Overview() {
  const { data: properties, isLoading: propertiesLoading } = useProperties();
  const { data: bookings, isLoading: bookingsLoading, isError, error, refetch } = useBookings();

  const activeBookings = bookings?.filter(b => 
    b.status === 'confirmed' || b.status === 'pending'
  ) || [];

  const latestBookings = bookings?.slice(0, 10) || [];

  return (
    <Layout>
      <div className="overview-page">
        <div className="container">
          <div className="page-header">
            <h1>Overview</h1>
            <p>System statistics and recent bookings</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏠</div>
              <div className="stat-content">
                <div className="stat-value">
                  {propertiesLoading ? '...' : properties?.length || 0}
                </div>
                <div className="stat-label">Total Properties</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <div className="stat-value">
                  {bookingsLoading ? '...' : bookings?.length || 0}
                </div>
                <div className="stat-label">Total Bookings</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✓</div>
              <div className="stat-content">
                <div className="stat-value">
                  {bookingsLoading ? '...' : activeBookings.length}
                </div>
                <div className="stat-label">Active Bookings</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <div className="stat-value">
                  <Link to="/calendar" className="stat-link">View</Link>
                </div>
                <div className="stat-label">Calendar</div>
              </div>
            </div>
          </div>

          <section className="latest-bookings-section">
            <h2>Latest Bookings</h2>

            {bookingsLoading && <LoadingSpinner message="Loading bookings..." />}

            {isError && (
              <ErrorMessage 
                message={error?.response?.data?.message || 'Failed to load bookings'} 
                onRetry={refetch}
              />
            )}

            {!bookingsLoading && !isError && (
              <>
                {latestBookings.length === 0 ? (
                  <div className="no-data">
                    <p>No bookings yet</p>
                  </div>
                ) : (
                  <div className="bookings-grid">
                    {latestBookings.map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}
