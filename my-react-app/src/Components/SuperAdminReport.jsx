import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./SuperAdminReport.css";
import gudda from "/src/assets/gudda.svg"; // ✅ Absolute Import for Vite

const SuperAdminReport = () => {
  const [hrData, setHrData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [payrollData, setPayrollData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch HR, Employee, and Payroll Data
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

    const fetchPayrollData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/Payroll/payroll-with-details");
        const payrollMap = {};
        response.data.payrollData.forEach((payroll) => {
          payrollMap[payroll.email] = {
            totalSalary: payroll.totalSalary || "N/A",
            paidUpto: payroll.paidUpto || "N/A",
          };
        });
        setPayrollData(payrollMap);
      } catch (error) {
        console.error("Error fetching Payroll data:", error);
      }
    };

    fetchHRData();
    fetchEmployeeData();
    fetchPayrollData();
  }, []);

  // Handle search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredHRs = hrData.filter((hr) =>
    hr.name.toLowerCase().includes(searchTerm) ||
    hr.email.toLowerCase().includes(searchTerm) ||
    hr.department?.toLowerCase().includes(searchTerm)
  );

  const filteredEmployees = employeeData.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm) ||
    employee.email.toLowerCase().includes(searchTerm) ||
    employee.department?.toLowerCase().includes(searchTerm) ||
    employee.role?.toLowerCase().includes(searchTerm) ||
    employee.company?.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="superadmin-report-container">
      <h1 className="report-title">Super Admin Report</h1>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search HRs or Employees..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* HR Report Section */}
      <div className="report-section hr-section">
        <h2 className="section-title">HR Report (Total: {filteredHRs.length})</h2>
        <table className="report-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Joining Date</th>
              <th>Salary (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {filteredHRs.map((hr) => (
              <tr key={hr.id || hr._id}>
                <td>
                  <img
                    src={hr.image || gudda} // ✅ Use `gudda.svg` if no image available
                    alt={hr.name}
                    className="hr-image"
                  />
                </td>
                <td>{hr.name}</td>
                <td>{hr.email}</td>
                <td>{hr.department || "N/A"}</td>
                <td>{hr.phone || "N/A"}</td>
                <td>{hr.joiningDate ? new Date(hr.joiningDate).toLocaleDateString() : "N/A"}</td>
                <td>{hr.salary || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Employee Report Section */}
      <div className="report-section employee-section">
        <h2 className="section-title">Employee Report (Total: {filteredEmployees.length})</h2>
        <table className="report-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Department</th>
              <th>Role</th>
              <th>Manager</th>
              <th>Phone</th>
              <th>Joining Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id || employee._id}>
                <td>
                  <img
                    src={employee.image || gudda} // ✅ Use `gudda.svg` if no image available
                    alt={employee.name}
                    className="employee-image"
                  />
                </td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.company || "N/A"}</td>
                <td>{employee.department || "N/A"}</td>
                <td>{employee.role || "N/A"}</td>
                <td>{employee.manager || "N/A"}</td>
                <td>{employee.phone || "N/A"}</td>
                <td>{employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminReport;
