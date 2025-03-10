import React from "react";
import "./SuperShowAttendance.css";

const SuperShowAttendance = () => {
  const attendanceData = [
    { id: 1, name: "Amar Dubey", from: "2025-03-01", to: "2025-03-05", status: "Leave" },
    { id: 2, name: "Shrivanshu Dubey", from: "2025-03-08", to: "2025-03-10", status: "Leave" },
    { id: 3, name: "Ravi Kumar", from: "2025-03-02", to: "2025-03-02", status: "Absent" },
    { id: 4, name: "Test Employee", from: "N/A", to: "N/A", status: "Present" },
  ];

  // 🖨️ Function to download CSV
  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,Leave From,Leave To,Status\n";

    attendanceData.forEach((record) => {
      csvContent += `${record.id},${record.name},${record.from},${record.to},${record.status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "HR_Attendance_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="attendance-container">
      <h2 className="attendance-title">HR Attendance Report</h2>

      <div className="search-bar">
        <input type="text" placeholder="Search HR..." />
      </div>

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Leave From</th>
              <th>Leave To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.name}</td>
                <td>{record.from}</td>
                <td>{record.to}</td>
                <td>
                  <span className={`status ${record.status.toLowerCase()}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📥 Download Button */}
      <button className="download-btn" onClick={downloadCSV}>
        Download Report 📥
      </button>
    </div>
  );
};

export default SuperShowAttendance;
