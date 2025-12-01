import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Badge from '../components/common/Badge';
import { useBookingLookup } from '../hooks/useBookings';
import { useInvoice } from '../hooks/useInvoice';
import { formatDate, formatDateTime } from '../utils/dateUtils';
import { formatCurrency, getStatusColor } from '../utils/formatters';

export default function BookingLookup() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookingCode, setBookingCode] = useState(searchParams.get('code') || '');
  const [searchedCode, setSearchedCode] = useState(searchParams.get('code') || '');

  const { data: booking, isLoading, isError, error } = useBookingLookup(searchedCode);
  const { data: invoice } = useInvoice(booking?.id);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchedCode(bookingCode);
    setSearchParams({ code: bookingCode });
  };

  const isCarBooking = booking?.propertyType === 'car';

  return (
    <Layout>
      <div className="booking-lookup-page">
        <div className="container">
          <div className="page-header">
            <h1>Check Your Booking</h1>
            <p>Enter your booking reference code to view details</p>
          </div>

          <form onSubmit={handleSearch} className="lookup-form">
            <div className="form-group">
              <input
                type="text"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
                placeholder="Enter booking code (e.g., BK12345)"
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search Booking
            </button>
          </form>

          {isLoading && <LoadingSpinner message="Looking up booking..." />}

          {isError && (
            <ErrorMessage 
              message={error?.response?.status === 404 
                ? 'Booking not found. Please check your booking code.' 
                : 'Failed to retrieve booking details.'
              } 
            />
          )}

          {booking && (
            <div className="booking-detail">
              <div className="booking-detail-header">
                <div>
                  <h2>Booking Details</h2>
                  <p className="booking-code">Reference: {booking.code || booking.id}</p>
                </div>
                <Badge variant={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </div>

              <div className="detail-grid">
                <div className="detail-section">
                  <h3>Property Information</h3>
                  <div className="detail-item">
                    <span className="label">Property:</span>
                    <span className="value">{booking.propertyName}</span>
                  </div>
                  {booking.unitName && (
                    <div className="detail-item">
                      <span className="label">Unit:</span>
                      <span className="value">{booking.unitName}</span>
                    </div>
                  )}
                  {booking.propertyType && (
                    <div className="detail-item">
                      <span className="label">Type:</span>
                      <span className="value">{booking.propertyType}</span>
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Guest Information</h3>
                  {booking.guestName && (
                    <div className="detail-item">
                      <span className="label">Name:</span>
                      <span className="value">{booking.guestName}</span>
                    </div>
                  )}
                  {booking.guestEmail && (
                    <div className="detail-item">
                      <span className="label">Email:</span>
                      <span className="value">{booking.guestEmail}</span>
                    </div>
                  )}
                  {booking.guestPhone && (
                    <div className="detail-item">
                      <span className="label">Phone:</span>
                      <span className="value">{booking.guestPhone}</span>
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Booking Period</h3>
                  <div className="detail-item">
                    <span className="label">
                      {isCarBooking ? 'Pick-up:' : 'Check-in:'}
                    </span>
                    <span className="value">
                      {isCarBooking ? formatDateTime(booking.startDate) : formatDate(booking.startDate)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">
                      {isCarBooking ? 'Return:' : 'Check-out:'}
                    </span>
                    <span className="value">
                      {isCarBooking ? formatDateTime(booking.endDate) : formatDate(booking.endDate)}
                    </span>
                  </div>
                  {booking.duration && (
                    <div className="detail-item">
                      <span className="label">Duration:</span>
                      <span className="value">{booking.duration} days</span>
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Payment</h3>
                  {booking.totalPrice && (
                    <div className="detail-item">
                      <span className="label">Total Price:</span>
                      <span className="value price">{formatCurrency(booking.totalPrice)}</span>
                    </div>
                  )}
                  {booking.paymentStatus && (
                    <div className="detail-item">
                      <span className="label">Payment Status:</span>
                      <span className="value">
                        <Badge variant={getStatusColor(booking.paymentStatus)}>
                          {booking.paymentStatus}
                        </Badge>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {booking.notes && (
                <div className="detail-section">
                  <h3>Additional Notes</h3>
                  <p>{booking.notes}</p>
                </div>
              )}

              {invoice && (
                <div className="invoice-section">
                  <h3>Invoice</h3>
                  <div className="invoice-info">
                    <div className="detail-item">
                      <span className="label">Invoice Number:</span>
                      <span className="value">{invoice.invoiceNumber}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Issue Date:</span>
                      <span className="value">{formatDate(invoice.issueDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Due Date:</span>
                      <span className="value">{formatDate(invoice.dueDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Amount:</span>
                      <span className="value price">{formatCurrency(invoice.amount)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
