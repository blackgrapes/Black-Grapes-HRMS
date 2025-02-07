import axios from "axios";
import React, { useState } from "react";
import './Superadminforgot.css'; // Import the CSS file for styling

const Superadminforgot = () => {
  const [email, setEmail] = useState(""); // For Email
  const [dob, setDob] = useState(""); // For Date of Birth
  const [newPassword, setNewPassword] = useState(""); // For New Password
  const [confirmPassword, setConfirmPassword] = useState(""); // For Confirm New Password
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // For success messages

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 2: Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    // Step 2: Change the password
    try {
      const response = await axios.post("http://localhost:3000/superadmin/resetpassword", { email, dob, newPassword });

      if (response.data.Status) {
        setMessage("Your password has been successfully updated!");
      } else {
        setError("Failed to update the password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Reset Your Password</h2>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      <form onSubmit={handleSubmit}>
        {/* Email Input Field */}
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

        {/* Date of Birth Input Field */}
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>

        {/* New Password Input Field */}
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm Password Input Field */}
        <div className="form-group">
          <label>Confirm New Password:</label>
          <input
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Reset Password Button */}
        <button type="submit" className="btn btn-submit">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default Superadminforgot;
