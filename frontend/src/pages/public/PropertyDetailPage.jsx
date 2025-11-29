import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { propertiesApi, unitsApi } from '../../api/propertiesApi';
import { bookingsApi } from '../../api/bookingsApi';
import toast from 'react-hot-toast';
import { 
  MapPinIcon, 
  HomeIcon, 
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    unit_id: '',
    start_datetime: '',
    end_datetime: '',
    notes: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Fetch property details
  const { data: propertyData, isLoading: propertyLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesApi.getById(id)
  });

  const property = propertyData?.data?.property;
  const units = property?.units || [];

  // Booking mutation
  const createBooking = useMutation({
    mutationFn: (data) => bookingsApi.create(data),
    onSuccess: (response) => {
      setBookingSuccess(response.data);
      toast.success('Booking created successfully!');
      setShowBookingForm(false);
      setBookingData({
        unit_id: '',
        start_datetime: '',
        end_datetime: '',
        notes: ''
      });
    },
    onError: (error) => {
      toast.error(error.error || 'Failed to create booking');
    }
  });

  const handleBookNow = (unit) => {
    setSelectedUnit(unit);
    setBookingData(prev => ({
      ...prev,
      unit_id: unit.id
    }));
    setShowBookingForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    
    // Validate dates
    if (!bookingData.start_datetime || !bookingData.end_datetime) {
      toast.error('Please select start and end dates');
      return;
    }

    if (new Date(bookingData.start_datetime) >= new Date(bookingData.end_datetime)) {
      toast.error('End date must be after start date');
      return;
    }

    // Submit booking
    createBooking.mutate({
      ...bookingData,
      property_id: property.id,
      booking_source: 'online',
      status: 'draft'
    });
  };

  const getPricingModeLabel = (mode) => {
    const labels = {
      hourly: 'per hour',
      daily: 'per day',
      weekly: 'per week',
      monthly: 'per month'
    };
    return labels[mode] || mode;
  };

  if (propertyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <Link to="/properties" className="text-primary-600 hover:text-primary-700">
            Back to properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/properties" className="text-gray-600 hover:text-gray-900">Properties</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{property.name}</span>
        </nav>

        {/* Success Message */}
        {bookingSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start">
              <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1 mr-3" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Booking Created Successfully!
                </h3>
                <p className="text-green-800 mb-2">
                  Your booking reference: <span className="font-mono font-bold">{bookingSuccess.booking?.booking_number}</span>
                </p>
                <p className="text-green-700 mb-4">
                  Please save this reference number for your records.
                </p>
                <button
                  onClick={() => setBookingSuccess(null)}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Create another booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Form */}
        {showBookingForm && !bookingSuccess && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Book This Unit</h2>
              <button
                onClick={() => setShowBookingForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {selectedUnit && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-900">{selectedUnit.name}</h3>
                <p className="text-sm text-gray-600">
                  Rp {Number(selectedUnit.base_price).toLocaleString()} {getPricingModeLabel(selectedUnit.pricing_mode)}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={bookingData.start_datetime}
                    onChange={(e) => setBookingData({ ...bookingData, start_datetime: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={bookingData.end_datetime}
                    onChange={(e) => setBookingData({ ...bookingData, end_datetime: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="3"
                  placeholder="Any special requests or notes..."
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={createBooking.isLoading}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {createBooking.isLoading ? 'Creating...' : 'Confirm Booking'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Property Images */}
        <div className="mb-8">
          {property.photos && property.photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={property.photos[0]}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {property.photos.slice(1, 3).map((photo, index) => (
                <div key={index} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={photo}
                    alt={`${property.name} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No images available</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.name}</h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  {property.address}, {property.city}
                </div>
                <div className="flex items-center text-gray-600">
                  <HomeIcon className="h-5 w-5 mr-2" />
                  {property.type === 'house' && 'House/Villa'}
                  {property.type === 'kos' && 'Boarding/Kos'}
                  {property.type === 'car' && 'Car/Vehicle'}
                </div>
              </div>

              {property.description && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
                </div>
              )}
            </div>

            {/* Available Units */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Units</h2>
              
              {units.length === 0 ? (
                <p className="text-gray-600">No units available at this property.</p>
              ) : (
                <div className="space-y-4">
                  {units.map((unit) => (
                    <div
                      key={unit.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{unit.name}</h3>
                          {unit.code && (
                            <p className="text-sm text-gray-500">Code: {unit.code}</p>
                          )}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          unit.status === 'available' ? 'bg-green-100 text-green-800' :
                          unit.status === 'blocked' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {unit.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {unit.capacity && (
                          <div className="flex items-center text-sm text-gray-600">
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                            {unit.capacity} guests
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          Rp {Number(unit.base_price).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {getPricingModeLabel(unit.pricing_mode)}
                        </div>
                        {unit.deposit_amount > 0 && (
                          <div className="text-sm text-gray-600">
                            Deposit: Rp {Number(unit.deposit_amount).toLocaleString()}
                          </div>
                        )}
                      </div>

                      {unit.facilities && unit.facilities.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Facilities:</p>
                          <div className="flex flex-wrap gap-2">
                            {unit.facilities.map((facility, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs"
                              >
                                {facility}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {unit.status === 'available' && (
                        <button
                          onClick={() => handleBookNow(unit)}
                          className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
                        >
                          Book Now
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Info</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Units:</span>
                  <span className="font-medium text-gray-900">{units.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Available:</span>
                  <span className="font-medium text-green-600">
                    {units.filter(u => u.status === 'available').length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium text-gray-900">{property.city}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Link
                  to="/properties"
                  className="block w-full text-center px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  ← Back to Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
