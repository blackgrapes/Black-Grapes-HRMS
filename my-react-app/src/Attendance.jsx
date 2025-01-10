import React, { useState } from "react";
import Navbar from "./Navbar"; // Import Navbar
import Sidebar from "./Sidebar"; // Import Sidebar
import AttendanceList from "./AttendanceList";
import AttendanceForm from "./AttendanceForm";
import AttendanceSummary from "./AttendanceSummary";
import "./Attendance.css"; // Include any necessary CSS for styling

const Attendance = () => {
  const [showForm, setShowForm] = useState(false);

  // Toggle the visibility of the attendance form
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="app">
      <Navbar /> {/* Include Navbar */}
      <div className="main-content">
        <Sidebar /> {/* Include Sidebar */}
        <div className="attendance-container">
          <header className="attendance-header">
            <h2>Employee Attendance</h2>
          </header>

          <div className="attendance-main">
            {/* Button to toggle the attendance form */}
            <button onClick={toggleForm} className="toggle-form-btn">
              {showForm ? "Hide Attendance Form" : "Mark Attendance"}
            </button>

            {/* Conditional rendering of the AttendanceForm */}
            {showForm && <AttendanceForm />}

            <div className="attendance-info">
              {/* Attendance List and Summary */}
              <AttendanceList />
              <AttendanceSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
