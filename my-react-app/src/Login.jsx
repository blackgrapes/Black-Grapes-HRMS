import React, { useState } from "react";
import "./Login.css"; // Import the CSS file
import Signup from "./Signup"; // Import the Signup component
import ForgotPassword from "./ForgotPassword"; // Import the ForgotPassword component
import { useNavigate } from "react-router-dom"; // Import useNavigate for page redirection

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false); // State to toggle between Login and Signup
  const [isForgotPassword, setIsForgotPassword] = useState(false); // State to toggle between Login and ForgotPassword
  const [isLoginFailed, setIsLoginFailed] = useState(false); // State to track login failure
  const navigate = useNavigate(); // Use navigate hook for redirection

  const correctPassword = "password123"; // Simulated correct password

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setError("Please fill in both fields.");
      setIsLoginFailed(false);
    } else if (password === correctPassword) {
      setError("");
      setIsLoginFailed(false);
      // Redirect to home page upon successful login
      navigate("/home");
    } else {
      setError("Incorrect password. Please try again.");
      setIsLoginFailed(true);
    }
  };

  const toggleForm = () => {
    setIsSignup(!isSignup); // Toggle between Login and Signup
    setIsForgotPassword(false); // Reset forgot password form when switching
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword); // Toggle between Login and ForgotPassword
    setIsSignup(false); // Reset signup form when switching
  };

  return (
    <div className="login-container">
      {isForgotPassword ? (
        <ForgotPassword /> // Show ForgotPassword component if isForgotPassword is true
      ) : isSignup ? (
        <Signup /> // Show Signup component if isSignup is true
      ) : (
        <>
          <h2>Login</h2>
          <form onSubmit={handleLogin} className="login-form">
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-button">
              Login
            </button>
            {isLoginFailed && (
              <div className="retry-options">
                <button
                  type="button"
                  className="retry-button"
                  onClick={() => setIsLoginFailed(false)} // Reset the error message on retry
                >
                  Retry
                </button>
                <button
                  type="button"
                  className="forgot-password-button"
                  onClick={toggleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>
            )}
            <button
              type="button"
              className="toggle-form-button"
              onClick={toggleForm}
            >
              Don't have an account? Signup
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;
