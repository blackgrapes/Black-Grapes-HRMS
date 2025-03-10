import React, { useState } from "react";
import "./HrLeave.css";

const HrLeave = () => {
  const [leaveData, setLeaveData] = useState({
    name: "",
    email: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Leave Request Submitted:", leaveData);
    alert("Leave request submitted successfully!");
    setLeaveData({ name: "", email: "", fromDate: "", toDate: "", reason: "" });
  };

  return (
    <div className="leave-container">
      <h2 className="leave-title">HR Leave Request</h2>
      
      <form className="leave-form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={leaveData.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={leaveData.email}
          onChange={handleChange}
          required
        />

        <label>Leave From:</label>
        <input
          type="date"
          name="fromDate"
          value={leaveData.fromDate}
          onChange={handleChange}
          required
        />

        <label>Leave To:</label>
        <input
          type="date"
          name="toDate"
          value={leaveData.toDate}
          onChange={handleChange}
          required
        />

        <label>Reason for Leave:</label>
        <textarea
          name="reason"
          value={leaveData.reason}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit" className="submit-btn">Submit Request</button>
      </form>
    </div>
  );
};

export default HrLeave;
