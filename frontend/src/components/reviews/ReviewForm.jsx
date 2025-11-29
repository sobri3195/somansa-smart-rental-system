import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../../api/reviewsApi';
import toast from 'react-hot-toast';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const ReviewForm = ({ bookingId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const createReview = useMutation({
    mutationFn: (data) => reviewsApi.create(data),
    onSuccess: () => {
      toast.success('Review submitted successfully!');
      queryClient.invalidateQueries(['reviews']);
      setRating(0);
      setComment('');
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(error.error || 'Failed to submit review');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }
    
    createReview.mutate({
      booking_id: bookingId,
      rating,
      comment
    });
  };

  const renderStarInput = (star) => {
    const filled = (hoveredRating || rating) >= star;
    
    return (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoveredRating(star)}
        onMouseLeave={() => setHoveredRating(0)}
        className="focus:outline-none"
      >
        {filled ? (
          <StarIcon className="h-8 w-8 text-yellow-400 transition" />
        ) : (
          <StarOutlineIcon className="h-8 w-8 text-gray-300 transition" />
        )}
      </button>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map(renderStarInput)}
        </div>
        {rating > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </p>
        )}
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows="5"
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          minLength={10}
        />
        <p className="text-sm text-gray-500 mt-1">
          Minimum 10 characters ({comment.length}/10)
        </p>
      </div>
      
      <button
        type="submit"
        disabled={createReview.isLoading}
        className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
      >
        {createReview.isLoading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
