import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome
import './Report.css';

const Report = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState({});
  const navigate = useNavigate();

  // Fetch employee and payroll data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employeeResult = await axios.get("http://localhost:3000/employeedetail/all");
        if (employeeResult.data && employeeResult.data.Result) {
          setEmployees(employeeResult.data.Result);
          setFilteredEmployees(employeeResult.data.Result);
        } else {
          alert(employeeResult.data.Error || "Failed to fetch employees.");
        }
      } catch (err) {
        console.error("Error fetching employee data:", err);
      }
    };

    const fetchPayrollData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/Payroll/payroll-with-details');
        const payrollMap = {};
        response.data.payrollData.forEach((payroll) => {
          payrollMap[payroll.email] = {
            totalSalary: payroll.totalSalary,
            paidUpto: payroll.paidUpto || "N/A"
          };
        });
        console.log("Payroll Data:", payrollMap); // Debug log
        setPayrollData(payrollMap);
      } catch (err) {
        console.error("Error fetching payroll data:", err);
      }
    };

    fetchEmployeeData();
    fetchPayrollData();
  }, []);

  // Handle search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(value) ||
      employee.email.toLowerCase().includes(value) ||
      (employee.department && employee.department.toLowerCase().includes(value)) ||
      (employee.company && employee.company.toLowerCase().includes(value))
    );
    setFilteredEmployees(filtered);
  };

  // Download Employee PDF Report
  const downloadEmployeePDF = (employee) => {
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

    const payroll = payrollData[employee.email] || { totalSalary: "N/A", paidUpto: "N/A" };

    const tableData = [
      ["Name", employee.name],
      ["Email", employee.email],
      ["Address", employee.address],
      ["Phone", employee.phone],
      ["Company", employee.company || "-"],
      ["Department", employee.department || "-"],
      ["Manager", employee.manager || "-"],
      ["Date of Birth", employee.dob || "-"],
      ["Joining Date", employee.joiningDate || "-"],
      ["Total Salary (Rs.)", payroll.totalSalary],
      ["Paid Upto", payroll.paidUpto]
    ];

    doc.autoTable({
      startY: 40,
      head: [["Field", "Details"]],
      body: tableData
    });

    doc.save(`${employee.name}_Report.pdf`);
  };

  return (
    <div className="report-container">
      <h1 className="report-title">Employee Report</h1>

      {/* Search & Buttons */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, department, or company"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button className="button" onClick={() => navigate('/dashboard/ShowAttendance')}>Attendance Report</button>
      </div>

      {/* Employee Table */}
      <table className="report-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Department</th>
            <th>Total Salary (Rs.)</th>
            <th>Paid Upto</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => {
            const payroll = payrollData[employee.email] || { totalSalary: "N/A", paidUpto: "N/A" };
            return (
              <tr key={employee._id || employee.id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.address}</td>
                <td>{employee.phone}</td>
                <td>{employee.company || "-"}</td>
                <td>{employee.department || "-"}</td>
                <td>{payroll.totalSalary}</td>
                <td>{payroll.paidUpto}</td>
                <td>
                  <button className="button" onClick={() => downloadEmployeePDF(employee)}>
                  <h6>⬇️</h6>
                  {/* Font Awesome download icon */}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Report;
