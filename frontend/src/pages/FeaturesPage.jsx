import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import './FeaturesPage.css';
import { FaStar } from 'react-icons/fa';

const FeaturesPage = () => {
  const containerRef = useRef(null);
  const [stars, setStars] = useState([]);
  const [backgroundStars, setBackgroundStars] = useState([]);
  const animationRefs = useRef([]);

  const featuresData = [
    {
      id: 'star1',
      title: 'Easy Booking',
      description: 'Book spaces in just one click.'
    },
    {
      id: 'star2',
      title: 'Owner Chat',
      description: 'Direct communication with space owners via email.'
    },

    {
      id: 'star4',
      title: 'Verified Listings',
      description: 'Spaces are verified and trusted.'
    },
    {
      id: 'star5',
      title: 'Flexible Plans',
      description: 'Hourly rental options.'
    },
    {
      id: 'star6',
      title: 'Secure Payments',
      description: 'Safe and reliable payment processing.'
    },
    {
      id: 'star7',
      title: 'Real-Time Availability',
      description: 'See up-to-date space availability instantly.'
    },

    {
      id: 'star8',
      title: 'View Customer Reviews',
      description: 'Having second thoughts? Check out the reviews for a space before booking it.'
    },

    {
      id: 'star9',
      title: 'Spaces Just for You',
      description: 'Your comfort is our priority :) Book Spaces that fits your needs'
    },

    {
      id: 'star10',
      title: 'Your Feedback Means a Lot',
      description: 'We\'d love to hear from you! Contact us so that we can improve our service!'
    },
    
    {
      id: 'star11',
      title: 'Multi-Device Access',
      description: 'Access your bookings from any device.'
    }
  ];

  // Initialize background stars
  useEffect(() => {
    const bgStars = [];
    for (let i = 0; i < 80; i++) {
      bgStars.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        animationDelay: Math.random() * 3
      });
    }
    setBackgroundStars(bgStars);
  }, []);

  // Initialize main stars positions and velocities
  useEffect(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    const initialStars = featuresData.map((feature, index) => ({
      ...feature,
      x: Math.random() * (containerWidth - 250) + 125,
      y: Math.random() * (containerHeight - 250) + 125,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      isHovered: false
    }));

    setStars(initialStars);
  }, []);

  // Animation loop
  useEffect(() => {
    if (!containerRef.current || stars.length === 0) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    const animate = () => {
      setStars(prevStars => 
        prevStars.map(star => {
          if (star.isHovered) return star;

          let newX = star.x + star.vx;
          let newY = star.y + star.vy;
          let newVx = star.vx;
          let newVy = star.vy;

          // Bounce off edges
          if (newX <= 75 || newX >= containerWidth - 175) {
            newVx = -newVx;
            newX = Math.max(75, Math.min(containerWidth - 175, newX));
          }
          if (newY <= 125 || newY >= containerHeight - 175) {
            newVy = -newVy;
            newY = Math.max(125, Math.min(containerHeight - 175, newY));
          }

          return {
            ...star,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          };
        })
      );

      animationRefs.current.id = requestAnimationFrame(animate);
    };

    animationRefs.current.id = requestAnimationFrame(animate);

    return () => {
      if (animationRefs.current.id) {
        cancelAnimationFrame(animationRefs.current.id);
      }
    };
  }, [stars.length]);

  const handleStarHover = (starId, isHovered) => {
    setStars(prevStars =>
      prevStars.map(star =>
        star.id === starId ? { ...star, isHovered } : star
      )
    );
  };

  const handleResize = () => {
    // Reinitialize positions on resize
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    setStars(prevStars =>
      prevStars.map(star => ({
        ...star,
        x: Math.min(star.x, containerWidth - 175),
        y: Math.min(star.y, containerHeight - 175)
      }))
    );
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="features-page">
        <Navbar />
      <div className="background-stars">
        {backgroundStars.map(bgStar => (
          <div
            key={bgStar.id}
            className="bg-star"
            style={{
              left: `${bgStar.left}%`,
              top: `${bgStar.top}%`,
              width: `${bgStar.size}px`,
              height: `${bgStar.size}px`,
              animationDelay: `${bgStar.animationDelay}s`
            }}
          />
        ))}
      </div>

      <div className="container" ref={containerRef}>
        <h1 className="title">Our Amazing Features</h1>

        {stars.map(star => (
          <div
            key={star.id}
            className={`star ${star.isHovered ? 'hovered' : ''}`}
            style={{
              left: `${star.x}px`,
              top: `${star.y}px`
            }}
            onMouseEnter={() => handleStarHover(star.id, true)}
            onMouseLeave={() => handleStarHover(star.id, false)}
          >
            <FaStar className="star-icon" />
            <div className="star-content">
              <h3>{star.title}</h3>
              <p>{star.description}</p>
            </div>
          </div>
        ))}

        <div className="instructions">
          Hover over the stars to explore our features
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;