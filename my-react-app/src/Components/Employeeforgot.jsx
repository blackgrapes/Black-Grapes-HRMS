import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Employeeforgot.css';

const Employeeforgot = () => {
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !dob || !newPassword) {
      setError('Please fill in all the fields.');
      return;
    }

    setError('');

    axios
      .post('http://localhost:3000/employee/forgot_password', {
        email,
        dob,
        newPassword,
      })
      .then((response) => {
        if (response.data.Status) {
          alert('Password changed successfully! Please log in.');
          navigate('/employee_login');
        } else {
          setError(response.data.Error || 'Failed to update password. Please check your details.');
        }
      })
      .catch((err) => {
        setError('An error occurred. Please try again later.');
        console.error(err);
      });
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2>Employee Forgot Password</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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

export default Employeeforgot;
