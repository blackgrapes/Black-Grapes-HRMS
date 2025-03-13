import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './SuperShowAttendance.css';

const HRAttendanceReport = () => {
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [message, setMessage] = useState('');

  const handleEmailChange = (e) => setEmployeeEmail(e.target.value);
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const fetchAttendanceRecords = async () => {
    if (!employeeEmail || !startDate || !endDate) {
      setMessage('Please provide an email and select a date range.');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/hrattendance/hr-attendance?hrEmail=${employeeEmail}&fromDate=${startDate}&toDate=${endDate}`
      );
      const data = await response.json();

      if (response.ok) {
        setAttendanceRecords(data.result || []);
        setMessage('');
      } else {
        setAttendanceRecords([]);
        setMessage(data.error || 'No attendance data found.');
      }
    } catch (err) {
      setMessage('Error retrieving attendance records. Please try again.');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetchAttendanceRecords();
  };

  const countAttendanceStats = () => {
    let stats = { present: 0, absent: 0, paidleave: 0, unpaidleave: 0, halfday: 0 };
    
    attendanceRecords.forEach((record) => {
      let statusKey = record.status.trim().toLowerCase().replace(' ', '');
      if (stats.hasOwnProperty(statusKey)) {
        stats[statusKey]++;
      }
    });

    return stats;
  };

  const formatDate = (date) => new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('BLACK GRAPE GROUPS', 105, 15, null, null, 'center');
    doc.setFontSize(12);
    doc.text('HR Attendance Report', 105, 22, null, null, 'center');

    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Date: ${today}`, 14, 35);
    doc.text(`Employee Email: ${employeeEmail}`, 14, 45);
    doc.text(`From: ${formatDate(startDate)}`, 14, 55);
    doc.text(`To: ${formatDate(endDate)}`, 14, 60);

    const { present, absent, paidleave, unpaidleave, halfday } = countAttendanceStats();
    doc.text(`Present: ${present}`, 14, 70);
    doc.text(`Absent: ${absent}`, 14, 75);
    doc.text(`Paid Leave: ${paidleave}`, 14, 80);
    doc.text(`Unpaid Leave: ${unpaidleave}`, 14, 85);
    doc.text(`Half Day: ${halfday}`, 14, 90);

    const tableData = attendanceRecords.map((record) => [record.date, record.status]);
    doc.autoTable({ head: [['Date', 'Status']], body: tableData, startY: 100 });
    doc.save(`HR_Attendance_${employeeEmail}_${startDate}_to_${endDate}.pdf`);
  };

  return (
    <div className='hr-attendance-container'>
      <h2>HR Attendance Report</h2>
      <form onSubmit={handleFormSubmit} className='hr-form'>
        <label>Email Address:</label>
        <input type='email' value={employeeEmail} onChange={handleEmailChange} placeholder='Enter employee email' />

        <label>From Date:</label>
        <input type='date' value={startDate} onChange={handleStartDateChange} />

        <label>To Date:</label>
        <input type='date' value={endDate} onChange={handleEndDateChange} />

        <button type='submit'>Retrieve Attendance</button>
      </form>

      {message && <div className='message-box'>{message}</div>}

      {attendanceRecords.length > 0 && (
        <div className='attendance-details'>
          <h3>Attendance Summary</h3>
          <p><strong>From:</strong> {formatDate(startDate)}</p>
          <p><strong>To:</strong> {formatDate(endDate)}</p>
          <p><strong>Present:</strong> {countAttendanceStats().present}</p>
          <p><strong>Absent:</strong> {countAttendanceStats().absent}</p>
          <p><strong>Paid Leave:</strong> {countAttendanceStats().paidleave}</p>
          <p><strong>Unpaid Leave:</strong> {countAttendanceStats().unpaidleave}</p>
          <p><strong>Half Day:</strong> {countAttendanceStats().halfday}</p>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.date}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={generatePDF} className='download-btn'>Download Report</button>
        </div>
      )}
    </div>
  );
};

export default HRAttendanceReport;
