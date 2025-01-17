import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeDetail = () => {
    const [employee, setEmployee] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Simulating API response with hardcoded data
        const hardcodedEmployee = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            salary: 50000,
            image: 'default.png', // Ensure this image exists in your server or replace with a valid URL
        };

        // Set hardcoded data instead of making an API call
        setEmployee(hardcodedEmployee);
    }, []);

    const handleLogout = () => {
        // Simulate logout functionality
        localStorage.removeItem("valid");
        navigate('/');
    };

    return (
        <div>
            <div className="p-2 d-flex justify-content-center shadow">
                <h4>Employee Management System</h4>
            </div>
            <div className="d-flex justify-content-center flex-column align-items-center mt-3">
                <img
                    src={`http://localhost:3000/Images/${employee.image}`}
                    className="emp_det_image"
                    alt="Employee"
                />
                <div className="d-flex align-items-center flex-column mt-5">
                    <h3>Name: {employee.name}</h3>
                    <h3>Email: {employee.email}</h3>
                    <h3>Salary: ${employee.salary}</h3>
                </div>
                <div>
                    <button className="btn btn-primary me-2">Edit</button>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetail;
