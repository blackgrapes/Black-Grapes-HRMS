import React from "react";

const AttendanceSummary = () => {
  const summaryData = {
    totalEmployees: 50,
    present: 45,
    absent: 3,
    onLeave: 2,
  };

  return (
    <div className="attendance-summary">
      <h3>Attendance Summary</h3>
      <ul>
        <li>Total Employees: {summaryData.totalEmployees}</li>
        <li>Present: {summaryData.present}</li>
        <li>Absent: {summaryData.absent}</li>
        <li>On Leave: {summaryData.onLeave}</li>
      </ul>
    </div>
  );
};

export default AttendanceSummary;
