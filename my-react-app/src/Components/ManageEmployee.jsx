import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./ManageEmployee.css"; // Import CSS

const ManageEmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [hrDetails, setHrDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/employeedetail/all`)
      .then((result) => setEmployees(result.data.Result || []))
      .catch((err) => console.error("Error fetching employees:", err));

    axios
      .get(`${import.meta.env.VITE_API_URL}/hrdetail/all`)
      .then((result) => setHrDetails(result.data.Result || []))
      .catch((err) => console.error("Error fetching HR details:", err));
  }, []);

  const handleDeleteEmployee = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios
        .delete(`${import.meta.env.VITE_API_URL}/employeedetail/delete_employee/${id}`)
        .then(() => {
          alert("Employee deleted successfully");
          setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        })
        .catch((err) => console.error("Error deleting employee:", err));
    }
  };

  const handleDeleteHR = (id) => {
    if (window.confirm("Are you sure you want to delete this HR?")) {
      axios
        .delete(`${import.meta.env.VITE_API_URL}/hrdetail/delete_hr/${id}`)
        .then(() => {
          alert("HR deleted successfully");
          setHrDetails((prev) => prev.filter((hr) => hr._id !== id));
        })
        .catch((err) => alert("Error deleting HR: " + err));
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center">Manage Employee Details</h3>

      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search employees or HR"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="employee-section">
        <h4>Employee List</h4>
        <div className="d-flex gap-2 mb-3">
          <Link to="/SuperAddEmployee" className="btn btn-success">Add Employee</Link>
          <Link to="/SuperSignupEmployee" className="btn btn-primary">SignUp Employee</Link>
        </div>

        {employees.length === 0 ? <p>No employees available.</p> : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr key={employee._id}>
                  <td>{index + 1}</td>
                  <td>{employee.name || "N/A"}</td>
                  <td>{employee.email || "N/A"}</td>
                  <td>{employee.phone || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteEmployee(employee._id)}
                    >🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="hr-section mt-4">
        <h4>HR List</h4>
        <div className="d-flex gap-2 mb-3">
          <Link to="/add_HR" className="btn btn-success">Add HR</Link>
          <Link to="/SignupHR" className="btn btn-primary">SignUp HR</Link>
        </div>

        {hrDetails.length === 0 ? <p>No HR details available.</p> : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hrDetails.map((hr, index) => (
                <tr key={hr._id}>
                  <td>{index + 1}</td>
                  <td>{hr.name}</td>
                  <td>{hr.email}</td>
                  <td>{hr.phone}</td>
                  <td>{hr.department || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        handleDeleteHR(hr._id);
                        alert("HR deleted successfully");
                      }}
                    >🗑️</button>
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
