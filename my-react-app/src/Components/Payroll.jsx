import React, { useState } from "react";
import './Payroll.css'

// Sample data for employees
const initialEmployees = [
  { id: 1, name: "John Doe", basicSalary: 5000, allowances: 1000, deductions: 200 },
  { id: 2, name: "Jane Smith", basicSalary: 6000, allowances: 1500, deductions: 300 },
  { id: 3, name: "Michael Brown", basicSalary: 4500, allowances: 800, deductions: 150 },
];

const Payroll = () => {
  const [payrollData, setPayrollData] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
  });

  const calculateTotalSalary = (basicSalary, allowances, deductions) => {
    return basicSalary + allowances - deductions;
  };

  // Handle search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle adding a new employee
  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.basicSalary && newEmployee.allowances && newEmployee.deductions) {
      const newEmp = {
        id: payrollData.length + 1,
        name: newEmployee.name,
        basicSalary: parseFloat(newEmployee.basicSalary),
        allowances: parseFloat(newEmployee.allowances),
        deductions: parseFloat(newEmployee.deductions),
      };
      setPayrollData([...payrollData, newEmp]);
      setNewEmployee({
        name: "",
        basicSalary: "",
        allowances: "",
        deductions: "",
      });
    }
  };

  // Handle editing an employee (optional)
  const handleEditEmployee = (id) => {
    const employee = payrollData.find(emp => emp.id === id);
    setNewEmployee({
      name: employee.name,
      basicSalary: employee.basicSalary,
      allowances: employee.allowances,
      deductions: employee.deductions,
    });
    setPayrollData(payrollData.filter(emp => emp.id !== id));  // Temporarily remove to edit
  };

  // Handle deleting an employee
  const handleDeleteEmployee = (id) => {
    setPayrollData(payrollData.filter(emp => emp.id !== id));
  };

  const filteredData = payrollData.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="payroll-container">
      <h1>Payroll Management</h1>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Employee"
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />

      {/* Add New Employee Form */}
      <div className="add-employee-form">
        <input
          type="text"
          placeholder="Name"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Basic Salary"
          value={newEmployee.basicSalary}
          onChange={(e) => setNewEmployee({ ...newEmployee, basicSalary: e.target.value })}
        />
        <input
          type="number"
          placeholder="Allowances"
          value={newEmployee.allowances}
          onChange={(e) => setNewEmployee({ ...newEmployee, allowances: e.target.value })}
        />
        <input
          type="number"
          placeholder="Deductions"
          value={newEmployee.deductions}
          onChange={(e) => setNewEmployee({ ...newEmployee, deductions: e.target.value })}
        />
        <button onClick={handleAddEmployee} className="add-btn">Add Employee</button>
      </div>

      <table className="payroll-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Basic Salary</th>
            <th>Allowances</th>
            <th>Deductions</th>
            <th>Total Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((employee) => {
            const { id, name, basicSalary, allowances, deductions } = employee;
            const totalSalary = calculateTotalSalary(basicSalary, allowances, deductions);

            return (
              <tr key={id}>
                <td>{name}</td>
                <td>${basicSalary}</td>
                <td>${allowances}</td>
                <td>${deductions}</td>
                <td>${totalSalary}</td>
                <td>
                  <button onClick={() => handleEditEmployee(id)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDeleteEmployee(id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Payroll;
