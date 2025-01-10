import React from "react";
import "./Employees.css"
const Employees = () => {
  const employeeList = [
    { id: 1, name: "John Doe", role: "Software Engineer" },
    { id: 2, name: "Jane Smith", role: "HR Manager" }
  ];

  return (
    <div>
      <h2>Employee List</h2>
      <div className="employee-list">
        {employeeList.map((employee) => (
          <div key={employee.id} className="employee-details">
            <p>ID: {employee.id}</p>
            <p>Name: {employee.name}</p>
            <p>Role: {employee.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employees;
