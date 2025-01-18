import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import './SuperAdminLogin.css'; // Import the new CSS file

const SuperAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    axios.post('http://localhost:3000/superadmin/superadminlogin', { email, password })
      .then(response => {
        if (response.data.Status) {
          // Navigate to the superadmin dashboard
          navigate('/superadmin_dashboard');
        } else {
          alert("Invalid credentials");
        }
      })
      .catch(err => {
        console.error(err);
        alert(err.response?.data?.message || "An error occurred");
      });
  };

  return (
    <div className="superadmin-login-container">
      <h2>Super Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          />
        </div>
        <button type="submit" className="btn btn-login">Login</button>
      </form>
    </div>
  );
};

export default SuperAdminLogin;
