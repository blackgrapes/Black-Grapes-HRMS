import React, { useState } from "react";
import axios from "axios";
import "./Adminforgot.css";
import { useNavigate } from "react-router-dom";

const Adminforgot = () => {
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
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
      .post(`${process.env.VITE_API_URL}/auth/forgotpassword`, { email, dob, newPassword })
      .then((response) => {
        if (response.data.message === "Password reset successfully") {
          alert("Password updated successfully!");
          setEmail("");
          setDob("");
          setNewPassword("");
          setError(null);
          navigate("/adminlogin");
        } else {
          setError(response.data.message || "Incorrect credentials. Please try again.");
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 400 || err.response.status === 401) {
            setError("Incorrect credentials. Please try again.");
          } else {
            setError("Something went wrong on the server. Please try again later.");
          }
        } else if (err.request) {
          setError("No response from server. Please check your network connection.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="forgot-container">
      <div className="forgot-form">
        <h2>HR - Forgot Password</h2>
        {error && <div className="error-message">{error}</div>}
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
