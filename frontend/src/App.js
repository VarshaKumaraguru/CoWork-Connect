import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SpaceForm from './pages/SpaceForm';
import SpaceList from './components/SpaceList';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SpaceList />} />
          <Route path="/spaces" element={<SpaceList />} />
          <Route path="/add-space" element={<SpaceForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
