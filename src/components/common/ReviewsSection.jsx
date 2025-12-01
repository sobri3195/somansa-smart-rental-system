import { useState } from 'react';

export default function ReviewsSection({ propertyId }) {
  const [reviews, setReviews] = useState(() => {
    const stored = localStorage.getItem(`reviews-${propertyId}`);
    return stored ? JSON.parse(stored) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      id: Date.now(),
      name: name.trim() || 'Anonymous',
      rating,
      comment,
      date: new Date().toISOString()
    };
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews-${propertyId}`, JSON.stringify(updatedReviews));
    setName('');
    setComment('');
    setRating(5);
    setShowForm(false);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.round(rating));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3>Reviews & Ratings</h3>
        {reviews.length > 0 && (
          <div className="reviews-summary">
            <span className="average-rating">{averageRating}</span>
            <span className="stars">{renderStars(averageRating)}</span>
            <span className="review-count">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
          </div>
        )}
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="btn btn-primary btn-sm"
        style={{ marginBottom: '1rem' }}
      >
        {showForm ? 'Cancel' : '+ Write a Review'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>Your Name (Optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Anonymous"
            />
          </div>

          <div className="form-group">
            <label>Rating</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`star-btn ${star <= rating ? 'active' : ''}`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="form-input"
              rows="4"
              required
              placeholder="Share your experience..."
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit Review
          </button>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length === 0 && !showForm && (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        )}

        {reviews.map(review => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <strong>{review.name}</strong>
              <span className="review-date">{formatDate(review.date)}</span>
            </div>
            <div className="review-rating">{renderStars(review.rating)}</div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
