import React from 'react';

const BookingsPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <button className="btn-primary">Create Booking</button>
      </div>
      <div className="card">
        <p className="text-gray-500">Booking management interface with filters and actions will be displayed here</p>
      </div>
    </div>
  );
};

export default BookingsPage;
