import React from 'react';
import { useParams } from 'react-router-dom';

const PropertyDetailPage = () => {
  const { id } = useParams();
  
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Property Details</h1>
      <p className="text-gray-600">Property ID: {id}</p>
      <p className="text-gray-600">Property details, photos, units, and booking form will be displayed here</p>
    </div>
  );
};

export default PropertyDetailPage;
