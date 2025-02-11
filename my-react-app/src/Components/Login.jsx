import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0); // Track incorrect attempts
  const [isLocked, setIsLocked] = useState(false); // Lockout state
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isLocked) {
      setError("Too many incorrect attempts. Please try again later.");
      return;
    }

    axios
      .post("https://black-grapes-hrms-api.vercel.app/adminlogin", values)
      .then((result) => {
        if (result.data.loginStatus) {
          localStorage.setItem("valid", true);
          localStorage.setItem("email", values.email); // Store email in localStorage
          navigate("/dashboard"); // Redirect to the profile page
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
      .catch((err) => {
        console.error("Login error:", err);
        setError("Incorrect ID or Password. Please try again.");
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="loginContainer d-flex">
        {/* Left Section */}
        <div className="logo-section d-flex flex-column align-items-center justify-content-center">
          <img
            src="./src/assets/logo.png" // Replace with the actual path to your logo
            alt="Black Grapes Softech Logo"
            className="logo"
          />
          <h1 className="company-name">BLACK GRAPES SOFTECH</h1>
        </div>

        {/* Right Section */}
        <div className="p-3 rounded loginForm">
          {error && <div className="text-warning mb-3">{error}</div>}
          <h2>HR LOGIN</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email">
                <strong>Email:</strong>
              </label>
              <input
                type="email"
                name="email"
                autoComplete="off"
                placeholder="Enter Email"
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                className="form-control rounded-0"
                disabled={isLocked} // Disable input if locked
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password">
                <strong>Password:</strong>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
                className="form-control rounded-0"
                disabled={isLocked} // Disable input if locked
              />
            </div>
            <button
              className="btn btn-success w-100 rounded-0 mb-2"
              disabled={isLocked} // Disable button if locked
            >
              Log in
            </button>

            {/* Forgot Password Button */}
            <button
              type="button"
              className="btn btn-link w-100 text-decoration-none"
              onClick={() => navigate("/Adminforgot")}
            >
              Forgot Password?
            </button>
          </form>

          {attempts > 0 && !isLocked && (
            <div className="text-danger mt-2">
              Incorrect attempts: {attempts}/3
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
