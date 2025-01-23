import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ManageEmployee.css'; // Import CSS

const ManageEmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [hrDetails, setHrDetails] = useState([]);

  useEffect(() => {
    // Fetch employee and HR details
    axios
      .get('http://localhost:3000/auth/employees')
      .then((result) => {
        const employeeData = result.data.employees;
        const hrData = result.data.hr;
        setEmployees(employeeData);
        setHrDetails(hrData);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      axios
        .delete(`http://localhost:3000/auth/delete_employee/${id}`)
        .then((result) => {
          if (result.data.Status) {
            alert('Employee deleted successfully');
            setEmployees(employees.filter((emp) => emp.id !== id));
          } else {
            alert('Error deleting employee');
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center">Manage Employee Details</h3>

      {/* Employee Section */}
      <div className="employee-section">
        <h4 className="mt-4">Employee List</h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Designation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={employee.id}>
                <td>{index + 1}</td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.designation}</td>
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
      </div>

      {/* HR Section */}
      <div className="hr-section">
        <h4 className="mt-4">HR Details</h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Designation</th>
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
                <td>{hr.designation}</td>
                <td>
                  <Link
                    to={`/dashboard/edit_hr/${hr.id}`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteEmployee(hr.id)} // Assuming HR can also be deleted this way
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

export default ManageEmployeeDetails;
