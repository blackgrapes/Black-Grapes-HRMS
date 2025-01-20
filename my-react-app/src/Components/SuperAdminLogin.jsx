import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SuperAdminLogin.css'; // Import the new CSS file

const SuperAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // For displaying error messages
  const [attempts, setAttempts] = useState(0); // Track incorrect attempts
  const [isLocked, setIsLocked] = useState(false); // Lockout state
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (isLocked) {
      setError("Too many incorrect attempts. Please try again later.");
      return;
    }

    axios.post('http://localhost:3000/superadmin/superadminlogin', { email, password })
      .then(response => {
        if (response.data.Status) {
          navigate('/superadmin_dashboard');
        } else {
          setError("Invalid credentials");
          setAttempts((prev) => prev + 1); // Increment incorrect attempts
          if (attempts + 1 >= 3) {
            setIsLocked(true); // Lock after 3 failed attempts
            setTimeout(() => {
              setIsLocked(false); // Unlock after 1 minute
              setAttempts(0);
            }, 60000); // 1 minute lockout duration
          }
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.response?.data?.message || "Incorrect ID or Password. Please try again.");
      });
  };

  return (
    <div className="main-container">
      <div className="superadmin-login-container">
        <img src="./src/assets/logo.png" alt="Super Admin Logo" className="logo" />
        <h2>Super Admin Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLocked} // Disable input if locked
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLocked} // Disable input if locked
            />
          </div>
          <button
            type="submit"
            className="btn btn-login"
            disabled={isLocked} // Disable button if locked
          >
            Login
          </button>
        </form>
        {attempts > 0 && !isLocked && (
          <div className="attempts-info">
            Incorrect attempts: {attempts}/3
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminLogin;
