import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Sidebar.css"

const Sidebar = () => (
  <div className="sidebar">
    <h2 className="sidebar-title">HRMS</h2>
    <ul className="sidebar-list">

      <li><Link to="/employees" className="sidebar-item">Employees</Link></li>
      <li><Link to="/attendance" className="sidebar-item">Attendance</Link></li>
      <li><Link to="/reports" className="sidebar-item">Reports</Link></li>
      <li><Link to="/Calendar" className="sidebar-item">Calendar</Link></li>
    </ul>
  </div>
);

export default Sidebar;
