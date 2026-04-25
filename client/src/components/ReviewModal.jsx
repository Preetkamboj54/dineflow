import React, { useState } from 'react';
import api from '../utils/api';

const StarRating = ({ rating, onRate, label }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{label}</p>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            className={`text-2xl transition ${star <= rating ? 'text-amber-400' : 'text-gray-200'}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
};

const ReviewModal = ({ order, onClose }) => {
  const [restaurantRating, setRestaurantRating] = useState(5);
  const [dishRatings, setDishRatings] = useState(
    order.items.map(item => ({ menuItemId: item.menuItemId._id, name: item.menuItemId.name, rating: 5 }))
  );
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDishRate = (menuItemId, rating) => {
    setDishRatings(prev => prev.map(dr => 
      dr.menuItemId === menuItemId ? { ...dr, rating } : dr
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/api/reviews', {
        orderId: order._id,
        restaurantRating,
        dishRatings: dishRatings.map(({ menuItemId, rating }) => ({ menuItemId, rating })),
        comment
      });
      alert('Thank you for your feedback!');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <header className="mb-8 text-center">
          <h2 className="text-3xl font-black mb-2">Rate Your Experience</h2>
          <p className="text-[var(--text-muted)] font-medium">How was your meal from {order.restaurantId?.name}?</p>
        </header>

        {error && (
          <div className="bg-red-50 text-[var(--danger)] p-4 rounded-xl text-sm mb-6 font-bold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100 flex justify-center">
            <StarRating 
              label="Overall Restaurant Rating"
              rating={restaurantRating} 
              onRate={setRestaurantRating} 
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">Rate the Dishes</h3>
            {dishRatings.map((dish) => (
              <div key={dish.menuItemId} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                <span className="font-medium text-sm">{dish.name}</span>
                <StarRating 
                  rating={dish.rating} 
                  onRate={(val) => handleDishRate(dish.menuItemId, val)} 
                />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label className="text-sm font-bold">Write a comment (Optional)</label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike?"
              className="w-full p-4 rounded-xl border min-h-[100px]"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary flex-1 shadow-lg shadow-primary/30"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
