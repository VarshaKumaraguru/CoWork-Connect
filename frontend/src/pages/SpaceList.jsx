import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SpaceCard from '../components/SpaceCard';
import './SpaceListStyle.css';

const SpaceList = () => {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ownerId = localStorage.getItem('ownerId'); // Get owner ID from localStorage

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/spaceowner/spaces', {
        params: { owner_id: ownerId }
      });
      console.log('Fetched spaces:', response.data); // Debug log
      setSpaces(response.data.spaces || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching spaces:', err);
      setError('Failed to fetch spaces. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (spaceId) => {
    try {
      await axios.delete(`http://localhost:5000/spaceowner/space/${spaceId}`, {
        data: { owner_id: ownerId }
      });
      setSpaces(spaces.filter(space => space.id !== spaceId));
    } catch (error) {
      console.error('Error deleting space:', error);
    }
  };

  const handleAddSpace = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="loading">Loading spaces...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="space-list-page">
        <div className="space-list-container">
          <div className="header">
            <h2>Your Spaces</h2>
            <div className="actions">
              <button onClick={handleAddSpace} className="add-space-button">
                Add New Space
              </button>
            </div>
          </div>
  
          {spaces.length === 0 ? (
            <div className="no-spaces">No spaces available. Add your first space!</div>
          ) : (
            <div className="space-grid">
              {spaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );  
};

export default SpaceList;