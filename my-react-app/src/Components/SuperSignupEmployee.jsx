import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignupEmployee.css";

const SignupEmployee = () => {
  const [name, setName] = useState(""); // New state for name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState(""); // State for Date of Birth
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !password || !dob) {
      setError("Please fill out all fields.");
      return;
    }

    // Send data to backend
    axios
      .post(`${import.meta.env.VITE_API_URL}/employee/employee_signup`, { name, email, password, dob })
      .then((response) => {
        if (response.data.signupStatus) {
          navigate("/manage_employees"); 
          // Redirect on success
          alert("Employee SignedUp successfully.");
        } else {
          setError(response.data.Error); // Handle backend errors
        }
      })
      .catch((err) => {
        setError("Error signing up. Please try again.");
        console.error(err);
      });
  };

  return (
    <div className="signup-container">
      <h3 className="text-center">Sign Up Employee</h3>
      <form onSubmit={handleSubmit} className="signup-form">
        {error && <p className="error-message">{error}</p>}
        
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            placeholder="Enter full name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Enter email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Enter password"
            required
          />
        </div>

        {/* DOB Field Added */}
        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-success">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupEmployee;
