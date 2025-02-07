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
  const [leaveBalance, setLeaveBalance] = useState(0); 
  const [loading, setLoading] = useState(false); 
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  // Calculate End Date based on start date and leave days
  useEffect(() => {
    if (leaveStartDate && leaveDays > 0) {
      const startDateObj = new Date(leaveStartDate);
      startDateObj.setDate(startDateObj.getDate() + (leaveDays - 1));
      setLeaveEndDate(startDateObj.toISOString().split("T")[0]);
    } else {
      setLeaveEndDate(""); 
    }
  }, [leaveStartDate, leaveDays]);

  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    if (!email) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/employeeLeave/leave-request/${email}`
      );
      setLeaveRequests(response.data.leaveRequests || []);
    } catch (err) {
      console.error("Failed to fetch leave requests:", err);
    }
  };

  // Fetch leave balance
  const fetchLeaveBalance = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/employeeLeave/leave-balance/${email}`
      );
      setLeaveBalance(response.data.paidLeavesRemaining || 0);
    } catch (err) {
      console.error("Failed to fetch leave balance:", err);
    }
  };

  // Initial fetch for leave data
  useEffect(() => {
    if (email) {
      fetchLeaveRequests();
      fetchLeaveBalance();
    }
  }, [email]);

  // ✅ Check for overlapping leave dates
  const isDateOverlapping = (startDate, endDate) => {
    return leaveRequests.some((request) => {
      const requestStart = new Date(request.startDate);
      const requestEnd = new Date(request.endDate);
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);

      return (
        (newStart >= requestStart && newStart <= requestEnd) ||
        (newEnd >= requestStart && newEnd <= requestEnd) ||
        (newStart <= requestStart && newEnd >= requestEnd)
      );
    });
  };

  // 📝 Handle Leave Request Submission
  const handleSubmitRequest = async () => {
    setLoading(true); 

    if (!leaveStartDate || leaveDays <= 0 || !leaveType || !leaveReason) {
      alert("Please fill in all fields correctly.");
      setLoading(false);
      return;
    }

    // ❗ Check for overlapping leave dates
    if (isDateOverlapping(leaveStartDate, leaveEndDate)) {
      alert("Leave has already been applied for the selected dates.");
      clearForm(); 
      setLoading(false);
      return;
    }

    // Check for expired leave balance
    if (leaveBalance <= 0) {
      const proceed = window.confirm(
        "Your leave balance has expired. Do you still want to submit this leave request?"
      );
      if (!proceed) {
        setLoading(false);
        return;
      }
    }

    const body = {
      email,
      days: leaveDays,
      type: leaveType,
      reason: leaveReason,
      startDate: leaveStartDate,
    };

    try {
      await axios.post("http://localhost:3000/employeeLeave/leave-request", body);
      clearForm();

      alert("Leave request submitted successfully.");

      await Promise.all([fetchLeaveRequests(), fetchLeaveBalance()]);
    } catch (err) {
      console.error("Failed to submit leave request:", err);
      alert("Failed to submit leave request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Clear the leave form
  const clearForm = () => {
    setLeaveType("");
    setLeaveDays(0);
    setLeaveReason("");
    setLeaveStartDate("");
    setLeaveEndDate("");
  };

  return (
    <div className="leave-management-container">
      <h2>Leave Management System</h2>

      <div className="leave-balance">
        <h3>Leave Balance</h3>
        <p>
          Paid Leaves Remaining:{" "}
          <strong>{leaveBalance}</strong> {leaveBalance === 1 ? "day" : "days"}
        </p>
      </div>

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
          />
        </label>

        <label>
          End Date:
          <input type="date" value={leaveEndDate} readOnly />
        </label>

        <label>
          Reason:
          <textarea
            value={leaveReason}
            onChange={(e) => setLeaveReason(e.target.value)}
          />
        </label>

        <button onClick={handleSubmitRequest} disabled={loading}>
          {loading ? "Submitting..." : "Submit Leave Request"}
        </button>
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
                <th>Paid Days</th>
                <th>Unpaid Days</th>
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
                  <td>{request.paidLeave}</td>
                  <td>{request.unpaidLeave}</td>
                  <td>{request.reason}</td>
                  <td>{new Date(request.startDate).toLocaleDateString()}</td>
                  <td>{new Date(request.endDate).toLocaleDateString()}</td>
                  <td
                    className={`status ${
                      request.status === "Approved"
                        ? "status-approved"
                        : request.status === "Rejected"
                        ? "status-rejected"
                        : "status-pending"
                    }`}
                  >
                    {request.status}
                  </td>
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
