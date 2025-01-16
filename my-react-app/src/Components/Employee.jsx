import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AddEmployee.css";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [deleting, setDeleting] = useState(false);

  // Fetch employee data on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployees(result.data.Result);
        } else {
          alert(result.data.Error || "Failed to fetch employees.");
        }
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
        alert("An error occurred while fetching employee data.");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setDeleting(true);
      axios
        .delete(`http://localhost:3000/auth/delete_employee/${id}`)
        .then((result) => {
          if (result.data.Status) {
            fetchEmployees(); // Refresh employee list after deletion
          } else {
            alert(result.data.Error || "Failed to delete employee.");
          }
        })
        .catch((err) => {
          console.error("Error deleting employee:", err);
          alert("An error occurred while deleting the employee.");
        })
        .finally(() => {
          setDeleting(false);
        });
    }
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>
      <Link to="/dashboard/add_employee" className="btn btn-success mb-3">
        Add Employee
      </Link>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>
                    <img
                      src={
                        employee.image
                          ? `http://localhost:3000/Images/${employee.image}`
                          : "http://via.placeholder.com/50"
                      }
                      alt="Employee"
                      className="employee_image"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                  </td>
                  <td>{employee.email}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.address}</td>
                  <td>{employee.designation}</td>
                  <td>{employee.salary}</td>
                  <td>
                    <Link
                      to={`/dashboard/edit_employee/${employee.id}`}
                      className="btn btn-info btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(employee.id)}
                      disabled={deleting}
                      style={{ cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  <p>No employees found.</p>
                  <Link to="/dashboard/add_employee" className="btn btn-success">
                    Add Your First Employee
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
