import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import avatarImage from '../assets/avatar.png';
import celebrationAvatar from '../assets/celebrationAvatar.png';
import './SpaceFormStyle.css';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SpaceForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    space_name: '',
    location: '',
    price_per_hour: '',
    amenities: '',
    duration: '',
    description: '',
    owner_id: '', // Will be set from localStorage
  });

  const [images, setImages] = useState([]);
  const [upiQR, setUpiQR] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [username, setUsername] = useState('');

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    // Get stored user info
    const storedUsername = localStorage.getItem('username');
    const storedOwnerId = localStorage.getItem('ownerId');

    if (storedUsername) setUsername(storedUsername);
    if (storedOwnerId) {
      setFormData(prev => ({ ...prev, owner_id: storedOwnerId }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
  };

  const handleUPIQRChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpiQR(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus('uploading');
    setErrorMessage('');

    if (!upiQR) {
      setErrorMessage('UPI QR code is required');
      setUploadStatus('error');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // Add space images
    images.forEach((img) => {
      data.append('images', img);
    });

    // Add UPI QR code
    console.log("Adding UPI QR code to form data:", upiQR.name); // Debug log
    data.append('upi_qr', upiQR);

    try {
      console.log("Submitting form data..."); // Debug log
      console.log("Form data contents:", {
        owner_id: formData.owner_id,
        space_name: formData.space_name,
        location: formData.location,
        price_per_hour: formData.price_per_hour,
        amenities: formData.amenities,
        duration: formData.duration,
        description: formData.description,
        images_count: images.length,
        upi_qr_name: upiQR.name,
        upi_qr_type: upiQR.type
      }); // Debug log

      const response = await axios.post(`${API_BASE_URL}/spaceowner/space`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Server response:", response.data); // Debug log
      setUploadStatus('success');
      setShowConfetti(true);

      setTimeout(() => {
        navigate('/SpaceList');
      }, 3500);
    } catch (error) {
      console.error("Error uploading space:", error); // Debug log
      if (error.response) {
        console.error("Error response data:", error.response.data); // Debug log
      }
      setUploadStatus('error');
      setErrorMessage(error.response?.data?.error || 'Failed to upload space. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="top-half" />
        <div className="wave-wrapper">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path d="M0,150 C360,50 1080,250 1440,150 L1440,320 L0,320 Z" />
          </svg>
        </div>
        <div className="bottom-half" />

        <div className="form-container">
          {uploadStatus === 'success' ? (
            <div className="animation-wrapper">
              {showConfetti && (
                <>
                  <Confetti
                    width={windowSize.width / 2}
                    height={windowSize.height}
                    numberOfPieces={400}
                    recycle={false}
                    gravity={0.3}
                    initialVelocityY={10}
                    run={true}
                    style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }}
                  />
                  <Confetti
                    width={windowSize.width / 2}
                    height={windowSize.height}
                    numberOfPieces={400}
                    recycle={false}
                    gravity={0.3}
                    initialVelocityY={10}
                    run={true}
                    style={{ position: 'fixed', top: 0, right: 0, pointerEvents: 'none' }}
                  />
                </>
              )}
              <motion.img
                src={celebrationAvatar}
                alt="Celebrating Avatar"
                className="celebration-avatar"
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                }}
              />
              <h2 className="success-message">🎉 Space uploaded successfully! 🎉</h2>
            </div>
          ) : (
            <div className="form-content">
              <div className="form-image">
                <img src={avatarImage} alt="Avatar" />
              </div>
              <div className="form-box">
                <h2>Welcome, {username}! List Your Coworking Space</h2>
                {uploadStatus === 'error' && (
                  <div className="error-message">{errorMessage}</div>
                )}
                <form onSubmit={handleSubmit}>
                  <input
                    name="space_name"
                    placeholder="Space Name"
                    onChange={handleChange}
                    value={formData.space_name}
                    required
                  />
                  <input
                    name="location"
                    placeholder="Location"
                    onChange={handleChange}
                    value={formData.location}
                    required
                  />
                  <input
                    name="price_per_hour"
                    type="number"
                    placeholder="Price per hour"
                    onChange={handleChange}
                    value={formData.price_per_hour}
                    required
                  />
                  <input
                    name="amenities"
                    placeholder="Amenities"
                    onChange={handleChange}
                    value={formData.amenities}
                    required
                  />
                  <input
                    name="duration"
                    placeholder="Duration"
                    onChange={handleChange}
                    value={formData.duration}
                    required
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                    value={formData.description}
                    required
                  />
                  <div className="file-upload-section">
                    <div className="upload-group">
                      <label>Space Images (up to 5)</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                      />
                    </div>
                    <div className="upload-group">
                      <label>UPI QR Code</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUPIQRChange}
                        required
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button type="submit" disabled={uploadStatus === 'uploading'}>
                      {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Space'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => navigate('/spacelist')}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'background-color 0.3s ease'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                    >
                      View Your Spaces
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SpaceForm;
