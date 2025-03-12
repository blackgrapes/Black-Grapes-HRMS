import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Superleavemanagement.css';

const Superleavemanagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch all leave requests
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get(`${API_URL}/hrleave/leave-requests`);
        setLeaveRequests(response.data.leaveRequests || []);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      }
    };

    fetchLeaveRequests();
  }, []);

  // Handle leave request approval or rejection
  const handleStatusChange = async (email, newStatus) => {
    try {
      await axios.put(`${API_URL}/hrleave/hr-leave-requests/${email}`, { decision: newStatus });
      setLeaveRequests((prevRequests) =>
        prevRequests.map((leave) =>
          leave.email === email ? { ...leave, status: newStatus } : leave
        )
      );
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  return (
    <div className="leave-container">
      <h1>HR Leave Management System</h1>

      <table className="leave-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Leave Type</th>
            <th>Total Days</th>
            <th>Paid Leave</th>
            <th>Unpaid Leave</th>
            <th>Reason</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.length > 0 ? (
            leaveRequests.map((request) => (
              <tr key={request.email}>
                <td>{request.email}</td>
                <td>{request.type}</td>
                <td>{request.days}</td>
                <td>{request.paidLeave || 0}</td>
                <td>{request.unpaidLeave || 0}</td>
                <td>{request.reason}</td>
                <td>{request.startDate}</td>
                <td>{request.endDate}</td>
                <td>{request.status}</td>
                <td>
                  {request.status === 'Pending' ? (
                    <>
                      <button onClick={() => handleStatusChange(request.email, 'Approved')}>Approve</button>
                      <button onClick={() => handleStatusChange(request.email, 'Rejected')}>Reject</button>
                    </>
                  ) : (
                    <span>{request.status}</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No leave requests found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Superleavemanagement;
