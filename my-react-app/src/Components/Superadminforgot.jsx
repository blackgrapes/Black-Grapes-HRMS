import axios from "axios";
import React, { useState } from "react";
import './Superadminforgot.css'; // Import the CSS file for styling

const Superadminforgot = () => {
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState(""); // For Date of Birth
  const [newPassword, setNewPassword] = useState(""); // For New Password
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // For success messages
  const [step, setStep] = useState(1); // To track the steps of the process (1 - email + dob, 2 - new password)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      // Step 1: Check if email and DOB match
      try {
        const response = await axios.post("http://localhost:3000/superadmin/forgotpassword", { email, dob });

        if (response.data.Status) {
          setStep(2); // If email and DOB match, move to the next step (new password input)
        } else {
          setError("No matching record found. Please check your email and DOB.");
        }
      } catch (err) {
        setError("An error occurred. Please try again later.");
      }
    } else if (step === 2) {
      // Step 2: Change the password
      try {
        const response = await axios.post("http://localhost:3000/superadmin/resetpassword", { email, newPassword });

        if (response.data.Status) {
          setMessage("Your password has been successfully updated!");
        } else {
          setError("Failed to update the password. Please try again.");
        }
      } catch (err) {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Super Admin - Forgot Password</h2>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Date of Birth:</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-submit">
              Verify
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-group">
              <label>New Password:</label>
              <input
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-submit">
              Reset Password
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Superadminforgot;
