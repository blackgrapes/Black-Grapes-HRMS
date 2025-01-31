import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  // Fetch user data (super admin profile)
  useEffect(() => {
    axios.get("http://localhost:3000/superadmin/profile")
      .then(response => {
        setUserData(response.data);
      })
      .catch(err => {
        console.error("Error fetching user data", err);
      });
  }, []);

  // Handle logout
  const handleLogout = () => {
    axios
      .get("http://localhost:3000/superadmin/logout")
      .then(() => {
        alert("Logged out successfully");
        navigate("/superadminlogin");
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
      </header>

      <div className="dashboard-body">
        <aside className="sidebar">
          <div className="profile-info">
            {userData && (
              <>
                <img src={userData.profilePicture} alt="Profile" className="profile-pic" />
                <p>{userData.name}</p>
                <p>Last Login: {userData.lastLogin}</p>
              </>
            )}
          </div>

          <nav className="sidebar-nav">
            <ul>
              <li><button onClick={() => navigate("/manage_employees")}>Manage Employees</button></li>
              <li><button onClick={() => navigate("/SuperAdminReport")}>View Reports</button></li>
              <li><button onClick={() => navigate("/SuperProfile")}>Profile</button></li>
              <li><button onClick={() => navigate("/SuperAdminSignup")}>Add Super Admin</button></li>
            </ul>
          </nav>

          {/* Logout Button Moved to Bottom */}
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </aside>

        <main className="dashboard-content">
          <section className="welcome-section">
            <h2>Welcome, {userData ? userData.name : 'Super Admin'}!</h2>
            <p>Manage the system efficiently with the tools available below.</p>
          </section>

          <section className="dashboard-actions">
            <div className="action-card">
              <h3>Manage Employees</h3>
              <p>Add, edit, or remove employee accounts.</p>
              <button className="btn btn-action" onClick={() => navigate("/manage_employees")}>Go to Employees</button>
            </div>

            <div className="action-card">
              <h3>View Reports</h3>
              <p>Analyze system reports and statistics.</p>
              <button className="btn btn-action" onClick={() => navigate("/SuperAdminReport")}>View Reports</button>
            </div>

            <div className="action-card">
              <h3>Profile</h3>
              <p>Configure system-wide settings.</p>
              <button className="btn btn-action" onClick={() => navigate("/SuperProfile")}>Go to Settings</button>
            </div>
          </section>
        </main>
      </div>

      <footer className="dashboard-footer">
        <p>© 2025 Super Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SuperAdminDashboard;
