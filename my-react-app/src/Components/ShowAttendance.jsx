import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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

  const countStatuses = () => {
    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;
    let halfDayCount = 0;

    attendanceData.forEach(record => {
      if (record.status === 'Present') presentCount++;
      if (record.status === 'Absent') absentCount++;
      if (record.status === 'On Leave') leaveCount++;
      if (record.status === 'Half Day') halfDayCount++;
    });

    return { presentCount, absentCount, leaveCount, halfDayCount };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(18);
    doc.setFont("bold");
    doc.text("BLACK GRAPES GROUP", 105, 15, null, null, "center");

    // Add subheading
    doc.setFontSize(12);
    doc.text("Employee Detail Report", 105, 22, null, null, "center");

    // Add download date
    const downloadDate = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Date: ${downloadDate}`, 14, 35);

    // Add employee email in bold
    doc.setFont("bold");
    doc.text(`Employee Email: ${email}`, 14, 45);

    // Add date range in words
    doc.setFont("normal");
    doc.text(`From: ${formatDate(fromDate)}`, 14, 55);
    doc.text(`To: ${formatDate(toDate)}`, 14, 60);

    // Calculate attendance status counts
    const { presentCount, absentCount, leaveCount, halfDayCount } = countStatuses();

    // Add attendance status counts
    doc.text(`Present: ${presentCount}`, 14, 70);
    doc.text(`Absent: ${absentCount}`, 14, 75);
    doc.text(`On Leave: ${leaveCount}`, 14, 80);
    doc.text(`Half Day: ${halfDayCount}`, 14, 85);

    // Add the attendance data table
    const tableColumn = ['Date', 'Status'];
    const tableRows = attendanceData.map(record => [record.date, record.status]);

    // Corrected autoTable usage to ensure proper positioning
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 95, // Adjust startY position after adding counts and other details
    });

    // Save the PDF
    doc.save(`Attendance_Report_${email}_${fromDate}_to_${toDate}.pdf`);
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
          <>
            <div className="attendance-summary">
              <p><strong>Attendance Summary</strong></p>
              <p><strong>From:</strong> {formatDate(fromDate)}</p>
              <p><strong>To:</strong> {formatDate(toDate)}</p>
              <p><strong>Present:</strong> {countStatuses().presentCount}</p>
              <p><strong>Absent:</strong> {countStatuses().absentCount}</p>
              <p><strong>On Leave:</strong> {countStatuses().leaveCount}</p>
              <p><strong>Half Day:</strong> {countStatuses().halfDayCount}</p>
            </div>

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
            <button onClick={downloadPDF} className="download-btn">Download PDF</button>
          </>
        ) : (
          <div>No attendance data available for this period.</div>
        )}
      </div>
    </div>
  );
};

export default ShowAttendance;
