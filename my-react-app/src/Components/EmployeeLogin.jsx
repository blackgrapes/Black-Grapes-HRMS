import React, { useState } from 'react';
import './EmployeeLogin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import EmployeeDetail from './EmployeeDetail';

const EmployeeLogin = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [employeeLoggedIn, setEmployeeLoggedIn] = useState(false);
    const [error, setError] = useState(null);
    const [attempts, setAttempts] = useState(0); // Track incorrect attempts
    const [isLocked, setIsLocked] = useState(false); // Lockout state
    const navigate = useNavigate(); // Define navigate using useNavigate
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isLocked) {
            setError("Too many incorrect attempts. Please try again later.");
            return;
        }

        console.log("values", values);
        axios.post(`${process.env.VITE_API_URL}/employee/employee_login`, values)
            .then(result => {
                if (result.data.loginStatus) {
                    localStorage.setItem("valid", true);
                    setEmployeeLoggedIn(true);
                } else {
                    setError(result.data.Error);
                    setAttempts((prev) => prev + 1); // Increment incorrect attempts
                    if (attempts + 1 >= 3) {
                        setIsLocked(true); // Lock after 3 failed attempts
                        setTimeout(() => {
                            setIsLocked(false); // Unlock after 1 minute
                            setAttempts(0);
                        }, 60000); // 1 minute lockout duration
                    }
                }
            })
            .catch(err => {
                console.error(err);
                setError(err.response?.data?.message || "Incorrect ID or Password. Please try again.");
            });
    };

    const handleForgotPassword = () => {
        // Navigate to the Forgot Password page
        navigate('/employee/Employeeforgot'); // Update with the correct route
    };

    if (employeeLoggedIn) {
        return <EmployeeDetail email={values.email} />;
    }

    return (
        <div className="login-wrapper">
            <div className="login-form-container">
                <div className="logo-container">
                    <img src="./src/assets/logo.png" alt="Logo" className="logo-image" />
                </div>
                <h2 className="text-center">Employee Login</h2>
                <div className="text-warning text-center">
                    {error && error}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email"><strong>Email:</strong></label>
                        <input
                            type="email"
                            name="email"
                            autoComplete="off"
                            placeholder="Enter Email"
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                            className="form-control"
                            disabled={isLocked} // Disable input if locked
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"><strong>Password:</strong></label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                            className="form-control"
                            disabled={isLocked} // Disable input if locked
                        />
                    </div>
                    <button
                        className="btn btn-primary w-100 rounded-0 mb-2"
                        disabled={isLocked} // Disable button if locked
                        type='Submit'
                    >
                        Log in
                    </button>
                </form>

                {/* Forgot Password link */}
                <div className="forgot-password-link">
                    <button
                        className="btn btn-link"
                        type="button"
                        onClick={handleForgotPassword}
                    >
                        Forgot Password?
                    </button>
                </div>

                {attempts > 0 && !isLocked && (
                    <div className="attempts-info">
                        Incorrect attempts: {attempts}/3
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeLogin;
