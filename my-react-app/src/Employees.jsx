import React from "react";
import "./Employees.css"
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
const Employees = () => {
  const employeeList = [
    { id: 1, name: "Shrivanshu Dubey", role: "Software Engineer" },
    { id: 2, name: "Sneha Chouhan", role: "Software Engineer" },
    { id: 3, name: "Sourabh Pandey", role: "Software Engineer" },
    { id: 4, name: "Suraj", role: "Software Engineer" },
    { id: 5, name: "Shivani", role: "Software Engineer" }
  ]

  
  return (
    <div className="app">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="employee-container">
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
      </div>
    </div>
  );
};

export default Employees;
