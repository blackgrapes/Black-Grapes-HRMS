import React, { useState } from 'react';
import './Attendance.css';
import DatePicker from 'react-datepicker'; // Importing DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styling

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: 'John Doe', date: '2025-01-23', status: 'Present' },
    { id: 2, name: 'Jane Smith', date: '2025-01-23', status: 'Absent' },
    { id: 3, name: 'Alice Johnson', date: '2025-01-23', status: 'Present' },
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // State to track selected date

  const handleAttendanceChange = (id, status) => {
    setAttendanceData((prevData) =>
      prevData.map((record) =>
        record.id === id ? { ...record, status, date: selectedDate.toISOString().split('T')[0] } : record
      )
    );
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
