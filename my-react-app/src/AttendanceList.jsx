import React from "react";

const AttendanceList = () => {
  const attendanceData = [
    { id: 1, employeeName: "Shrivanshu Dubey", date: "2025-01-10", status: "Present" },
    { id: 2, employeeName: "Sneha Chouhan", date: "2025-01-10", status: "Present" },
    { id: 3, employeeName: "Sourabh Pandey", date: "2025-01-10", status: "Present" },
    { id: 4, employeeName: "Suraj", date: "2025-01-10", status: "Present" },
    { id: 5, employeeName: "Shivani", date: "2025-01-10", status: "Present" },
  ];

  return (
    <div className="attendance-list">
      <h3>Attendance Records</h3>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.employeeName}</td>
              <td>{entry.date}</td>
              <td>{entry.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceList;
