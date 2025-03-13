import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./SuperAdminReport.css";

const SuperAdminReport = () => {
  const [hrData, setHrData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [payrollData, setPayrollData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHRData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/hrdetail/all");
        setHrData(response.data.Result || []);
      } catch (error) {
        console.error("Error fetching HR report:", error);
      }
    };

    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/employeedetail/all");
        setEmployeeData(response.data.Result || []);
      } catch (error) {
        console.error("Error fetching Employee report:", error);
      }
    };

    fetchHRData();
    fetchEmployeeData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const downloadPDF = (user, type) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("BLACK GRAPES GROUP", 105, 15, null, null, "center");
    doc.setFontSize(12);
    doc.text(`${type} Detail Report`, 105, 22, null, null, "center");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);

    const tableData = [
      ["Name", user.name],
      ["Email", user.email],
      ["Phone", user.phone || "-"],
      ["Department", user.department || "-"],
      ["Company", user.company || "N/A"],
      ["Address", user.address || "N/A"],
      ["Manager", user.manager || "N/A"],
      ["Date of Birth", user.dob || "N/A"],
      ["Joining Date", user.joiningDate || "N/A"],
    ];

    doc.autoTable({ startY: 40, head: [["Field", "Details"]], body: tableData });
    doc.save(`${user.name}_Report.pdf`);
  };

  return (
    <div className="superadmin-report-container">
      <h1 className="report-title">Super Admin Report</h1>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search HRs or Employees..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <button className="button" onClick={() => navigate("/SuperShowAttendance")}>
        Attendance Report
      </button>
      <div className="report-section">
        <h2 className="section-title">HR Report (Total: {hrData.length})</h2>
        <table className="report-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Address</th>
              <th>DOB</th>
              <th>Joining Date</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {hrData.map((hr) => (
              <tr key={hr.id}>
                <td>{hr.name}</td>
                <td>{hr.email}</td>
                <td>{hr.department || "N/A"}</td>
                <td>{hr.phone || "N/A"}</td>
                <td>{hr.address || "N/A"}</td>
                <td>{hr.dob || "N/A"}</td>
                <td>{hr.joiningDate || "N/A"}</td>
                <td><button className="button" onClick={() => downloadPDF(hr, "HR")}>&#x2B07;</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="report-section">
        <h2 className="section-title">Employee Report (Total: {employeeData.length})</h2>
        <table className="report-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Manager</th>
              <th>DOB</th>
              <th>Joining Date</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.company || "N/A"}</td>
                <td>{employee.department || "N/A"}</td>
                <td>{employee.phone || "N/A"}</td>
                <td>{employee.address || "N/A"}</td>
                <td>{employee.manager || "N/A"}</td>
                <td>{employee.dob || "N/A"}</td>
                <td>{employee.joiningDate || "N/A"}</td>
                <td><button className="button" onClick={() => downloadPDF(employee, "Employee")}>&#x2B07;</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminReport;
