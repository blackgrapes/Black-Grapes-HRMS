import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SuperAdminReport.css';

const SuperAdminReport = () => {
  const [hrData, setHrData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);

  // Fetch HR and Employee data
  useEffect(() => {
    // Fetch HR report data
    axios.get('http://localhost:3000/hr/report')
      .then((response) => {
        setHrData(response.data);
      })
      .catch((error) => console.error('Error fetching HR report:', error));

    // Fetch Employee report data
    axios.get('http://localhost:3000/employee/report')
      .then((response) => {
        setEmployeeData(response.data);
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
              {hrData.map((hr, index) => (
                <tr key={index}>
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
                <th>Name</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {employeeData.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.designation}</td>
                  <td>{employee.phone}</td>
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
