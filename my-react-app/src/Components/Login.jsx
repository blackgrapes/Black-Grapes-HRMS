import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import logo from "./assets/logo.png";


const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3000/auth/adminlogin", values)
      .then((result) => {
        if (result.data.loginStatus) {
          localStorage.setItem("valid", true);
          navigate("/dashboard");
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="loginContainer d-flex">
        {/* Left Section */}
        <div className="logo-section d-flex flex-column align-items-center justify-content-center">
          <img
            src="./public/asset/logo.png"
            // Replace with the actual path to your logo
            alt="Black Grapes Softech Logo"
            className="logo"
          />
          <h1 className="company-name">BLACK GRAPES SOFTECH</h1>
        </div>

        {/* Right Section */}
        <div className="p-3 rounded loginForm">
          <div className="text-warning">{error && error}</div>
          <h2>LOGIN</h2>
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
              />
            </div>
            <button className="btn btn-success w-100 rounded-0 mb-2">
              Log in
            </button>
            <div className="mb-1">
              <input type="checkbox" name="tick" id="tick" className="me-2" />
              <label htmlFor="password">
                You are Agree with terms & conditions
              </label>
            </div>
            <div className="signup-link">
              Don’t have an account? <a href="/signup">SIGNUP</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
