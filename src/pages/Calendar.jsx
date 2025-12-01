import { useState } from 'react';
import Layout from '../components/layout/Layout';
import CalendarView from '../components/calendar/CalendarView';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useProperties, usePropertyUnits } from '../hooks/useProperties';
import { useBookings } from '../hooks/useBookings';

export default function Calendar() {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');

  const { data: properties, isLoading: propertiesLoading } = useProperties();
  const { data: units, isLoading: unitsLoading } = usePropertyUnits(selectedProperty);
  const { data: allBookings, isLoading: bookingsLoading, isError, error, refetch } = useBookings();

  const filteredBookings = allBookings?.filter(booking => {
    if (!selectedProperty) return false;
    if (booking.propertyId !== selectedProperty) return false;
    if (selectedUnit && booking.unitId !== selectedUnit) return false;
    return true;
  }) || [];

  return (
    <Layout>
      <div className="calendar-page">
        <div className="container">
          <div className="page-header">
            <h1>Booking Calendar</h1>
            <p>View property and unit availability</p>
          </div>

          <div className="calendar-filters">
            <div className="form-group">
              <label htmlFor="property">Select Property</label>
              <select
                id="property"
                value={selectedProperty}
                onChange={(e) => {
                  setSelectedProperty(e.target.value);
                  setSelectedUnit('');
                }}
                className="form-input"
                disabled={propertiesLoading}
              >
                <option value="">-- Select Property --</option>
                {properties?.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProperty && (
              <div className="form-group">
                <label htmlFor="unit">Select Unit (Optional)</label>
                <select
                  id="unit"
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  className="form-input"
                  disabled={unitsLoading}
                >
                  <option value="">All Units</option>
                  {units?.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name || `Unit ${unit.number}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {!selectedProperty && (
            <div className="info-message">
              <p>Please select a property to view the calendar</p>
            </div>
          )}

          {selectedProperty && bookingsLoading && (
            <LoadingSpinner message="Loading calendar..." />
          )}

          {selectedProperty && isError && (
            <ErrorMessage 
              message={error?.response?.data?.message || 'Failed to load bookings'} 
              onRetry={refetch}
            />
          )}

          {selectedProperty && !bookingsLoading && !isError && (
            <>
              <div className="bookings-count">
                {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'} found
              </div>
              <CalendarView bookings={filteredBookings} />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
