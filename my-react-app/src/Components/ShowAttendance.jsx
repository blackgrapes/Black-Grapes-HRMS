import React, { useState } from 'react';
import './ShowAttendance.css';

const ShowAttendance = () => {
  const [email, setEmail] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleFromDateChange = (e) => setFromDate(e.target.value);
  const handleToDateChange = (e) => setToDate(e.target.value);

  const fetchAttendance = async () => {
    if (!email || !fromDate || !toDate) {
      setError('Please enter email and select date range.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/attendance/attendance?employeeEmail=${email}&fromDate=${fromDate}&toDate=${toDate}`);
      const data = await response.json();

      if (response.ok) {
        setAttendanceData(data.result);
        setError('');
      } else {
        setAttendanceData([]);
        setError(data.error || 'No attendance records found.');
      }
    } catch (err) {
      setError('Error fetching data. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAttendance();
  };

  return (
    <div className="attendance-container">
      <h2>Attendance Tracker</h2>
      <form onSubmit={handleSubmit} className="email-form">
        <label htmlFor="email">Email Address:</label>
        <input type="email" id="email" value={email} onChange={handleEmailChange} placeholder="example@domain.com" />

        <label htmlFor="fromDate">From Date:</label>
        <input type="date" id="fromDate" value={fromDate} onChange={handleFromDateChange} />

        <label htmlFor="toDate">To Date:</label>
        <input type="date" id="toDate" value={toDate} onChange={handleToDateChange} />

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
          <div>No attendance data available for this period.</div>
        )}
      </div>
    </div>
  );
};

export default ShowAttendance;
