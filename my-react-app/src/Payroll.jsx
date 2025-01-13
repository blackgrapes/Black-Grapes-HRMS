import React, { useState } from "react";
import "./Payroll.css"; // Import the CSS for the payroll

// Sample payroll data (This can be fetched from an API or database)
const sampleEmployees = [
  {
    id: 1,
    name: "Sourabh narayan pandey",
    position: "Software Engineer",
    salary: 5000,
    bonuses: 500,
    deductions: 200,
    paymentStatus: "Paid",
    paymentDate: "2025-01-10"
  },
  {
    id: 2,
    name: "Shrivanshu dubey",
    position: "HR Manager",
    salary: 4000,
    bonuses: 300,
    deductions: 150,
    paymentStatus: "Unpaid",
    paymentDate: ""
  },
  // More employees can be added here
];

const Payroll = () => {
  const [employees, setEmployees] = useState(sampleEmployees);
  const [newPayroll, setNewPayroll] = useState({
    name: "",
    position: "",
    salary: "",
    bonuses: "",
    deductions: "",
    paymentStatus: "Unpaid",
    paymentDate: ""
  });

  // Handle input changes for new payroll entry
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayroll((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a new payroll entry
  const handleAddPayroll = () => {
    const newEmployee = {
      id: employees.length + 1,
      ...newPayroll,
    };
    setEmployees([...employees, newEmployee]);
    setNewPayroll({
      name: "",
      position: "",
      salary: "",
      bonuses: "",
      deductions: "",
      paymentStatus: "Unpaid",
      paymentDate: ""
    });
  };

  // Handle paying an employee (updating payment status and payment date)
  const handlePayEmployee = (id) => {
    const updatedEmployees = employees.map((emp) =>
      emp.id === id
        ? { ...emp, paymentStatus: "Paid", paymentDate: new Date().toLocaleDateString() }
        : emp
    );
    setEmployees(updatedEmployees);
  };

  // Handle deleting a payroll entry
  const handleDeletePayroll = (id) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== id);
    setEmployees(updatedEmployees);
  };

  return (
    <div className="payroll-container">
      <h2>Payroll Management</h2>

      {/* Payroll Table */}
      <table className="payroll-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Salary</th>
            <th>Bonuses</th>
            <th>Deductions</th>
            <th>Payment Status</th>
            <th>Payment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>${employee.salary}</td>
              <td>${employee.bonuses}</td>
              <td>${employee.deductions}</td>
              <td>{employee.paymentStatus}</td>
              <td>{employee.paymentDate || "N/A"}</td>
              <td>
                <button
                  className="pay-button"
                  onClick={() => handlePayEmployee(employee.id)}
                  disabled={employee.paymentStatus === "Paid"}
                >
                  Pay
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeletePayroll(employee.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Payroll Form */}
      <div className="add-payroll-form">
        <h3>Add Payroll</h3>
        <input
          type="text"
          name="name"
          value={newPayroll.name}
          onChange={handleInputChange}
          placeholder="Employee Name"
        />
        <input
          type="text"
          name="position"
          value={newPayroll.position}
          onChange={handleInputChange}
          placeholder="Employee Position"
        />
        <input
          type="number"
          name="salary"
          value={newPayroll.salary}
          onChange={handleInputChange}
          placeholder="Salary"
        />
        <input
          type="number"
          name="bonuses"
          value={newPayroll.bonuses}
          onChange={handleInputChange}
          placeholder="Bonuses"
        />
        <input
          type="number"
          name="deductions"
          value={newPayroll.deductions}
          onChange={handleInputChange}
          placeholder="Deductions"
        />
        <button onClick={handleAddPayroll}>Add Payroll</button>
      </div>
    </div>
  );
};

export default Payroll;
