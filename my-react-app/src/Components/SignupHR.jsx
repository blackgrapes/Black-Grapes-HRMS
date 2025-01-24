import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignupHR.css'; // Import CSS

const SignupHR = () => {
  const [hrData, setHrData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHrData({ ...hrData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hrData.name || !hrData.email || !hrData.phone || !hrData.password) {
      setError('All fields are required.');
      return;
    }

    axios
      .post('http://localhost:3000/auth/signup_hr', hrData)
      .then((response) => {
        if (response.data.Status) {
          alert('HR signed up successfully!');
          navigate('/dashboard/manage_employee'); // Navigate to the employee management page
        } else {
          setError(response.data.Error || 'Error signing up HR');
        }
      })
      .catch((err) => {
        setError('Error: ' + err.message);
      });
  };

  return (
    <div className="signup-container">
      <h3 className="text-center">Sign Up HR</h3>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={hrData.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={hrData.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={hrData.phone}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter phone number"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={hrData.password}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter password"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="btn btn-success">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupHR;
