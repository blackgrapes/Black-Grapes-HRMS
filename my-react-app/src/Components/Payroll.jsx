import React, { useState } from "react";
import './Payroll.css'

// Sample data for employees
const employees = [
  { id: 1, name: "John Doe", basicSalary: 5000, allowances: 1000, deductions: 200 },
  { id: 2, name: "Jane Smith", basicSalary: 6000, allowances: 1500, deductions: 300 },
  { id: 3, name: "Michael Brown", basicSalary: 4500, allowances: 800, deductions: 150 },
];

const Payroll = () => {
  const [payrollData, setPayrollData] = useState(employees);

  const calculateTotalSalary = (basicSalary, allowances, deductions) => {
    return basicSalary + allowances - deductions;
  };

  return (
    <div className="payroll-container">
      <h1>Payroll Management</h1>
      
      <table className="payroll-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Basic Salary</th>
            <th>Allowances</th>
            <th>Deductions</th>
            <th>Total Salary</th>
          </tr>
        </thead>
        <tbody>
          {payrollData.map((employee) => {
            const { id, name, basicSalary, allowances, deductions } = employee;
            const totalSalary = calculateTotalSalary(basicSalary, allowances, deductions);

            return (
              <tr key={id}>
                <td>{name}</td>
                <td>${basicSalary}</td>
                <td>${allowances}</td>
                <td>${deductions}</td>
                <td>${totalSalary}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Payroll;
