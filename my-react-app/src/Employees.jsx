import React from "react";

// EmployeeDetails component to display individual employee details
const EmployeeDetails = ({ employee }) => (
  <div className="employee-details">
    <h3>Employee ID: {employee.id}</h3>
    <p>Name: {employee.name}</p>
    <p>Role: {employee.role}</p>
    <p>Email: {employee.email}</p>
    <p>Phone: {employee.phone}</p>
  </div>
);

// Employees component to display all employees
const Employees = () => {
  // Example employee data (could come from an API or state)
  const employeeList = [
    {
      id: 1,
      name: "John Doe",
      role: "Software Engineer",
      email: "john.doe@example.com",
      phone: "123-456-7890"
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "HR Manager",
      email: "jane.smith@example.com",
      phone: "987-654-3210"
    },
    // Add more employees as needed
  ];

  return (
    <div>
      <h2>Employees Page</h2>
      <p>Employee management content will go here.</p>
      <div className="employee-list">
        {employeeList.map((employee) => (
          <EmployeeDetails key={employee.id} employee={employee} />
        ))}
      </div>
    </div>
  );
};

export default Employees;
