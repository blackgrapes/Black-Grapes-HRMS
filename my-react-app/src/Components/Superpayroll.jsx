import React, { useState } from 'react';
import './Superpayroll.css';

const Superpayroll = () => {
  const [employeeData, setEmployeeData] = useState([
    { id: 1, name: 'John Doe', position: 'Software Developer', salary: 5000 },
    { id: 2, name: 'Jane Smith', position: 'HR Manager', salary: 6000 },
    { id: 3, name: 'Michael Johnson', position: 'Designer', salary: 4500 }
  ]);

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    salary: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value
    });
  };

  const handleAddEmployee = () => {
    const { name, position, salary } = newEmployee;
    if (name && position && salary) {
      setEmployeeData([
        ...employeeData,
        { id: employeeData.length + 1, name, position, salary: parseInt(salary) }
      ]);
      setNewEmployee({ name: '', position: '', salary: '' });
    }
  };

  return (
    <div className="payroll-container">
      <h1>Employee Payroll Management</h1>
      
      {/* Employee Table */}
      <table className="payroll-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Salary ($)</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>{employee.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add New Employee Form */}
      <div className="add-employee-form">
        <h2>Add New Employee</h2>
        <label>Name:
          <input
            type="text"
            name="name"
            value={newEmployee.name}
            onChange={handleChange}
          />
        </label>
        <label>Position:
          <input
            type="text"
            name="position"
            value={newEmployee.position}
            onChange={handleChange}
          />
        </label>
        <label>Salary:
          <input
            type="number"
            name="salary"
            value={newEmployee.salary}
            onChange={handleChange}
          />
        </label>
        <button onClick={handleAddEmployee}>Add Employee</button>
      </div>
    </div>
  );
};

export default Superpayroll;
