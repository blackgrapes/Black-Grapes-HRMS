import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Superleavemanagement.css';

const Superleavemanagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  // Fetch leave requests from the backend
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get(`${process.env.VITE_API_URL}/hrleave/hr-leave-requests`); // Update with your backend URL
        setLeaveRequests(response.data.leaveRequests);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      }
    };
    
    fetchLeaveRequests();
  }, []);

  // Handle leave request approval or rejection
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${process.env.VITE_API_URL}/hrleave/hr-leave-requests/${id}`, { decision: newStatus });
      setLeaveRequests((prevRequests) =>
        prevRequests.map((leave) =>
          leave._id === id ? { ...leave, status: newStatus } : leave
        )
      );
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  return (
    <div className="leave-container">
      <h1>HR Leave Management System</h1>
      
      {/* Leave Requests Table */}
      <table className="leave-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Leave Type</th>
            <th>Days</th>
            <th>Reason</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((request) => (
            <tr key={request._id}>
              <td>{request.email}</td>
              <td>{request.employeeDetails?.name || 'N/A'}</td>
              <td>{request.type}</td>
              <td>{request.days}</td>
              <td>{request.reason}</td>
              <td>{request.startDate}</td>
              <td>{request.endDate}</td>
              <td>{request.status}</td>
              <td>
                {request.status === 'Pending' ? (
                  <>
                    <button onClick={() => handleStatusChange(request._id, 'Approved')}>Approve</button>
                    <button onClick={() => handleStatusChange(request._id, 'Rejected')}>Reject</button>
                  </>
                ) : (
                  <span>Completed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Superleavemanagement;
