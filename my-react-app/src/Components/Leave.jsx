import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Leave.css";

const Leave = () => {
  const [leaveType, setLeaveType] = useState("");
  const [leaveDays, setLeaveDays] = useState(0);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveStartDate, setLeaveStartDate] = useState("");
  const [leaveEndDate, setLeaveEndDate] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(15);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  // Handle leave request submission
  const handleSubmitRequest = async () => {
    if (leaveDays > 0 && leaveDays <= leaveBalance && leaveStartDate && leaveEndDate) {
      const body = {
        email,
        days: leaveDays,
        type: leaveType,
        reason: leaveReason,
        startDate: leaveStartDate,
        endDate: leaveEndDate,
      };
      try {
        const response = await axios.post(
          "http://localhost:3000/employeeLeave/leave-request",
          body
        );
        setLeaveBalance((prevBalance) => prevBalance - leaveDays);
        setLeaveType("");
        setLeaveDays(0);
        setLeaveReason("");
        setLeaveStartDate("");
        setLeaveEndDate("");
      } catch (err) {
        setError("Failed to submit leave request.");
        console.log(err);
      }
    } else {
      alert("Invalid leave request or insufficient balance.");
    }
  };

  if (error) return <div className="error">{error}</div>;

  // Fetch leave requests
  useEffect(() => {
    const fetchLeaveRequest = async () => {
      const response = await axios.get(
        "http://localhost:3000/employeeLeave/leave-requests"
      );
      if (response) {
        setLeaveRequests(response?.data?.leaveRequests);
      }
    };

    fetchLeaveRequest();
  }, []);

  return (
    <div className="leave-management-container">
      <h2>Leave Management</h2>
      <div className="leave-balance">
        <p>Your Leave Balance: {leaveBalance} days</p>
      </div>

      <div className="leave-form">
        <h3>Request Leave</h3>
        <label>
          Leave Type:
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Sick">Sick Leave</option>
            <option value="Vacation">Vacation Leave</option>
            <option value="Casual">Casual Leave</option>
          </select>
        </label>
        <label>
          Number of Days:
          <input
            type="number"
            value={leaveDays}
            onChange={(e) => setLeaveDays(Number(e.target.value))}
            min="1"
            max="30"
          />
        </label>
        <label>
          Reason:
          <textarea
            value={leaveReason}
            onChange={(e) => setLeaveReason(e.target.value)}
          />
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
          End Date:
          <input
            type="date"
            value={leaveEndDate}
            onChange={(e) => setLeaveEndDate(e.target.value)}
          />
        </label>
        <button onClick={handleSubmitRequest}>Submit Leave Request</button>
      </div>

      <div className="leave-requests">
        <h3>Your Leave Requests</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests?.map((request) => (
              <tr key={request.id}>
                <td>{request.type}</td>
                <td>{request.days}</td>
                <td>{request.reason}</td>
                <td>{new Date(request.startDate).toLocaleDateString()}</td> {/* Format date */}
                <td>{new Date(request.endDate).toLocaleDateString()}</td> {/* Format date */}
                <td>{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leave;
// {
//   "email": "employee@example.com",
//   "days": 5,
//   "type": "Vacation",
//   "reason": "Vacation trip",
//   "startDate": "2025-02-01",
//   "endDate": "2025-02-05"
// }
