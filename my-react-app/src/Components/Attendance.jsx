import React, { useState, useEffect } from 'react';
import './Attendance.css';
import DatePicker from 'react-datepicker'; // Importing DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styling
import axios from 'axios'; // For making API calls

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]); // State to store attendance data
  const [selectedDate, setSelectedDate] = useState(new Date()); // State to track selected date
  const [employeeEmail, setEmployeeEmail] = useState(''); // Assuming this is the email of the employee logged in

  // Fetch attendance for the selected date
  const fetchAttendance = async () => {
    try {
      const response = await axios.get('http://localhost:3000/attendance/attendance_by_date', {
        params: { date: selectedDate.toISOString().split('T')[0] },
      });
      setAttendanceData(response.data.Result); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  // Fetch attendance data whenever the selected date changes
  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  // Function to handle attendance change (mark present or absent)
  const handleAttendanceChange = async (id, status) => {
    try {
      const response = await axios.post('http://localhost:3000/attendance/attendance', {
        employeeEmail, // employee email
        date: selectedDate.toISOString().split('T')[0], // format date as YYYY-MM-DD
        status, // 'Present' or 'Absent'
      });

      if (response.status === 200) {
        // Update state with the new status
        setAttendanceData((prevData) =>
          prevData.map((record) =>
            record.id === id ? { ...record, status } : record
          )
        );
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  return (
    <div className="attendance-container">
      <h2 className="attendance-title">Employee Attendance</h2>

      {/* Date Picker to select the date */}
      <div className="datepicker-container">
        <label htmlFor="attendance-date">Select Date: </label>
        <DatePicker
          id="attendance-date"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>

      {/* Attendance Table */}
      <table className="attendance-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((record) => (
            <tr key={record.id} className={record.status === 'Absent' ? 'absent-row' : ''}>
              <td>{record.id}</td>
              <td>{record.name}</td>
              <td>{record.date}</td>
              <td>{record.status}</td>
              <td>
                {/* Buttons to mark attendance as Present or Absent */}
                {record.date === selectedDate.toISOString().split('T')[0] ? (
                  <>
                    <button
                      className="attendance-btn present"
                      onClick={() => handleAttendanceChange(record.id, 'Present')}
                    >
                      Mark Present
                    </button>
                    <button
                      className="attendance-btn absent"
                      onClick={() => handleAttendanceChange(record.id, 'Absent')}
                    >
                      Mark Absent
                    </button>
                  </>
                ) : (
                  <span>No action for past date</span>
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
