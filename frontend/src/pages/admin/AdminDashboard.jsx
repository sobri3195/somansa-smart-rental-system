import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { name: 'Total Bookings', value: '0', change: '+0%', color: 'text-blue-600' },
    { name: 'Active Properties', value: '0', change: '+0%', color: 'text-green-600' },
    { name: 'Revenue (Month)', value: 'Rp 0', change: '+0%', color: 'text-purple-600' },
    { name: 'Pending Payments', value: '0', change: '-0%', color: 'text-orange-600' }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <p className="text-sm font-medium text-gray-600">{stat.name}</p>
            <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.change} from last month</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
          <p className="text-gray-500">No recent bookings</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Upcoming Check-ins</h2>
          <p className="text-gray-500">No upcoming check-ins</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
