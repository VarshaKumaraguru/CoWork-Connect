import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function SpaceOwnerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
    const response = await fetch(`${BACKEND_URL}/spaceowner/login`, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        username: username.toLowerCase(), // Convert to lowercase before sending
        password 
      }),
    });

    const data = await response.json();
    if (response.ok) {
      // Store the username and ownerId in localStorage upon successful login
      localStorage.setItem('username', data.username);
      localStorage.setItem('ownerId', data.owner_id); // Storing ownerId too
      alert("Space Owner login successful!");
      navigate(data.dashboard_url); // Redirect to the dashboard
    } else {
      setError(data.error || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Space Owner Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="auth-input"
          />
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        {error && <p className="auth-error">{error}</p>}
        <p className="auth-switch-text">
          Don't have an account?{" "}
          <span onClick={() => navigate("/spaceowner/signin")} className="auth-link">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default SpaceOwnerLogin;
