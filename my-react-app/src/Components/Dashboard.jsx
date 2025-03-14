import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("valid"); // Clear any stored session data
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start p-0 m-0 text-white min-vh-100">
            <Link
              to="/dashboard"
              className="d-flex align-items-center pb-0 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <div className="d-flex justify-content-start align-items-center" style={{ width: '100%', marginTop: '0' }}>
                <h1>HRMS</h1>
              </div>
            </Link>

            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li className="w-100">
                <Link to="/dashboard" className="nav-link text-white px-0 align-middle">
                  <i className="fs-4 bi-speedometer2 ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/dashboard/employee" className="nav-link px-0 align-middle text-white">
                  <i className="fs-4 bi-people ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Manage Employees</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/dashboard/payroll" className="nav-link text-white px-0 align-middle">
                  <i className="fs-4 bi-cash-coin ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Payroll</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/dashboard/Attendance" className="nav-link px-0 align-middle text-white">
                  <i className="fs-4 bi-clock ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Attendance</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/dashboard/LeaveManagement" className="nav-link px-0 align-middle text-white">
                  <i className="fs-4 bi-clock ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Leave Management</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/dashboard/Report" className="nav-link px-0 align-middle text-white">
                  <i className="fs-4 bi-clipboard ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Report</span>
                </Link>
              </li>
              <li className="w-100">
                <Link to="/dashboard/profile" className="nav-link px-0 align-middle text-white">
                  <i className="fs-4 bi-person ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Profile</span>
                </Link>
              </li>

              {/* ✅ Logout Button */}
              <li className="w-100">
                <button
                  className="nav-link px-0 align-middle text-white bg-transparent border-0 w-100 text-start"
                  onClick={handleLogout}
                >
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="col p-0 m-0">
          <div className="p-2 justify-content-center shadow">
            <h3>Black-Grapes-Group Employee Management System</h3>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
