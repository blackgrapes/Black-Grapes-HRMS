import React, { useState, useEffect } from "react";
import "./Attendance.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  // Fetch attendance data from backend
  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/attendance/attendance-with-details"
      );
      if (response.status === 200) {
        console.log(response.data);
        setAttendanceData(response.data);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Filter attendance data for the selected date
  const filteredData = attendanceData.map((employee) => {
    const attendanceForDate = employee.attendance.find(
      (record) => record.date === selectedDate.toISOString().split("T")[0]
    );
    return {
      ...employee,
      status: attendanceForDate ? attendanceForDate.status : "Not Marked",
    };
  });

  // Handle marking attendance
  const handleAttendanceChange = async (email, status) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/attendance/attendance",
        {
          employeeEmail: email,
          date: selectedDate.toISOString().split("T")[0],
          status,
        }
      );

      if (response.status === 200) {
        alert(`Attendance marked as ${status} for ${email}`);
        fetchAttendance(); // Refresh data
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Failed to update attendance. Please try again.");
    }
  };

  // Handle showing attendance report
  const handleShowReport = () => {
    navigate("/dashboard/ShowAttendance");
  };

  return (
    <div className="attendance-container">
      <h2 className="attendance-title">Employee Attendance</h2>

      {/* Date Picker */}
      <div className="datepicker-container">
        <label htmlFor="attendance-date">Select Date: </label>
        <DatePicker
          id="attendance-date"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>

      {/* Show Attendance Report Button */}
      <button className="show-report-btn" onClick={handleShowReport}>
        Show Attendance Report
      </button>

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
          {filteredData.map((employee) => (
            <tr
              key={employee.email}
              className={employee.status === "Absent" ? "absent-row" : ""}
            >
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>{employee.status}</td>
              <td>
                {["Not Marked", "Absent", "Half Day"].includes(employee.status) && (
                  <button
                    className="attendance-btn present"
                    onClick={() =>
                      handleAttendanceChange(employee.email, "Present")
                    }
                  >
                    Mark Present
                  </button>
                )}
                {["Not Marked", "Present", "Half Day"].includes(employee.status) && (
                  <button
                    className="attendance-btn absent"
                    onClick={() =>
                      handleAttendanceChange(employee.email, "Absent")
                    }
                  >
                    Mark Absent
                  </button>
                )}
                {["Not Marked", "Present", "Absent", "Half Day"].includes(employee.status) && (
                  <button
                    className="attendance-btn half-day"
                    onClick={() =>
                      handleAttendanceChange(employee.email, "Half Day")
                    }
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

export default Attendance;
