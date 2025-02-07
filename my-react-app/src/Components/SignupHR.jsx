import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignupHR.css'; // Import CSS

const SignupAdmin = () => {
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '', // Added dob field to state
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminData.name || !adminData.email || !adminData.password || !adminData.dob) {
      setError('Name, email, password, and date of birth are required.');
      return;
    }

    axios
      .post('http://localhost:3000/auth/adminsignup', adminData)
      .then((response) => {
        if (response.data.signupStatus) {
          alert('Admin signed up successfully!');
          navigate(-2); // Navigate to the employee management page
        } else {
          setError(response.data.Error || 'Error signing up admin');
        }
      })
      .catch((err) => {
        setError('Error: ' + err.message);
      });
  };

  return (
    <div className="signup-container">
      <h3 className="text-center">Sign Up Admin</h3>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={adminData.name}
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
            value={adminData.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={adminData.password}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter password"
          />
        </div>
        
        {/* DOB Field Added */}
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={adminData.dob}
            onChange={handleChange}
            className="form-control"
            required
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

export default SignupAdmin;
