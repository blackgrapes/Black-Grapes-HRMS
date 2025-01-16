import React, { useState } from 'react'

import './EmployeeLogin.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const EmployeeLogin = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login form submitted");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img
          src="./src/assets/logo.png" // Replace with your logo image URL
          alt="Company Logo"
          className="login-logo"
        />
        <h2>Employee Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default EmployeeLogin;
