import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminTable.css';

const AdminBookings = () => {
  const [bookings] = useState([
    {
      id: 1,
      bookingCode: 'BK20240101001',
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
      property: 'Apartment Central Jakarta',
      checkIn: '2024-01-15',
      checkOut: '2024-01-20',
      nights: 5,
      total: 7500000,
      status: 'confirmed',
      paymentStatus: 'paid',
    },
    {
      id: 2,
      bookingCode: 'BK20240101002',
      guestName: 'Jane Smith',
      guestEmail: 'jane@example.com',
      property: 'Villa Bali Paradise',
      checkIn: '2024-01-18',
      checkOut: '2024-01-25',
      nights: 7,
      total: 35000000,
      status: 'pending',
      paymentStatus: 'unpaid',
    },
    {
      id: 3,
      bookingCode: 'BK20240101003',
      guestName: 'Michael Johnson',
      guestEmail: 'michael@example.com',
      property: 'Studio Bandung',
      checkIn: '2024-01-20',
      checkOut: '2024-01-22',
      nights: 2,
      total: 1500000,
      status: 'confirmed',
      paymentStatus: 'paid',
    },
  ]);

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

  const getPaymentBadge = (status) => {
    const badges = {
      paid: 'badge-success',
      unpaid: 'badge-danger',
      partial: 'badge-warning',
      refunded: 'badge-info',
    };
    return badges[status] || 'badge-default';
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1>Bookings Management</h1>
            <p>Manage all bookings and reservations</p>
          </div>
          <Link to="/admin/bookings/new" className="btn btn-primary">
            + New Booking
          </Link>
        </div>

        <div className="table-controls">
          <div className="search-box">
            <input type="text" placeholder="Search bookings..." className="search-input" />
          </div>

          <div className="filter-tabs">
            <button className="filter-tab active">All</button>
            <button className="filter-tab">Pending</button>
            <button className="filter-tab">Confirmed</button>
            <button className="filter-tab">Completed</button>
          </div>
        </div>

        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Booking Code</th>
                <th>Guest</th>
                <th>Property</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Nights</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <Link to={`/admin/bookings/${booking.id}`} className="property-name">
                      {booking.bookingCode}
                    </Link>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 500 }}>{booking.guestName}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {booking.guestEmail}
                      </div>
                    </div>
                  </td>
                  <td>{booking.property}</td>
                  <td>{booking.checkIn}</td>
                  <td>{booking.checkOut}</td>
                  <td>{booking.nights}</td>
                  <td>{formatCurrency(booking.total)}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getPaymentBadge(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/admin/bookings/${booking.id}`}
                        className="action-btn edit"
                        title="View Details"
                      >
                        👁️
                      </Link>
                      <button className="action-btn delete" title="Cancel">
                        ❌
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
