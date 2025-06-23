import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Reviews.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Reviews = () => {
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/spaces`);
      setSpaces(response.data.spaces);
    } catch (error) {
      console.error('Error fetching spaces:', error);
      setError('Failed to load spaces. Please try again later.');
    }
  };

  const handleReviewClick = (space) => {
    setSelectedSpace(space);
    setShowReviewModal(true);
    setReviewText('');
    setError(null);
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      setError('Please enter a review');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Please login to submit a review');
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/reviews`, {
        space_id: selectedSpace.id,
        user_id: userId,
        rating: 5, // Default rating since we're not using stars
        review_text: reviewText
      });

      if (response.data.success) {
        setSpaces(spaces.map(space =>
          space.id === selectedSpace.id
            ? { ...space, reviews: [...(space.reviews || []), response.data.review] }
            : space
        ));
        setShowReviewModal(false);
        setReviewText('');
        setError(null);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="reviews-container">
        <h1 className="reviews-title">Space Reviews</h1>
        {error && <p className="error-message">{error}</p>}
        
        <div className="spaces-grid">
          {spaces.map((space) => (
            <div key={space.id} className="space-card">
              <img 
                src={space.image_urls[0]} 
                alt={space.space_name} 
                className="space-image"
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  e.target.onerror = null;
                  e.target.src = '/default-space.jpg';
                }}
              />
              <div className="space-info">
                <h3>{space.space_name}</h3>
                <p className="location">
                  <i className="fas fa-map-marker-alt"></i> {space.location}
                </p>
                <button 
                  className="review-button"
                  onClick={() => handleReviewClick(space)}
                >
                  Write a Review
                </button>
              </div>
            </div>
          ))}
        </div>

        {showReviewModal && selectedSpace && (
          <div className="review-modal">
            <div className="review-modal-content">
              <h2>Review {selectedSpace.space_name}</h2>
              <textarea
                placeholder="Write your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="review-textarea"
              />
              <div className="modal-buttons">
                <button 
                  className="submit-button"
                  onClick={handleSubmitReview}
                >
                  Submit Review
                </button>
                <button 
                  className="cancel-button"
                  onClick={() => setShowReviewModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Reviews;
