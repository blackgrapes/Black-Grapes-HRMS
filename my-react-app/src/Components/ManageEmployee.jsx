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
      .get("http://localhost:3000/hrdetail/all")
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
        .delete(`http://localhost:3000/employeedetail/delete_employee/${id}`)
        .then((result) => {
          if (result.status === 200) {
            alert("Employee deleted successfully");
            setEmployees(employees.filter((emp) => emp._id !== id));
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

  const filteredEmployees = employees.filter((employee) =>
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHrDetails = hrDetails.filter((hr) =>
    hr.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center">Manage Employee Details</h3>

      {/* Back Button */}
      <div className="d-flex justify-content-start mb-3">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {/* Search Bar */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search employees or HR"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Employee Section */}
      <div className="employee-section" id="employee-section">
        <h4 className="mt-4">Employee List</h4>
        <div className="d-flex justify-content-start gap-2 mb-3">
          <Link to="/SuperAddEmployee" className="btn btn-success">
            Add Employee
          </Link>
          <Link to="/SuperSignupEmployee" className="btn btn-primary">
            SignUp Employee
          </Link>
        </div>

        {/* Employee Table */}
        {filteredEmployees.length === 0 ? (
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
                <th>Manager</th>
                <th>Company</th>
                <th>Department</th>
                <th>Role</th>
                <th>DELETE</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr key={employee._id}>
                  <td>{index + 1}</td>
                  <td>{employee.name || "N/A"}</td>
                  <td>{employee.email || "N/A"}</td>
                  <td>{employee.address || "N/A"}</td>
                  <td>{employee.phone || "N/A"}</td>
                  <td>{employee.manager || "N/A"}</td>
                  <td>{employee.company || "N/A"}</td>
                  <td>{employee.department || "N/A"}</td>
                  <td>{employee.role || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteEmployee(employee._id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* HR Section */}
      <div className="hr-section mt-4" id="hr-section">
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
        {filteredHrDetails.length === 0 ? (
          <p>No HR details available.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>DOB</th>
                <th>Joining Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHrDetails.map((hr, index) => (
                <tr key={hr.id}>
                  <td>{index + 1}</td>
                  <td>{hr.name}</td>
                  <td>{hr.email}</td>
                  <td>{hr.phone}</td>
                  <td>{hr.dob}</td>
                  <td>{hr.joiningDate}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteHR(hr.id)}
                    >
                      🗑️
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
