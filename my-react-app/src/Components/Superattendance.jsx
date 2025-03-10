import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Superattendance.css";

const Superattendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0]; // Always use today's date

  // Fetch HR attendance data from backend
  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        `${process.env.VITE_API_URL}/HrAttendance/hr-attendance-with-details`
      );
      if (response.status === 200) {
        setAttendanceData(response.data);
      }
    } catch (error) {
      console.error("Error fetching HR attendance:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Filter attendance data for today's date
  const filteredData = attendanceData.map((hr) => {
    const attendanceForDate = hr.attendance.find((record) => record.date === today);
    return {
      ...hr,
      status: attendanceForDate ? attendanceForDate.status : "Not Marked",
    };
  });

  // Handle marking attendance
  const handleAttendanceChange = async (email, status) => {
    try {
      const response = await axios.post(
        `${process.env.VITE_API_URL}/HrAttendance/hr-attendance`,
        {
          hrEmail: email,
          date: today,
          status,
        }
      );

      if (response.status === 200) {
        alert(`Attendance marked as ${status} for ${email}`);
        fetchAttendance(); // Refresh data
      }
    } catch (error) {
      console.error("Error updating HR attendance:", error);
      alert("Failed to update attendance. Please try again.");
    }
  };

  // Handle attendance report navigation
  const handleShowReport = () => {
    navigate("/SuperShowAttendance");
  };

  return (
    <div className="attendance-container">
      <h2 className="attendance-title">HR Attendance Management</h2>

      {/* Display Today's Date */}
      <div className="today-date">
        <strong>Today's Date:</strong> {today}
      </div>

      {/* Search Bar and Show Attendance Report Button */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <button className="show-report-btn" onClick={handleShowReport}>
          Show Attendance Report
        </button>
      </div>

      {/* Attendance Table */}
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData
            .filter((hr) => hr.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((hr) => (
              <tr key={hr.email} className={hr.status === "Absent" ? "absent-row" : ""}>
                <td>{hr.name}</td>
                <td>{hr.email}</td>
                <td>{hr.department}</td>
                <td>{hr.status}</td>
                <td>
                  {["Not Marked", "Absent", "Half Day"].includes(hr.status) && (
                    <button
                      className="attendance-btn present"
                      onClick={() => handleAttendanceChange(hr.email, "Present")}
                    >
                      Mark Present
                    </button>
                  )}
                  {["Not Marked", "Present", "Half Day"].includes(hr.status) && (
                    <button
                      className="attendance-btn absent"
                      onClick={() => handleAttendanceChange(hr.email, "Absent")}
                    >
                      Mark Absent
                    </button>
                  )}
                  {["Not Marked", "Present", "Absent", "Half Day"].includes(hr.status) && (
                    <button
                      className="attendance-btn half-day"
                      onClick={() => handleAttendanceChange(hr.email, "Half Day")}
                    >
                      Mark Half Day
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Superattendance;
