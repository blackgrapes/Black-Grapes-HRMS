import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./SuperAdminReport.css";

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

  // Download PDF Report for HR (with DOB)
  const downloadHRPDF = (hr) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("BLACK GRAPES GROUP", 105, 15, null, null, "center");
    doc.setFontSize(12);
    doc.text("HR Detail Report", 105, 22, null, null, "center");
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);

    const tableData = [
      ["Name", hr.name],
      ["Email", hr.email],
      ["Date of Birth", hr.dob ? new Date(hr.dob).toLocaleDateString() : "N/A"], // ✅ Added DOB
      ["Address", hr.address || "N/A"],
      ["Phone", hr.phone || "N/A"],
      ["Department", hr.department || "N/A"],
      ["Joining Date", hr.joiningDate ? new Date(hr.joiningDate).toLocaleDateString() : "N/A"],
      ["Salary (Rs.)", hr.salary || "N/A"],
    ];

    doc.autoTable({
      startY: 40,
      head: [["Field", "Details"]],
      body: tableData,
    });

    doc.save(`${hr.name}_HR_Report.pdf`);
  };

  // Download PDF Report for Employee (with DOB)
  const downloadEmployeePDF = (employee) => {
    const doc = new jsPDF();
    const payroll = payrollData[employee.email] || { totalSalary: "N/A", paidUpto: "N/A" };

    doc.setFontSize(18);
    doc.text("BLACK GRAPES GROUP", 105, 15, null, null, "center");
    doc.setFontSize(12);
    doc.text("Employee Detail Report", 105, 22, null, null, "center");
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);

    const tableData = [
      ["Name", employee.name],
      ["Email", employee.email],
      ["Date of Birth", employee.dob ? new Date(employee.dob).toLocaleDateString() : "N/A"], // ✅ Added DOB
      ["Company", employee.company || "N/A"],
      ["Address", employee.address || "N/A"],
      ["Phone", employee.phone || "N/A"],
      ["Department", employee.department || "N/A"],
      ["Role", employee.role || "N/A"],
      ["Manager", employee.manager || "N/A"],
      ["Joining Date", employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "N/A"],
      ["Total Salary (Rs.)", payroll.totalSalary],
      ["Paid Upto", payroll.paidUpto],
    ];

    doc.autoTable({
      startY: 40,
      head: [["Field", "Details"]],
      body: tableData,
    });

    doc.save(`${employee.name}_Employee_Report.pdf`);
  };

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
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {filteredHRs.map((hr) => (
              <tr key={hr.id || hr._id}>
                <td>
                  <img src={hr.image || "https://via.placeholder.com/50"} alt={hr.name} className="hr-image" />
                </td>
                <td>{hr.name}</td>
                <td>{hr.email}</td>
                <td>{hr.department || "N/A"}</td>
                <td>{hr.phone || "N/A"}</td>
                <td>{hr.joiningDate ? new Date(hr.joiningDate).toLocaleDateString() : "N/A"}</td>
                <td>{hr.salary || "N/A"}</td>
                <td>
                  <button className="download-button" onClick={() => downloadHRPDF(hr)}>⬇️</button>
                </td>
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
              <th>Total Salary (Rs.)</th>
              <th>Paid Upto</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => {
              const payroll = payrollData[employee.email] || { totalSalary: "N/A", paidUpto: "N/A" };
              return (
                <tr key={employee.id || employee._id}>
                  <td>
                    <img src={employee.image || "https://via.placeholder.com/50"} alt={employee.name} className="employee-image" />
                  </td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.company || "N/A"}</td>
                  <td>{employee.department || "N/A"}</td>
                  <td>{employee.role || "N/A"}</td>
                  <td>{employee.manager || "N/A"}</td>
                  <td>{employee.phone || "N/A"}</td>
                  <td>{employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "N/A"}</td>
                  <td>{payroll.totalSalary}</td>
                  <td>{payroll.paidUpto}</td>
                  <td>
                    <button className="download-button" onClick={() => downloadEmployeePDF(employee)}>⬇️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminReport;
