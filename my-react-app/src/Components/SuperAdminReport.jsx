import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SuperAdminReport.css';

const SuperAdminReport = () => {
  const [hrData, setHrData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);

  // Fetch HR and Employee data
  useEffect(() => {
    // Fetch HR report data
    axios.get('http://localhost:3000/hrdetail/all')
      .then((response) => {
        console.log("HR Report Data:", response.data);
        setHrData(Array.isArray(response.data) ? response.data : response.data.hrData || []);
      })
      .catch((error) => console.error('Error fetching HR report:', error));

    // Fetch Employee report data
    axios.get('http://localhost:3000/employeedetail/all')
      .then((response) => {
        console.log("Employee Report Data:", response.data);
        setEmployeeData(Array.isArray(response.data) ? response.data : response.data.employees || []);
      })
      .catch((error) => console.error('Error fetching Employee report:', error));
  }, []);

  return (
    <div className="superadmin-report-container">
      {/* HR Report Section */}
      <div className="report-section hr-section">
        <h2 className="section-title">HR Report</h2>
        <div className="report-content">
          <h4>Total HRs: {hrData.length}</h4>
          <table className="report-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Designation</th>
              </tr>
            </thead>
            <tbody>
              {hrData.map((hr) => (
                <tr key={hr.id || hr._id}>
                  <td>{hr.name}</td>
                  <td>{hr.email}</td>
                  <td>{hr.designation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Report Section */}
      <div className="report-section employee-section">
        <h2 className="section-title">Employee Report</h2>
        <div className="report-content">
          <h4>Total Employees: {employeeData.length}</h4>
          <table className="report-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Designation</th>
                <th>Manager</th>
                <th>Joining Date</th>
                <th>Salary</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.map((employee) => (
                <tr key={employee.id || employee._id}>
                  <td>
                    <img
                      src={employee.image || 'https://via.placeholder.com/50'}
                      alt={employee.name}
                      className="employee-image"
                    />
                  </td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.address || "N/A"}</td>
                  <td>{employee.phone || "N/A"}</td>
                  <td>{employee.designation || "N/A"}</td>
                  <td>{employee.manager || "N/A"}</td>
                  <td>{employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "N/A"}</td>
                  <td>{employee.salary || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminReport;
