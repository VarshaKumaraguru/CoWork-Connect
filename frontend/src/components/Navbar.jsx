import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png'; 

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('userId') || localStorage.getItem('ownerId');

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('ownerId');
    localStorage.removeItem('username');
    // Redirect to landing page
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">COWORK CONNECT</span>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/reviews">Reviews</Link>
          {isLoggedIn && (
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
