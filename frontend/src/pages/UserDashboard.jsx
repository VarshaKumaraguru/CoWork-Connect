import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../components/Navbar';
import './UserDashboardStyle.css';
import ContactOwnerButton from './ContactOwnerButton';

const UserDashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [showAllSpaces, setShowAllSpaces] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [error, setError] = useState(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedSpaceReviews, setSelectedSpaceReviews] = useState(null);

  const userId = parseInt(localStorage.getItem('userId')); 

  useEffect(() => {
    document.body.classList.add('no-background');
    return () => document.body.classList.remove('no-background');
  }, []);

  const fetchSpaces = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/spaces");
      console.log("Spaces data with reviews:", response.data.spaces); // Debug log for spaces with reviews
      
      // The backend is already sending full URLs, so we don't need to transform them
      setSpaces(response.data.spaces);
      
      // Get user preferences from localStorage
      const userPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
      
      if (Object.keys(userPreferences).length > 0 && !showAllSpaces) {
        // Filter spaces based on preferences
        const filtered = response.data.spaces.filter(space => {
          const locationMatch = space.location.toLowerCase().includes(userPreferences.location.toLowerCase());
          const priceMatch = space.price_per_hour <= parseInt(userPreferences.price);
          const facilitiesMatch = userPreferences.facilities.toLowerCase().split(',').some(facility => 
            space.amenities.toLowerCase().includes(facility.trim())
          );
          
          return locationMatch || (priceMatch && facilitiesMatch);
        });
        
        setFilteredSpaces(filtered);
      } else {
        setFilteredSpaces(response.data.spaces);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching spaces:", error);
      setError("Failed to load spaces. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const handlePayment = async (spaceId) => {
    try {
      console.log("Attempting to fetch details for space:", spaceId); // Debug log
      // Fetch the space details including UPI QR code
      const response = await axios.get(`http://localhost:5000/api/spaces/${spaceId}`);
      console.log("Space details:", response.data); // Debug log
      
      if (!response.data) {
        throw new Error("No data received from server");
      }

      // The backend already provides the full URL, so we don't need to modify it
      setSelectedSpace(response.data);
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Error fetching space details:", error);
      let errorMessage = `Failed to load payment details for space ID ${spaceId}. `;
      
      if (error.response) {
        errorMessage += `Server responded with status ${error.response.status}: ${error.response.data.error || 'Unknown error'}`;
        console.error("Error response data:", error.response.data);
      } else if (error.request) {
        errorMessage += "No response received from server";
        console.error("Error request:", error.request);
      } else {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedSpace(null);
    setError(null);
  };

  const handleViewReviews = (space) => {
    console.log("Selected space for reviews:", space); // Debug log for selected space
    console.log("Space reviews:", space.reviews); // Debug log for reviews
    setSelectedSpaceReviews(space);
    setShowReviewsModal(true);
  };

  const handleMoreOptions = () => {
    setShowAllSpaces(true);
    setFilteredSpaces(spaces);
  };

  const ReviewsModal = ({ space, onClose }) => {
    if (!space) return null;
    
    console.log("ReviewsModal space data:", space); // Debug log for modal space data
    console.log("ReviewsModal reviews:", space.reviews); // Debug log for modal reviews

    return (
      <div className="reviews-modal">
        <div className="reviews-modal-content">
          <h2>Reviews for {space.space_name}</h2>
          <div className="reviews-list">
            {space.reviews && space.reviews.length > 0 ? (
              space.reviews.map(review => {
                console.log("Rendering review:", review); // Debug log for each review
                return (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <span className="reviewer-name">{review.user_name}</span>
                    </div>
                    <p className="review-text">{review.review_text}</p>
                    <span className="review-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                );
              })
            ) : (
              <p>No reviews yet</p>
            )}
          </div>
          <button className="close-button" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Explore Available Coworking Spaces</h2>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p>Loading spaces...</p>
        ) : (
          <div className="space-grid">
            {filteredSpaces.map((space) => (
              <div key={space.id} className="space-card">
                <img 
                  src={space.image_urls[0]} 
                  alt={space.space_name} 
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.onerror = null;
                    e.target.src = '/default-space.jpg';
                  }}
                />
                <h3>{space.space_name}</h3>
                <p><strong>Location:</strong> {space.location}</p>
                <p><strong>Price:</strong> Rs {space.price_per_hour}/hour</p>
                <p><strong>Space ID:</strong> {space.id}</p>
                <p>{space.description}</p>
                <div className="space-actions">
                  {space.owner_email && (
                    <ContactOwnerButton
                      ownerEmail={space.owner_email}
                      spaceName={space.space_name}
                    />
                  )}
                  <button 
                    className="pay-button"
                    onClick={() => handlePayment(space.id)}
                  >
                    Pay Now
                  </button>
                  <button 
                    className="view-reviews-button"
                    onClick={() => handleViewReviews(space)}
                  >
                    View Reviews
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showAllSpaces && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              className="more-options-button"
              onClick={handleMoreOptions}
            >
              More Options
            </button>
          </div>
        )}

        {showPaymentModal && selectedSpace && (
          <div className="payment-modal">
            <div className="payment-content">
              <h3>Payment for {selectedSpace.space_name}</h3>
              <p>Amount: ₹{selectedSpace.price_per_hour}/hour</p>
              {selectedSpace.upi_qr_code ? (
                <div className="upi-qr-section">
                  <img 
                    src={selectedSpace.upi_qr_code}
                    alt="UPI QR Code" 
                    className="upi-qr-code"
                    onError={(e) => {
                      console.error("Failed to load UPI QR code:", e.target.src);
                      e.target.style.display = 'none';
                    }}
                    onLoad={() => console.log("UPI QR code loaded successfully:", selectedSpace.upi_qr_code)}
                  />
                  <p>Scan QR code to pay</p>
                </div>
              ) : (
                <p>No UPI QR code available for this space owner</p>
              )}
              <button 
                className="close-button"
                onClick={handleClosePaymentModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showReviewsModal && selectedSpaceReviews && (
          <ReviewsModal 
            space={selectedSpaceReviews} 
            onClose={() => setShowReviewsModal(false)} 
          />
        )}
      </div>
    </>
  );
};

export default UserDashboard;