import React, { useState } from 'react';
import './Leave.css';

const LeaveManagement = () => {
  const [leaveType, setLeaveType] = useState('');
  const [leaveDays, setLeaveDays] = useState(0);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(15); // Assuming an initial balance of 15 days

  const handleSubmitRequest = () => {
    if (leaveDays <= leaveBalance && leaveDays > 0) {
      const newRequest = {
        id: leaveRequests.length + 1,
        type: leaveType,
        days: leaveDays,
        reason: leaveReason,
        status: 'Pending',
      };
      setLeaveRequests([...leaveRequests, newRequest]);
      setLeaveBalance(leaveBalance - leaveDays);
      setLeaveType('');
      setLeaveDays(0);
      setLeaveReason('');
    } else {
      alert('Invalid leave request or insufficient balance');
    }
  };

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
          <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
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
        <button onClick={handleSubmitRequest}>Submit Leave Request</button>
      </div>

    </div>
  );
};

export default LeaveManagement;
