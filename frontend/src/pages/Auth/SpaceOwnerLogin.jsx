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
    setError("");

    const BACKEND_URL =
      process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${BACKEND_URL}/spaceowner/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          password,
        }),
      });

      /* ---- robust JSON parse ---- */
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server returned non‑JSON: ${text.slice(0, 120)}…`);
      }
      /* -------------------------------- */

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("username", data.username);
      localStorage.setItem("ownerId", data.owner_id);
      navigate(data.dashboard_url); // e.g. "/spaceowner/dashboard"
    } catch (err) {
      setError(err.message);
      console.error(err);
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
          Don&rsquo;t have an account?{" "}
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
