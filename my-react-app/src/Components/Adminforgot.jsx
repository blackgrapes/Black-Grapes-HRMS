import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Adminforgot.css";
import { useNavigate } from "react-router-dom";

const Adminforgot = () => {
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
      .post("http://localhost:3000/admin/reset-password", { email, dob, newPassword })
      .then((response) => {
        if (response.data.success) {
          setSuccess("Password updated successfully!");
          setEmail("");
          setDob("");
          setNewPassword("");
          setError(null);
          setTimeout(() => {
            navigate("/login"); // Redirect to the login page after success
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

  // Clear success or error after some time to improve UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [success, error]);

  return (
    <div className="forgot-container">
      <div className="forgot-form">
        <h2>Admin - Forgot Password</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
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

export default Adminforgot;
