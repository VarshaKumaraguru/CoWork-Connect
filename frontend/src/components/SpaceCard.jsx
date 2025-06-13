import React, { useState } from 'react';
import axios from 'axios';
import './SpaceCard.css';
import defaultSpaceImage from '../assets/default-space.jpg';

const SpaceCard = ({ space, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this space?')) {
      try {
        await onDelete(space.id);
      } catch (error) {
        console.error('Error deleting space:', error);
      }
    }
  };

  // Function to get all image URLs
  const getImageUrls = () => {
    if (space.image_urls && space.image_urls.length > 0) {
      return space.image_urls.map(url => {
        if (url.startsWith('http')) {
          return url;
        }
        return `http://localhost:5000${url}`;
      });
    }
    return [defaultSpaceImage];
  };

  const imageUrls = getImageUrls();

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="space-card">
      <div className="space-image">
        <img 
          src={imageUrls[currentImageIndex]} 
          alt={space.space_name}
          onError={(e) => {
            console.error('Image failed to load:', e.target.src);
            e.target.onerror = null;
            e.target.src = defaultSpaceImage;
          }}
        />
        {imageUrls.length > 1 && (
          <>
            <button 
              className="slider-button prev-button" 
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              &#10094;
            </button>
            <button 
              className="slider-button next-button" 
              onClick={handleNextImage}
              aria-label="Next image"
            >
              &#10095;
            </button>
            <div className="image-counter">
              {currentImageIndex + 1} / {imageUrls.length}
            </div>
          </>
        )}
      </div>
      <div className="space-details">
        <h3>{space.space_name}</h3>
        <p className="location">{space.location}</p>
        <p className="price">₹{space.price_per_hour}/hour</p>
        <p className="capacity">Capacity: {space.capacity} people</p>
        <p className="description">{space.description}</p>
        <div className="space-actions">
          <button onClick={handleDelete} className="delete-button">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpaceCard; 