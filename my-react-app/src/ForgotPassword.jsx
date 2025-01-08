// ForgotPassword.jsx
import React, { useState } from "react";
import "./ForgotPassword.css"; // Import the CSS file for forgot password styles

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (email === "") {
      setError("Please enter your email.");
    } else {
      setError("");
      // Handle password reset logic here
      setMessage("A reset link has been sent to your email.");
      console.log("Password reset for:", email);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleResetPassword} className="forgot-password-form">
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        <button type="submit" className="reset-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
