import React from "react";
import "./Navbar.css"
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate(); // Use navigate hook to redirect

  // Function to handle logout and redirect to login page
  const handleLogout = () => {
    // Perform any logout logic here (like clearing session data, etc.)
    navigate("/");  // Redirect to the login page
  };

  return (
    <div className="navbar">
      <h3>HRMS Dashboard</h3>
      <div className="navbar-right">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;

