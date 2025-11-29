import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Active Bookings</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
          <Link to="/customer/bookings" className="text-sm text-primary-600 hover:underline mt-2 inline-block">
            View all →
          </Link>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Pending Payments</h3>
          <p className="text-3xl font-bold text-orange-600">0</p>
          <Link to="/customer/invoices" className="text-sm text-primary-600 hover:underline mt-2 inline-block">
            View invoices →
          </Link>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
          <p className="text-3xl font-bold text-gray-900">Rp 0</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <p className="text-gray-500">No bookings yet</p>
        <Link to="/properties" className="btn-primary mt-4 inline-block">
          Make a Booking
        </Link>
      </div>
    </div>
  );
};

export default CustomerDashboard;
