import React from 'react';
import '../pages/SpaceCardStyle.css';

const SpaceCard = ({ space, onDelete }) => {
  const imageUrls = (() => {
    if (Array.isArray(space.image_urls)) {
      return space.image_urls;
    } else if (typeof space.image_urls === 'string') {
      return space.image_urls.split(',').map(url => url.trim());
    } else {
      return [];
    }
  })();

  return (
    <div className="space-card">
      <div className="space-image">
        {imageUrls.length > 0 ? (
          <img
            src={`http://localhost:5000/uploads/images/${imageUrls[0]}`}
            alt={space.space_name}
          />
        ) : (
          <div className="no-image">No image available</div>
        )}
      </div>
      <div className="space-details">
        <h3>{space.space_name}</h3>
        <p className="location">
          <i className="fas fa-map-marker-alt"></i> {space.location}
        </p>
        <p className="price">₹{space.price_per_hour} per hour</p>
        <p className="duration">Duration: {space.duration}</p>
        <p className="amenities">
          <strong>Amenities:</strong> {space.amenities}
        </p>
        <p className="description">{space.description}</p>

        {/* Delete button */}
        <button onClick={() => onDelete(space.id)} className="delete-button">
          Delete
        </button>
      </div>
    </div>
  );
};

export default SpaceCard;