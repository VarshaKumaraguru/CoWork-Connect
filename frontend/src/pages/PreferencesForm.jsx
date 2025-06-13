import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PreferencesForm.css';
import Navbar from '../components/Navbar';

const PreferencesForm = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    location: '',
    hours: '',
    facilities: '',
    price: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store preferences in localStorage
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    // Navigate to UserDashboard
    navigate('/UserDashboard');
  };

  return (
    <>
      <Navbar />
      <div className="preferences-container">
        <div className="preferences-form-box">
          <h2>Tell Us Your Preferences</h2>
          <p>Help us find the perfect workspace for you</p>
          
          <form onSubmit={handleSubmit} className="preferences-form">
            <div className="form-group">
              <label htmlFor="location">Preferred Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={preferences.location}
                onChange={handleChange}
                placeholder="Enter your preferred area"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="hours">Number of Hours</label>
              <input
                type="number"
                id="hours"
                name="hours"
                value={preferences.hours}
                onChange={handleChange}
                placeholder="How many hours do you need?"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="facilities">Required Facilities</label>
              <input
                type="text"
                id="facilities"
                name="facilities"
                value={preferences.facilities}
                onChange={handleChange}
                placeholder="e.g., WiFi, Printer, Meeting Room"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Maximum Price per Hour</label>
              <input
                type="number"
                id="price"
                name="price"
                value={preferences.price}
                onChange={handleChange}
                placeholder="Enter your budget"
                min="0"
                required
              />
            </div>

            <button type="submit" className="submit-button">
              Find Spaces
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PreferencesForm; 