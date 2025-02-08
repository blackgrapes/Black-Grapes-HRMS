import React, { useState } from 'react';
import axios from 'axios';
import './SuperAdminSignup.css';

const SuperAdminSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '', // ✅ Added DOB field
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      name: formData.name,
      email: formData.email,
      dob: formData.dob, // ✅ Send DOB to backend
      password: formData.password,
    };

    try {
      const response = await axios.post('http://localhost:3000/superadmin/superadminsignup', newUser);
      if (response.data.Status) {
        setSuccess('Super Admin registered successfully!');
        setError('');
        setFormData({
          name: '',
          email: '',
          dob: '',
          password: '',
        });
      }
    } catch (err) {
      setError(err.response?.data?.Error || 'An error occurred. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="superadmin-signup-container">
      <div className="form-container">
        <h2 className="text-center">Super Admin Signup</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label> {/* ✅ Added DOB */}
            <input
              type="date"
              className="form-control"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminSignup;
