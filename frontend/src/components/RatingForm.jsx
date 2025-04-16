import { useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import { toast } from 'react-hot-toast';

const RatingForm = ({ userId, transactionId, onRatingSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [previousRating, setPreviousRating] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  
  // Check if user has already rated this transaction
useEffect(() => {
  const checkPreviousRating = async () => {
    if (!userId || !transactionId) {
      setIsChecking(false);
      return;
    }
    
    try {
      console.log('Checking rating for:', userId, transactionId); // Debug log
      const response = await authAPI.checkRating(userId, transactionId);
      console.log('Rating check response:', response); // Debug response
      
      if (response && response.hasRated) {
        setAlreadyRated(true);
        setPreviousRating(response.rating);
      }
    } catch (error) {
      console.error('Error checking previous rating:', error);
    } finally {
      setIsChecking(false);
    }
  };
  
  checkPreviousRating();
}, [userId, transactionId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authAPI.rateUser(userId, {
        score: rating,
        comment,
        transactionId
      });
      
      if (response.success) {
        toast.success('Rating submitted successfully');
        setAlreadyRated(true);
        setPreviousRating({
          score: rating,
          comment: comment
        });
        if (onRatingSubmitted) {
          onRatingSubmitted();
        }
        setComment('');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error(error.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };
  
  // Display a loading state while checking rating status
  if (isChecking) {
    return (
      <div className="glass-card p-4 rounded-lg flex justify-center items-center">
        <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Checking rating status...</span>
      </div>
    );
  }
  
  // If already rated, show the existing rating
  if (alreadyRated && previousRating) {
    return (
      <div className="glass-card p-4 rounded-lg">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg 
                key={star}
                className={`w-6 h-6 ${star <= previousRating.score ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            You've already rated this user ({previousRating.score}/5)
          </p>
          {previousRating.comment && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-600 dark:text-gray-300 italic">
              "{previousRating.comment}"
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Otherwise, show the rating form
  return (
    <form onSubmit={handleSubmit} className="glass-card p-5 rounded-lg space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex items-center justify-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none transition transform hover:scale-110"
            >
              <svg 
                className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} cursor-pointer hover:text-yellow-300`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
        <p className="text-center text-sm mt-1 text-gray-500 dark:text-gray-400">
          {rating === 1 && "Poor"}
          {rating === 2 && "Fair"}
          {rating === 3 && "Good"}
          {rating === 4 && "Very Good"}
          {rating === 5 && "Excellent"}
        </p>
      </div>
      
      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-2">Comment (Optional)</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none min-h-[100px]"
          placeholder="Share your experience with this user..."
        ></textarea>
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </span>
        ) : 'Submit Rating'}
      </button>
    </form>
  );
};

export default RatingForm;