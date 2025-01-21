import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeDetail.css'; // Import the separate CSS file

const EmployeeDetail = () => {
    const [employee, setEmployee] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Simulating API response with hardcoded data
        const hardcodedEmployee = {
            name: 'Sourabh Pandey',
            email: 'sourabh@example.com',
            id: '56412436851',
            salary: 5,
            image: 'default.png', // Replace with a valid image URL or path
            department: 'Engineering',
            contact: '123-456-7890',
            address: '123 Main St, Springfield',
            dob: '1990-08-15', // Date of Birth
            joinDate: '2015-06-01', // Joining Date
            manager: 'Shrivanshu', // Manager's Name
            role: 'Software Engineer', // Employee's Role
            skills: ['JavaScript', 'React', 'Node.js'], // Skills
            performanceRating: 'Kamchor',
        };

        setEmployee(hardcodedEmployee);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('valid');
        navigate('/'); // Redirect to homepage after logout
    };

    const handleEdit = () => {
        // Navigate to the edit page
        navigate('/employee/edit_employee/'); // Assuming the edit page URL uses employee ID for editing
    };

    const handleLeave = () => {
        navigate('/employee/Leave');
       
    };

    return (
        <div className="employee-detail-container">
            <header className="header">
                <h4>Employee Management System</h4>
            </header>
            <div className="employee-card">
                <div className="employee-image-container">
                    <img
                        src={`http://localhost:3000/Images/${employee.image}`}
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
                            <h3>{employee.name}</h3>
                            <h3>{employee.email}</h3>
                            <h3>{employee.id}</h3>
                            <h3>${employee.salary}</h3>
                            <h3>{employee.department}</h3>
                            <h3>{employee.role}</h3>
                            <h3>{employee.manager}</h3>
                            <h3>{employee.contact}</h3>
                            <h3>{employee.address}</h3>
                            <h3>{employee.dob}</h3>
                            <h3>{employee.joinDate}</h3>
                            <h3>{employee.performanceRating}</h3>
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
