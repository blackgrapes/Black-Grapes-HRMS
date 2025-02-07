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
        if (result.data.Result) {
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
    const filteredData = employee.filter((e) => {
      const searchValue = searchTerm.toLowerCase();
      if (category === "name") return e.name?.toLowerCase().includes(searchValue);
      if (category === "email") return e.email?.toLowerCase().includes(searchValue);
      return true; // Default return to show all if no category matches
    });
    setFilteredEmployees(filteredData);
  };

  // Function to handle employee deletion
  const handleDelete = (id) => {
    console.log("Deleting employee with ID:", id); // Debug log

    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios
        .delete(`http://localhost:3000/employeedetail/delete_employee/${id}`)
        .then((result) => {
          if (result.status === 200) { // Check HTTP status code
            // Remove employee from local state after deletion
            setEmployee(employee.filter(emp => emp._id !== id)); // Use _id
            setFilteredEmployees(filteredEmployees.filter(emp => emp._id !== id)); // Use _id
          } else {
            alert(result.data.Error);
          }
        })
        .catch((err) => {
          console.error("Error deleting employee:", err);
          alert(`Error: ${err.response?.data?.Error || "Something went wrong"}`);
        });
    }
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
              <th>Manager</th>
              <th>Company</th>
              <th>Department</th>
              <th>Role</th>
              <th>DELETE</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
             <tr key={emp._id}>
               <td>{emp.name || "N/A"}</td>
               <td>{emp.email || "N/A"}</td>
               <td>{emp.address || "N/A"}</td>
               <td>{emp.phone || "N/A"}</td>
               <td>{emp.manager || "N/A"}</td>
               <td>{emp.company || "N/A"}</td> 
               <td>{emp.Department || emp.department || "N/A"}</td>
               <td>{emp.designation || emp.role || "N/A"}</td>
             
               <td>
                 <button className="btn btn-danger" onClick={() => handleDelete(emp._id)}>
                 🗑️
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
