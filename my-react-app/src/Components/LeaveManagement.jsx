import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leave.css';

const LeaveManagement = () => {
  const [leaveType, setLeaveType] = useState('');
  const [leaveDays, setLeaveDays] = useState(0);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get('/employeeLeave/leave-requests');
        console.log(response.data); // Debug API response
        setLeaveRequests(response.data.leaveRequests || []);
        setLeaveBalance(response.data.leaveBalance ?? 15);
      } catch (err) {
        setError('Failed to fetch leave data.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, []);

  const handleSubmitRequest = async () => {
    if (!leaveType || leaveDays <= 0 || !leaveReason) {
      alert('Please fill in all fields.');
      return;
    }

    if (leaveDays > leaveBalance) {
      alert('Invalid leave request or insufficient balance.');
      return;
    }

    const newRequest = {
      type: leaveType,
      days: leaveDays,
      reason: leaveReason,
    };

    try {
      setError(null); // Clear previous error
      const response = await axios.post('/employeeLeave/leave-requests', newRequest);
      setLeaveRequests([
        ...leaveRequests,
        { ...newRequest, id: response.data.leaveRequestId, status: 'Pending' },
      ]);
      setLeaveBalance((prevBalance) => prevBalance - leaveDays);
      setLeaveType('');
      setLeaveDays(0);
      setLeaveReason('');
    } catch (err) {
      setError('Failed to submit leave request.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

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

      <div className="leave-requests">
        <h3>Your Leave Requests</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.type}</td>
                <td>{request.days}</td>
                <td>{request.reason}</td>
                <td>{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveManagement;
