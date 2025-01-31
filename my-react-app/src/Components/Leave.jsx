import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "./Leave.css";

const Leave = () => {
  const [leaveType, setLeaveType] = useState("");
  const [leaveDays, setLeaveDays] = useState(0);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveStartDate, setLeaveStartDate] = useState("");
  const [leaveEndDate, setLeaveEndDate] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  // Automatically update the end date when leave days or start date changes
  useEffect(() => {
    if (leaveStartDate && leaveDays > 0) {
      const startDateObj = new Date(leaveStartDate);
      startDateObj.setDate(startDateObj.getDate() + (leaveDays - 1));
      setLeaveEndDate(startDateObj.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    }
  }, [leaveStartDate, leaveDays]);

  // Fetch leave requests for the employee
  const fetchLeaveRequests = async () => {
    if (!email) return; // Ensure email is present
    try {
      const response = await axios.get(`http://localhost:3000/employeeLeave/leave-request/${email}`);
      setLeaveRequests(response.data.leaveRequests || []);
    } catch (err) {
      console.error("Failed to fetch leave requests:", err);
      setError("Failed to fetch leave requests.");
    }
  };

  // Fetch leave requests when email changes
  useEffect(() => {
    fetchLeaveRequests();
  }, [email]);

  // Handle leave request submission
  const handleSubmitRequest = async () => {
    if (!leaveStartDate || leaveDays <= 0 || !leaveType || !leaveReason) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const body = {
      email,
      days: leaveDays,
      type: leaveType,
      reason: leaveReason,
      startDate: leaveStartDate,
      endDate: leaveEndDate,
    };

    try {
      await axios.post("http://localhost:3000/employeeLeave/leave-request", body);
      setLeaveType("");
      setLeaveDays(0);
      setLeaveReason("");
      setLeaveStartDate("");
      setLeaveEndDate("");
      fetchLeaveRequests(); // Refresh leave requests after submission
    } catch (err) {
      console.error("Failed to submit leave request:", err);
      setError("Failed to submit leave request.");
    }
  };

  return (
    <div className="leave-management-container">
      <h2>Leave Management</h2>

      {error && <div className="error">{error}</div>}

      <div className="leave-form">
        <h3>Request Leave</h3>
        <label>
          Leave Type:
          <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
            <option value="">Select</option>
            <option value="Sick">Sick Leave</option>
            <option value="Vacation">Vacation Leave</option>
            <option value="Casual">Casual Leave</option>
          </select>
        </label>
        <label>
          Start Date:
          <input
            type="date"
            value={leaveStartDate}
            onChange={(e) => setLeaveStartDate(e.target.value)}
          />
        </label>
        <label>
          Number of Days:
          <input
            type="number"
            value={leaveDays}
            onChange={(e) => setLeaveDays(Number(e.target.value))}
            min="1"
            max="30"
            disabled={!leaveStartDate} // Prevents selecting days without a start date
          />
        </label>
        <label>
          End Date:
          <input type="date" value={leaveEndDate} readOnly /> {/* Now auto-calculated */}
        </label>
        <label>
          Reason:
          <textarea value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} />
        </label>
        <button onClick={handleSubmitRequest}>Submit Leave Request</button>
      </div>

      <div className="leave-requests">
        <h3>Your Leave Requests</h3>
        {leaveRequests.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request._id}>
                  <td>{request.type}</td>
                  <td>{request.days}</td>
                  <td>{request.reason}</td>
                  <td>{new Date(request.startDate).toLocaleDateString()}</td>
                  <td>{new Date(request.endDate).toLocaleDateString()}</td>
                  <td>{request.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leave;
