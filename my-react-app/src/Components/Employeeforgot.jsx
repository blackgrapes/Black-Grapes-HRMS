import React, { useState } from 'react';
import axios from 'axios';
import './Employeeforgot.css';

const Employeeforgot = () => {
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !dob || !newPassword) {
      setError('Please fill in all the fields');
      return;
    }

    setLoading(true);
    axios
      .post('http://localhost:3000/employee/reset-password', {
        email,
        dob,
        newPassword,
      })
      .then((response) => {
        if (response.data.success) {
          setSuccess('Password updated successfully');
          setEmail('');
          setDob('');
          setNewPassword('');
          setError('');
        } else {
          setError('Failed to update password. Please check your details.');
        }
      })
      .catch((err) => {
        setError('Error occurred. Please try again later.');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2>Forgot Password</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Employeeforgot;
