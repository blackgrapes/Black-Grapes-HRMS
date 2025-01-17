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
            salary: 500000,
            image: 'default.png', // Replace with a valid image URL or path
            department: 'Engineering',
            contact: '123-456-7890',
            address: '123 Main St, Springfield, USA',
            dob: '1990-08-15', // Date of Birth
            joinDate: '2015-06-01', // Joining Date
            manager: 'Shrivanshu', // Manager's Name
            role: 'Software Engineer', // Employee's Role
            skills: ['JavaScript', 'React', 'Node.js'], // Skills
            performanceRating : 'Kamchor'
            
        };

        setEmployee(hardcodedEmployee);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('valid');
        navigate('/');
    };

    const handleEdit = () => {
        alert('Edit functionality is under development.');
    };

    const handleLeave = () => {
        // You can implement leave functionality here. For now, we will just show an alert.
        const leaveRequest = prompt('Please enter the reason for your leave request:');
        
        if (leaveRequest) {
            alert(`Leave request submitted: ${leaveRequest}`);
            // You can add logic to update the employee state or call an API to submit the leave request.
        } else {
            alert('Leave request cancelled.');
        }
    };

    return (
        <div className="employee-detail-container">
            <header className="header">
                <h4>Employee Management System</h4>
            </header>
            <div className="employee-card">
                <img
                    src={`http://localhost:3000/Images/${employee.image}`}
                    className="employee-image"
                    alt="Employee"
                />
                <div className="employee-info">
                    <h3>Name: {employee.name}</h3>
                    <h3>Email: {employee.email}</h3>
                    <h3>Employee ID: {employee.id}</h3>
                    <h3>Salary: ${employee.salary}</h3>
                    <h3>Department: {employee.department}</h3>
                    <h3>Role: {employee.role}</h3>
                    <h3>Manager: {employee.manager}</h3>
                    <h3>Contact: {employee.contact}</h3>
                    <h3>Address: {employee.address}</h3>
                    <h3>Date of Birth: {employee.dob}</h3>
                    <h3>Joining Date: {employee.joinDate}</h3>
                    <h3>Performance Rating: {employee.performanceRating}</h3>
                    
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
    );
};

export default EmployeeDetail;
