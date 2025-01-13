import "./Home.css"
import React from "react";
import Sidebar from "./Sidebar"
import Navbar from "./Navbar";
import Employees from "./Employees";
import Attendance from "./Attendance";
import Reports from "./Reports";
import payroll from "./Payroll";
const Home = () => (
  <div className="dashboard-container">
    <Navbar />
    <div className="main-container">
      <Sidebar />
      {/* <div className="content">
        <Employees />
        <Attendance />
        <Reports />
      </div> */}
    </div>
  </div>
);

export default Home;
