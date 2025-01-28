import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ManageEmployee.css"; // Import CSS

const ManageEmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [hrDetails, setHrDetails] = useState([]);

  useEffect(() => {
    // Fetch Employee Details
    axios
      .get("http://localhost:3000/employeedetail/all")
      .then((result) => {
        if (result.data.Result) {
          setEmployees(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.error("Error fetching employees:", err));

    // Fetch HR Details
    axios
      .get("http://localhost:3000/hrdetail/all") // Corrected URL
      .then((result) => {
        if (result.data.Result) {
          setHrDetails(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.error("Error fetching HR details:", err));
  }, []);

  const handleDeleteEmployee = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios
        .delete(`http://localhost:3000/auth/delete_employee/${id}`)
        .then((result) => {
          if (result.data.Status) {
            alert("Employee deleted successfully");
            setEmployees(employees.filter((emp) => emp.id !== id));
          } else {
            alert("Error deleting employee");
          }
        })
        .catch((err) => console.error("Error deleting employee:", err));
    }
  };

  const handleDeleteHR = (id) => {
    if (window.confirm("Are you sure you want to delete this HR?")) {
      axios
        .delete(`http://localhost:3000/auth/delete_hr/${id}`)
        .then((result) => {
          if (result.data.Status) {
            alert("HR deleted successfully");
            setHrDetails(hrDetails.filter((hr) => hr.id !== id));
          } else {
            alert("Error deleting HR");
          }
        })
        .catch((err) => console.error("Error deleting HR:", err));
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center">Manage Employee Details</h3>

      {/* Employee Section */}
      <div className="employee-section">
        <h4 className="mt-4">Employee List</h4>
        <div className="d-flex justify-content-start gap-2 mb-3">
          <Link to="/SuperAddEmployee" className="btn btn-success">
            Add Employee
          </Link>
          <Link to="/SuperSignup" className="btn btn-primary">
            SignUp Employee
          </Link>
        </div>

        {/* Employee Table */}
        {employees.length === 0 ? (
          <p>No employees available.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Designation</th>
                <th>Manager</th>
                <th>Joining Date</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={employee.id}>
                  <td>{index + 1}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.address}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.designation}</td>
                  <td>{employee.manager}</td>
                  <td>{employee.joiningDate}</td>
                  <td>{employee.salary}</td>
                  <td>
                    <Link
                      to={`/dashboard/edit_employee/${employee.id}`}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* HR Section */}
      <div className="hr-section mt-4">
        <h4>HR List</h4>
        <div className="d-flex justify-content-start gap-2 mb-3">
          <Link to="/add_HR" className="btn btn-success">
            Add HR
          </Link>
          <Link to="/SignupHR" className="btn btn-primary">
            SignUp HR
          </Link>
        </div>

        {/* HR Table */}
        {hrDetails.length === 0 ? (
          <p>No HR details available.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Salary</th>
                <th>DOB</th>
                <th>Joining Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hrDetails.map((hr, index) => (
                <tr key={hr.id}>
                  <td>{index + 1}</td>
                  <td>{hr.name}</td>
                  <td>{hr.email}</td>
                  <td>{hr.phone}</td>
                  <td>{hr.salary}</td>
                  <td>{hr.dob}</td>
                  <td>{hr.joiningDate}</td>
                  <td>
                    <Link
                      to={`/dashboard/edit_hr/${hr.id}`}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteHR(hr.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageEmployeeDetails;
