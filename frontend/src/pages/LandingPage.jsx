import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  // For space finders
  const handleExploreRedirect = () => {
    navigate('/signin');  // Space finder sign-in
  };

  // For space owners
  const handleListRedirect = () => {
    navigate('/spaceowner/signin');  // Space owner sign-in
  };

  return (
    <>
      <Navbar />
      <div className="landing-page">
        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <h1>Welcome to CoWork Connect</h1>
          <p>Find and book coworking spaces anytime, anywhere</p>
          <div className="button-group">
            <button className="primary-btn" onClick={handleExploreRedirect}>
              Explore Spaces
            </button>
            <button className="secondary-btn" onClick={handleListRedirect}>
              List Your Space
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LandingPage;