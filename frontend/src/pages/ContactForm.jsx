import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    error: null
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(prevState => ({ ...prevState, submitting: true, error: null }));

    try {
      await axios.post(`${API_BASE_URL}/api/contact`, formData);
      setStatus({
        submitted: true,
        submitting: false,
        error: null
      });
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      setStatus({
        submitted: false,
        submitting: false,
        error: error.response?.data?.message || 'Something went wrong. Please try again.'
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="contact-container">
        <div className="contact-form-container">
          <h1>Contact Us</h1>
          <p className="form-description">
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </p>

          {status.submitted ? (
            <div className="success-message">
              <h2>Thank you for your message!</h2>
              <p>We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Enter your message, feedback, or query"
                  rows="5"
                />
              </div>

              {status.error && (
                <div className="error-message">
                  {status.error}
                </div>
              )}

              <button 
                type="submit" 
                className="submit-button"
                disabled={status.submitting}
              >
                {status.submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
export default ContactForm; 
