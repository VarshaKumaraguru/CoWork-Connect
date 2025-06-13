import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpaceForm from './SpaceForm';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('no-background');
    return () => document.body.classList.remove('no-background');
  }, []);

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      const response = await axios.get('http://localhost:5000/spaceowner/spaces', {
        params: { owner_id: localStorage.getItem('ownerId') }
      });
      setSpaces(response.data.spaces);
    } catch (error) {
      console.error('Error fetching spaces:', error);
    }
  };

  const handleAdd = (newSpace) => {
    setSpaces([...spaces, newSpace]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/spaceowner/space/${id}`, {
        data: { owner_id: localStorage.getItem('ownerId') }
      });
      setSpaces(spaces.filter((space) => space.id !== id));
    } catch (error) {
      console.error('Error deleting space:', error);
    }
  };

  return (
    <div>
      <SpaceForm />
    </div>
  );
};

export default Dashboard;