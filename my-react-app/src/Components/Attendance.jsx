// JSX for Attendance Component in HRMS
import React, { useState } from 'react';
import './Attendance.css';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: 'John Doe', date: '2025-01-23', status: 'Present' },
    { id: 2, name: 'Jane Smith', date: '2025-01-23', status: 'Absent' },
    { id: 3, name: 'Alice Johnson', date: '2025-01-23', status: 'Present' },
  ]);

  return (
    <div className="attendance-container">
      <h2 className="attendance-title">Employee Attendance</h2>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((record) => (
            <tr key={record.id} className={record.status === 'Absent' ? 'absent-row' : ''}>
              <td>{record.id}</td>
              <td>{record.name}</td>
              <td>{record.date}</td>
              <td>{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
