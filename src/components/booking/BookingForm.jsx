import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCreateBooking } from '../../hooks/useBookings';
import ErrorMessage from '../common/ErrorMessage';

export default function BookingForm({ propertyId, unitId, propertyType, onSuccess }) {
  const [formData, setFormData] = useState({
    propertyId: propertyId || '',
    unitId: unitId || '',
    startDate: null,
    endDate: null,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    notes: '',
  });

  const createBooking = useCreateBooking();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await createBooking.mutateAsync({
        property_id: formData.propertyId,
        unit_id: formData.unitId,
        start_date: formData.startDate?.toISOString(),
        end_date: formData.endDate?.toISOString(),
        guest_name: formData.guestName,
        guest_email: formData.guestEmail,
        guest_phone: formData.guestPhone,
        notes: formData.notes,
      });
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const isCarRental = propertyType === 'car';

  return (
    <div className="booking-form-container">
      <h3>Book {isCarRental ? 'This Car' : 'This Unit'}</h3>
      
      {createBooking.isError && (
        <ErrorMessage 
          message={createBooking.error?.response?.data?.message || 'Failed to create booking'} 
        />
      )}

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="guestName">Full Name *</label>
            <input
              type="text"
              id="guestName"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="guestEmail">Email *</label>
            <input
              type="email"
              id="guestEmail"
              name="guestEmail"
              value={formData.guestEmail}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="guestPhone">Phone Number *</label>
          <input
            type="tel"
            id="guestPhone"
            name="guestPhone"
            value={formData.guestPhone}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="+62 812 3456 7890"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              {isCarRental ? 'Pick-up Date *' : 'Start Date *'}
            </label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
              selectsStart
              startDate={formData.startDate}
              endDate={formData.endDate}
              minDate={new Date()}
              required
              className="form-input"
              dateFormat={isCarRental ? 'Pp' : 'P'}
              showTimeSelect={isCarRental}
              placeholderText={isCarRental ? 'Select pick-up date & time' : 'Select start date'}
            />
          </div>

          <div className="form-group">
            <label>
              {isCarRental ? 'Return Date *' : 'End Date *'}
            </label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
              selectsEnd
              startDate={formData.startDate}
              endDate={formData.endDate}
              minDate={formData.startDate || new Date()}
              required
              className="form-input"
              dateFormat={isCarRental ? 'Pp' : 'P'}
              showTimeSelect={isCarRental}
              placeholderText={isCarRental ? 'Select return date & time' : 'Select end date'}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-input"
            rows="3"
            placeholder="Any special requests or notes..."
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-block"
          disabled={createBooking.isPending}
        >
          {createBooking.isPending ? 'Processing...' : 'Submit Booking'}
        </button>
      </form>
    </div>
  );
}
