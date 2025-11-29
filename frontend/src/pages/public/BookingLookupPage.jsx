import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../../api/bookingsApi';
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  HomeIcon,
  UserIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const BookingLookupPage = () => {
  const [bookingNumber, setBookingNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['booking-lookup', searchTerm],
    queryFn: () => bookingsApi.list({ search: searchTerm }),
    enabled: false  // Only run when explicitly called
  });

  const bookings = data?.data || [];
  const booking = bookings.length > 0 ? bookings[0] : null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (bookingNumber.trim()) {
      setSearchTerm(bookingNumber.trim());
      refetch();
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending_payment: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      checked_in: 'bg-green-100 text-green-800',
      checked_out: 'bg-purple-100 text-purple-800',
      canceled: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Draft',
      pending_payment: 'Pending Payment',
      confirmed: 'Confirmed',
      checked_in: 'Checked In',
      checked_out: 'Checked Out',
      canceled: 'Canceled',
      completed: 'Completed'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Booking
          </h1>
          <p className="text-lg text-gray-600">
            Enter your booking reference number to view details
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter booking reference (e.g., BK-2024-001)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  value={bookingNumber}
                  onChange={(e) => setBookingNumber(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
            <p className="text-red-800">Failed to search booking. Please try again.</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && searchTerm && !booking && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <p className="text-yellow-800 text-lg mb-2">
              No booking found with reference: <span className="font-mono font-bold">{searchTerm}</span>
            </p>
            <p className="text-yellow-700">
              Please check your booking number and try again.
            </p>
          </div>
        )}

        {/* Booking Details */}
        {booking && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-primary-600 text-white px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100 text-sm mb-1">Booking Reference</p>
                  <h2 className="text-2xl font-bold font-mono">{booking.booking_number}</h2>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)} bg-white`}>
                  {getStatusLabel(booking.status)}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <CalendarIcon className="h-6 w-6 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Check-in</p>
                    <p className="text-gray-900 font-medium">{formatDate(booking.start_datetime)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CalendarIcon className="h-6 w-6 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Check-out</p>
                    <p className="text-gray-900 font-medium">{formatDate(booking.end_datetime)}</p>
                  </div>
                </div>
              </div>

              {/* Property & Unit */}
              <div className="border-t pt-6">
                <div className="flex items-start space-x-3 mb-4">
                  <HomeIcon className="h-6 w-6 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Property</p>
                    <p className="text-gray-900 font-medium">{booking.property_name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <HomeIcon className="h-6 w-6 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Unit</p>
                    <p className="text-gray-900 font-medium">{booking.unit_name || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="border-t pt-6">
                <div className="flex items-start space-x-3">
                  <CurrencyDollarIcon className="h-6 w-6 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Price</p>
                    <p className="text-2xl text-gray-900 font-bold">
                      Rp {Number(booking.total_price).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {booking.notes && (
                <div className="border-t pt-6">
                  <p className="text-sm text-gray-600 mb-2">Notes</p>
                  <p className="text-gray-900">{booking.notes}</p>
                </div>
              )}

              {/* Timeline Status */}
              <div className="border-t pt-6">
                <p className="text-sm font-medium text-gray-700 mb-4">Booking Timeline</p>
                <div className="space-y-3">
                  {['draft', 'pending_payment', 'confirmed', 'checked_in', 'checked_out', 'completed'].map((status, index) => {
                    const statuses = ['draft', 'pending_payment', 'confirmed', 'checked_in', 'checked_out', 'completed'];
                    const currentIndex = statuses.indexOf(booking.status);
                    const isActive = index <= currentIndex;
                    const isCanceled = booking.status === 'canceled';
                    
                    return (
                      <div key={status} className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          isActive && !isCanceled ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isActive && !isCanceled ? (
                            <CheckCircleIcon className="h-5 w-5" />
                          ) : (
                            <span className="text-xs">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${isActive && !isCanceled ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                            {getStatusLabel(status)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {booking.status === 'canceled' && (
                    <div className="flex items-center space-x-3 mt-3 pt-3 border-t border-red-200">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center">
                        ✕
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-red-900 font-medium">Booking Canceled</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="border-t pt-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2 mb-2">
                  <ClockIcon className="h-4 w-4" />
                  <span>Created: {formatDate(booking.created_at)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4" />
                  <span>Last Updated: {formatDate(booking.updated_at)}</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-8 py-4">
              <button
                onClick={() => {
                  setBookingNumber('');
                  setSearchTerm('');
                }}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Search another booking
              </button>
            </div>
          </div>
        )}

        {/* Help Text */}
        {!booking && !searchTerm && (
          <div className="text-center text-gray-600 mt-8">
            <p className="mb-2">Don't have your booking reference?</p>
            <p className="text-sm">
              You should have received it after creating your booking. Please check your confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingLookupPage;
