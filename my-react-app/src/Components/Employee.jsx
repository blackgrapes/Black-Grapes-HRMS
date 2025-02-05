import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Employee.css'; // Import custom CSS for table styling

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('name'); // Default search category
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    // Fetching employee data
    axios
      .get("http://localhost:3000/employeedetail/all")
      .then((result) => {
        if (result) {
          setEmployee(result.data.Result);
          setFilteredEmployees(result.data.Result); // Initially show all employees
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // Function to handle the search and filtering logic
  const handleSearch = () => {
    let filteredData = employee.filter((e) => {
      if (category === "name") {
        return e.name.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (category === "email") {
        return e.email.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (category === "role") { // Changed to "role"
        return e.role?.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (category === "department") { // Changed to "department"
        return e.department?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return e;
    });
    setFilteredEmployees(filteredData);
  };

  // Fix: Delete employee by id
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?"))
    axios
      .delete(`http://localhost:3000/employeedetail/delete_employee/${id}`)
      .then((result) => {
        if (result.data.message === "Employee deleted successfully") { // Check for successful delete message
          setEmployee(employee.filter(emp => emp._id !== id)); // Remove from local state
          setFilteredEmployees(filteredEmployees.filter(emp => emp._id !== id)); // Update filtered list
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
        alert("An error occurred while deleting the employee");
      });
  };

  return (
    <div className="employee-container px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>
      <Link to="/dashboard/add_employee" className="btn btn-success me-2">
        Add Employee
      </Link>
      <Link to="/dashboard/signup_employee" className="btn btn-success me-2">
        SignUp Employee
      </Link>

      {/* Search Section */}
      <div className="d-flex mt-3">
        <select
          className="form-select me-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="name">Search by Name</option>
          <option value="email">Search by Email</option>
          <option value="role">Search by Role</option>
          <option value="department">Search by Department</option>
        </select>
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Employee Table */}
      <div className="employee-table-container mt-3">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Manager</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((e) => (
              <tr key={e._id}>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.address}</td>
                <td>{e.phone}</td>
                <td>{e.role}</td> {/* Fixed from designation to role */}
                <td>{e.manager}</td>
                <td>{e.department}</td> {/* Fixed from Department to department */}
                <td>{e.salary}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(e._id)} // Correct usage of id here
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
