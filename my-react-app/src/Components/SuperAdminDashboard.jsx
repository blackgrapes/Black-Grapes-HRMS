import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    axios
      .get("http://localhost:3000/superadmin/logout") // Adjust the endpoint as per your backend
      .then(() => {
        alert("Logged out successfully");
        navigate("/superadminlogin"); // Redirect to login page
      })
      .catch((err) => {
        console.error("Logout error:", err);
        alert("An error occurred during logout");
      });
  };

  return (
    <div className="superadmin-dashboard-container">
      <header className="dashboard-header">
        <h1>Super Admin Dashboard</h1>
        <button className="btn btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <section className="welcome-section">
          <h2>Welcome, Super Admin!</h2>
          <p>Manage the system efficiently with the tools available below.</p>
        </section>

        <section className="dashboard-actions">
          <div className="action-card">
            <h3>Manage Employees</h3>
            <p>Add, edit, or remove employee accounts.</p>
            <button
              className="btn btn-action"
              onClick={() => navigate("/manage_employees")}
            >
              Go to Employees
            </button>
          </div>

          <div className="action-card">
            <h3>View Reports</h3>
            <p>Analyze system reports and statistics.</p>
            <button
              className="btn btn-action"
              onClick={() => navigate("/view_reports")}
            >
              View Reports
            </button>
          </div>

          <div className="action-card">
            <h3>System Settings</h3>
            <p>Configure system-wide settings.</p>
            <button
              className="btn btn-action"
              onClick={() => navigate("/system_settings")}
            >
              Go to Settings
            </button>
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>© 2025 Super Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SuperAdminDashboard;
