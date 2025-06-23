import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function SpaceOwnerLogin() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await fetch(`${API_BASE_URL}/spaceowner/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.toLowerCase(),
          password,
        }),
      });
  
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("username", data.username);
        localStorage.setItem("ownerId", data.owner_id);
        alert("Space Owner login successful!");
        navigate(data.dashboard_url || "/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
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
          <span
            onClick={() => navigate("/spaceowner/signin")}
            className="auth-link"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default SpaceOwnerLogin;
