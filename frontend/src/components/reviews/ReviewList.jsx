import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { reviewsApi } from '../../api/reviewsApi';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const ReviewList = ({ propertyId, unitId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['reviews', propertyId, unitId],
    queryFn: () => {
      if (propertyId) {
        return reviewsApi.getByProperty(propertyId);
      } else if (unitId) {
        return reviewsApi.getByUnit(unitId);
      }
      return reviewsApi.list();
    },
    enabled: !!(propertyId || unitId)
  });

  const reviews = data?.data || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIcon key={star} className="h-5 w-5 text-yellow-400" />
          ) : (
            <StarOutlineIcon key={star} className="h-5 w-5 text-gray-300" />
          )
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load reviews
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No reviews yet. Be the first to review!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold text-gray-900">{review.customer_name}</h4>
              <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
            </div>
            {renderStars(review.rating)}
          </div>
          
          <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
          
          {review.owner_reply && (
            <div className="mt-4 pl-4 border-l-4 border-primary-200 bg-primary-50 p-4 rounded">
              <p className="text-sm font-medium text-primary-900 mb-1">Owner Reply:</p>
              <p className="text-sm text-primary-800">{review.owner_reply}</p>
              {review.owner_reply_at && (
                <p className="text-xs text-primary-600 mt-2">
                  {formatDate(review.owner_reply_at)}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
