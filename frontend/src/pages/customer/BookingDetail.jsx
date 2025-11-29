import React from 'react';
import { useParams } from 'react-router-dom';

const BookingDetail = () => {
  const { id } = useParams();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Booking Details</h1>
      <div className="card">
        <p className="text-gray-500">Booking ID: {id}</p>
        <p className="text-gray-500">Detailed booking information will be displayed here</p>
      </div>
    </div>
  );
};

export default BookingDetail;
