import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API requests
import './Report.css'; // Importing the corresponding CSS file

const Report = () => {
  const [employees, setEmployees] = useState([]); // Employee data from backend
  const [searchTerm, setSearchTerm] = useState(''); // Search input value
  const [filteredEmployees, setFilteredEmployees] = useState([]); // Filtered employee list

  useEffect(() => {
    // Fetch employee data from the backend
    const fetchEmployeeData = async () => {
      try {
        const result = await axios.get("http://localhost:3000/employeedetail/all");
        if (result.data && result.data.Result) {
          setEmployees(result.data.Result); // Set the employee data
          setFilteredEmployees(result.data.Result); // Initialize the filtered data
        } else {
          alert(result.data.Error || "Failed to fetch employees.");
        }
      } catch (err) {
        console.error("Error fetching employee data:", err);
      }
    };

    fetchEmployeeData(); // Call the fetch function inside useEffect
  }, []); // Dependency array to ensure this runs only once on mount

  // Handle search input changes
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter employees based on the search term
    const filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(value) ||
      employee.email.toLowerCase().includes(value) ||
      employee.designation.toLowerCase().includes(value)
    );

    setFilteredEmployees(filtered);
  };

  return (
    <div className="report-container">
      <h1 className="report-title">Employee Report</h1>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, or designation"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Employee Table */}
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
          {filteredEmployees.map((employee) => (
            <tr key={employee.id || employee._id}> {/* Use `id` or `_id` depending on your backend */}
              <td>
                <img
                  src={employee.image || 'https://via.placeholder.com/50'}
                  alt={employee.name}
                  className="employee-image"
                />
              </td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.address}</td>
              <td>{employee.phone}</td>
              <td>{employee.designation}</td>
              <td>{employee.manager}</td>
              <td>{new Date(employee.joiningDate).toLocaleDateString()}</td>
              <td>{employee.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Report;
