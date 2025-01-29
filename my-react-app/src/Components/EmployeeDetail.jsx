import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './EmployeeDetail.css';

const EmployeeDetail = ({email}) => {
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
//   const [searchParams] = useSearchParams(); // Access query parameters

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
    //   const id = searchParams.get('id'); // Get "id" from query parameters
    //   const email = searchParams.get('email'); // Get "email" from query parameters

      if (!email) {
        setError('Email is required to fetch employee details.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/employeedetail/employee', {
          params: { email }, // Pass query parameters
        });

        console.log(response)
        if (response.data && response.data.Result) {
          setEmployee(response.data.Result);
        } else {
          setError(response.data.Error || 'Failed to fetch employee details.');
        }
      } catch (err) {
        console.error('Error fetching employee details:', err);
        setError('An error occurred while fetching employee details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [email]);

  const handleLogout = () => {
    localStorage.removeItem('valid');
    navigate('/'); // Redirect to homepage after logout
  };

  const handleEdit = () => {
    console.log("email", email)
    navigate(`/employee/edit_employee?email=${email}`); // Navigate to edit page with employee ID
  };

  const handleLeave = () => {
    navigate(`/employee/Leave?email=${email}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="employee-detail-container">
      <header className="header">
        <h4>Employee Management System</h4>
      </header>
      <div className="employee-card">
        <div className="employee-image-container">
          <img
            src={`http://localhost:3000/Images/${employee.image || 'default.png'}`}
            className="employee-image"
            alt="Employee"
          />
        </div>
        <div className="employee-details">
          <div className="employee-info">
            <div className="employee-labels">
              <h3>Name:</h3>
              <h3>Email:</h3>
              <h3>Employee ID:</h3>
              <h3>Salary:</h3>
              <h3>Department:</h3>
              <h3>Role:</h3>
              <h3>Manager:</h3>
              <h3>Contact:</h3>
              <h3>Address:</h3>
              <h3>Date of Birth:</h3>
              <h3>Joining Date:</h3>
              <h3>Performance Rating:</h3>
            </div>
            <div className="employee-values">
              <h3>{employee.name || "-"}</h3>
              <h3>{employee.email|| "-"}</h3>
              <h3>{employee._id || "-"}</h3>
              <h3>${employee.salary || "-"}</h3>
              <h3>{employee.department || "-"}</h3>
              <h3>{employee.role || "-"}</h3>
              <h3>{employee.manager || "-"}</h3>
              <h3>{employee.phone || "-"}</h3>
              <h3>{employee.address || "-"}</h3>
              <h3>{employee.dob || "-"}</h3>
              <h3>{employee.joiningDate || "-"}</h3>
              <h3>{employee.performanceRating || "-"}</h3>
            </div>
          </div>
          <div className="employee-actions">
            <button className="btn btn-primary" onClick={handleEdit}>
              Edit
            </button>
            <button className="btn btn-warning" onClick={handleLeave}>
              Apply for Leave
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
