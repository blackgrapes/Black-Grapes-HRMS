import React, { useState, useEffect } from 'react';
import './ShowAttendance.css';

const ShowAttendance = () => {
  const [email, setEmail] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const fetchAttendance = async (email) => {
    // Mocked API Call: Replace with actual API endpoint
    try {
      const response = await fetch(`/api/attendance?email=${email}`);
      const data = await response.json();
      setAttendanceData(data);
      setError('');
    } catch (err) {
      setError('Error fetching data. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      fetchAttendance(email);
    } else {
      setError('Please enter an email.');
    }
  };

  return (
    <div className="attendance-container">
      <h2>Attendance Tracker</h2>
      <form onSubmit={handleSubmit} className="email-form">
        <label htmlFor="email">Enter Email Address:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="example@domain.com"
        />
        <button type="submit">Fetch Attendance</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="attendance-list">
        {attendanceData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr key={index}>
                  <td>{record.date}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No attendance data available for this email.</div>
        )}
      </div>
    </div>
  );
};

export default ShowAttendance;
