import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Auth/SignUp"; 
import Login from "./pages/Auth/Login";
import SpaceOwnerSignup from "./pages/Auth/SpaceOwnerSignup";
import SpaceOwnerLogin from "./pages/Auth/SpaceOwnerLogin";
import FeaturesPage from "./pages/FeaturesPage";
import Dashboard from './pages/Dashboard';
import SpaceList from './pages/SpaceList';
import UserDashboard from './pages/UserDashboard';
import ContactOwnerButton from "./pages/ContactOwnerButton";
import Reviews from './pages/Reviews';
import ContactForm from './pages/ContactForm';
import PreferencesForm from './pages/PreferencesForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/spaceowner/signin" element={<SpaceOwnerSignup />} />
        <Route path="/spaceowner/login" element={<SpaceOwnerLogin />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/spacelist" element={<SpaceList />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/ContactOwnerButton" element={<ContactOwnerButton />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/preferences" element={<PreferencesForm />} />
      </Routes>
    </Router>
  );
}

export default App;
