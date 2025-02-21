import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Superadminforgot.css';

const SuperadminForgot = () => {
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !dob || !newPassword) {
      setError('❗ Please fill in all the fields.');
      return;
    }

    setError('');

    try {
      const response = await axios.post(`${process.env.VITE_API_URL}/superadmin/forgotpassword`, {
        email,
        dob,
        newPassword,
      });

      if (response.data.Status) {
        alert('✅ Password changed successfully! Please log in.');
        navigate('/superadmin_login');
      } else {
        setError(response.data.Error || '❌ Failed to update password. Please check your details.');
      }
    } catch (err) {
      setError('⚠️ An error occurred. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div className="superadmin-forgot-container">
      <div className="superadmin-forgot-form">
        <h2>Super Admin Forgot Password</h2>

        {error && <div className="superadmin-error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="superadmin-form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="superadmin-form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>

          <div className="superadmin-form-group">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
          </div>

          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default SuperadminForgot;
