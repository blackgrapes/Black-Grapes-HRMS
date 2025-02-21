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
      const response = await fetch(
        `${process.env.VITE_API_URL}/attendance/attendance?employeeEmail=${email}&fromDate=${fromDate}&toDate=${toDate}`
      );
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

  // ✅ Count attendance statuses, including Paid and Unpaid Leaves
  const countStatuses = () => {
    let presentCount = 0;
    let absentCount = 0;
    let paidLeaveCount = 0;
    let unpaidLeaveCount = 0;
    let halfDayCount = 0;

    attendanceData.forEach((record) => {
      if (record.status === 'Present') presentCount++;
      if (record.status === 'Absent') absentCount++;
      if (record.status === 'Paid Leave') paidLeaveCount++;
      if (record.status === 'Unpaid Leave') unpaidLeaveCount++;
      if (record.status === 'Half Day') halfDayCount++;
    });

    return { presentCount, absentCount, paidLeaveCount, unpaidLeaveCount, halfDayCount };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // ✅ Generate PDF with Paid/Unpaid Leave
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setFont("bold");
    doc.text("BLACK GRAPES GROUP", 105, 15, null, null, "center");

    // Subheading
    doc.setFontSize(12);
    doc.text("Employee Attendance Report", 105, 22, null, null, "center");

    // Date Info
    const downloadDate = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Date: ${downloadDate}`, 14, 35);

    // Employee Email & Date Range
    doc.setFont("bold");
    doc.text(`Employee Email: ${email}`, 14, 45);
    doc.setFont("normal");
    doc.text(`From: ${formatDate(fromDate)}`, 14, 55);
    doc.text(`To: ${formatDate(toDate)}`, 14, 60);

    // Attendance Summary
    const { presentCount, absentCount, paidLeaveCount, unpaidLeaveCount, halfDayCount } = countStatuses();
    doc.text(`Present: ${presentCount}`, 14, 70);
    doc.text(`Absent: ${absentCount}`, 14, 75);
    doc.text(`Paid Leave: ${paidLeaveCount}`, 14, 80);
    doc.text(`Unpaid Leave: ${unpaidLeaveCount}`, 14, 85);
    doc.text(`Half Day: ${halfDayCount}`, 14, 90);

    // Attendance Data Table
    const tableColumn = ['Date', 'Status'];
    const tableRows = attendanceData.map((record) => [record.date, record.status]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 100,
    });

    // Save PDF
    doc.save(`Attendance_Report_${email}_${fromDate}_to_${toDate}.pdf`);
  };

  return (
    <div className="attendance-container">
      <h2>Attendance Tracker</h2>
      <form onSubmit={handleSubmit} className="email-form">
        <label htmlFor="email">Email Address:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="example@domain.com"
        />

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
              <p><strong>Paid Leave:</strong> {countStatuses().paidLeaveCount}</p>
              <p><strong>Unpaid Leave:</strong> {countStatuses().unpaidLeaveCount}</p>
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
