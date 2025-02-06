import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Superadminforgot.css'; // Import the CSS for styling

const Superadminforgot = () => {
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !dob || !newPassword) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    axios
      .post("http://localhost:3000/superadmin/reset-password", { email, dob, newPassword })
      .then((response) => {
        if (response.data.success) {
          setSuccess("Password updated successfully!");
          setEmail("");
          setDob("");
          setNewPassword("");
          setError(null);
          setTimeout(() => {
            navigate("/superadminlogin"); // Redirect to login page after success
          }, 2000);
        } else {
          setError(response.data.message || "Incorrect details. Please try again.");
        }
      })
      .catch((err) => {
        setError("Something went wrong. Please try again later.");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="forgot-container">
      <div className="forgot-form">
        <h2>Super Admin - Forgot Password</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
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
            <label>Date of Birth:</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Superadminforgot;
