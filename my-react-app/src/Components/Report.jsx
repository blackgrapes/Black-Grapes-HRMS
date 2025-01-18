import React, { useState, useEffect } from 'react';
import './Report.css'; // Importing the corresponding CSS file

const Report = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Fetch employee data from an API or mock data for now
    const fetchEmployeeData = async () => {
      const data = [
        { id: 1, name: 'John Doe', position: 'Software Engineer', department: 'Engineering', salary: '$80,000', attendance: '' },
        { id: 2, name: 'Jane Smith', position: 'Product Manager', department: 'Product', salary: '$95,000', attendance: '' },
        { id: 3, name: 'Michael Johnson', position: 'HR Specialist', department: 'HR', salary: '$55,000', attendance: '' },
        // More employee records can go here
      ];
      setEmployees(data);
    };

    fetchEmployeeData();
  }, []);

  const handleAttendance = (id, status) => {
    setEmployees(prevEmployees =>
      prevEmployees.map(employee =>
        employee.id === id ? { ...employee, attendance: status } : employee
      )
    );
  };

  return (
    <div className="report-container">
      <h1 className="report-title">Employee Report</h1>
      <table className="report-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>{employee.department}</td>
              <td>{employee.salary}</td>
              <td>
                {employee.attendance === '' ? (
                  <>
                    <button
                      className="attendance-btn present"
                      onClick={() => handleAttendance(employee.id, 'Present')}
                    >
                      Mark Present
                    </button>
                    <button
                      className="attendance-btn absent"
                      onClick={() => handleAttendance(employee.id, 'Absent')}
                    >
                      Mark Absent
                    </button>
                  </>
                ) : (
                  <span>{employee.attendance}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Report;
