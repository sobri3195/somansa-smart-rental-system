import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { propertiesApi } from '../../api/propertiesApi';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const PropertyListPage = () => {
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    search: '',
    min_price: '',
    max_price: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertiesApi.list(filters),
    keepPreviousData: true
  });

  const properties = data?.data || [];

  const propertyTypes = [
    { value: '', label: 'All Types' },
    { value: 'house', label: 'House/Villa' },
    { value: 'kos', label: 'Boarding/Kos' },
    { value: 'car', label: 'Car/Vehicle' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      city: '',
      search: '',
      min_price: '',
      max_price: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Available Properties
          </h1>
          <p className="text-gray-600">
            Browse through our collection of houses, boarding rooms, and vehicles
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={filters.min_price}
                  onChange={(e) => handleFilterChange('min_price', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="Any"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={filters.max_price}
                  onChange={(e) => handleFilterChange('max_price', e.target.value)}
                />
              </div>

              {/* Clear Filters */}
              <div className="md:col-span-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800">Failed to load properties. Please try again.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && properties.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg">No properties found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {!isLoading && !error && properties.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Link
                  key={property.id}
                  to={`/properties/${property.id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden group"
                >
                  {/* Property Image */}
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    {property.photos && property.photos.length > 0 ? (
                      <img
                        src={property.photos[0]}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span>No image</span>
                      </div>
                    )}
                    
                    {/* Type Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-800 shadow-sm">
                        {property.type === 'house' && '🏠 House'}
                        {property.type === 'kos' && '🏢 Kos'}
                        {property.type === 'car' && '🚗 Car'}
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition">
                      {property.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 flex items-center">
                      📍 {property.city}
                    </p>
                    {property.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {property.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm text-gray-600">
                        {property.unit_count || 0} units available
                      </div>
                      <div className="text-primary-600 font-semibold">
                        View Details →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Results Count */}
            <div className="mt-6 text-center text-gray-600">
              Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyListPage;
