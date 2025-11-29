import React from 'react';
import { Link } from 'react-router-dom';
import { BuildingOfficeIcon, HomeIcon, TruckIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  const features = [
    {
      name: 'Houses & Villas',
      description: 'Rent beautiful houses and villas for your vacation or long-term stay.',
      icon: HomeIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Boarding Rooms',
      description: 'Affordable and comfortable boarding rooms for students and workers.',
      icon: BuildingOfficeIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Cars & Vehicles',
      description: 'Wide selection of cars and vehicles for rent with or without driver.',
      icon: TruckIcon,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              Smart Rental Management
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Find and manage house, boarding, and car rentals in one place
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/properties" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Browse Properties
              </Link>
              <Link to="/register" className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">What We Offer</h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose from a variety of rental options to suit your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="text-center p-6 rounded-lg hover:shadow-lg transition">
                <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full ${feature.color} text-white mb-4`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Find Your Perfect Rental?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of satisfied customers who found their ideal rental through Somansa
          </p>
          <Link to="/properties" className="btn-primary px-8 py-3 text-lg">
            Explore Properties
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
