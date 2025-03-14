import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeDetail.css';
import gudda from "/src/assets/gudda.svg"; // ✅ Import gudda.svg

const EmployeeDetail = ({ email }) => {
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payroll, setPayroll] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!email) {
        setError('Email is required to fetch employee details.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.VITE_API_URL}/employeedetail/employee`, {
          params: { email },
        });

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

    const fetchPayrollData = async () => {
      const response = await axios.get(`${process.env.VITE_API_URL}/Payroll/payroll/${email}`);
      setPayroll(response?.data?.payrollData ?? {});
    };

    fetchEmployeeDetails();
    fetchPayrollData();
  }, [email]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out? You will need to log in again.");
    if (confirmLogout) {
      localStorage.removeItem('valid');
      alert("You have been logged out. Please log in again.");
      navigate('/');
    }
  };

  const handleEdit = () => {
    const confirmEdit = window.confirm("Are you sure you want to edit the details? YOU HAVE TO RE-LOGIN.");
    if (confirmEdit) {
      navigate(`/employee/edit_employee?email=${email}`);
    }
  };

  const handleLeave = () => {
    const confirmLeave = window.confirm("Apply For Leave Before The Day? YOU HAVE TO RE-LOGIN.");
    if (confirmLeave) {
      navigate(`/employee/Leave?email=${email}`);
    }
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
            src={employee.image ? `${process.env.VITE_API_URL}/Images/${employee.image}` : gudda} // ✅ Gudda used as default
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
              <h3>Manager:</h3>
              <h3>Contact:</h3>
              <h3>Address:</h3>
              <h3>Date of Birth:</h3>
              <h3>Joining Date:</h3>
            </div>
            <div className="employee-values">
              <h3>{employee.name || "-"}</h3>
              <h3>{employee.email || "-"}</h3>
              <h3>{employee._id || "-"}</h3>
              <h3>Rs.{payroll?.totalSalary || "-"}</h3>
              <h3>{employee.department || "-"}</h3>
              <h3>{employee.manager || "-"}</h3>
              <h3>{employee.phone || "-"}</h3>
              <h3>{employee.address || "-"}</h3>
              <h3>{employee.dob || "-"}</h3>
              <h3>{employee.joiningDate || "-"}</h3>
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
