// AddHR.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddHr.css'; // Import CSS

const AddHR = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newHR = {
      name,
      email,
      phone,
    };

    // Send POST request to add new HR
    axios
      .post('http://localhost:3000/auth/add_hr', newHR)
      .then((response) => {
        if (response.data.Status) {
          alert('HR added successfully');
          navigate('/dashboard/manage_hr'); // Redirect to HR management page after successful addition
        } else {
          alert('Error adding HR');
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container">
      <h3 className="text-center mt-4">Add New HR</h3>
      <form onSubmit={handleSubmit} className="add-hr-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            className="form-control"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success mt-3">
          Add HR
        </button>
      </form>
    </div>
  );
};

export default AddHR;