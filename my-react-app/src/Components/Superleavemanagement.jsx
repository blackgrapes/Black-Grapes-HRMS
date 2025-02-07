import React, { useState } from 'react';
import './Superleavemanagement.css';

const Superleavemanagement = () => {
  // Example employee leave data
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', type: 'Sick', days: 3, reason: 'Flu', startDate: '2025-02-10', endDate: '2025-02-13', status: 'Pending' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', type: 'Vacation', days: 5, reason: 'Family trip', startDate: '2025-03-01', endDate: '2025-03-05', status: 'Approved' }
  ]);

  // Handle leave request approval or rejection
  const handleStatusChange = (id, newStatus) => {
    const updatedData = leaveRequests.map((leave) =>
      leave.id === id ? { ...leave, status: newStatus } : leave
    );
    setLeaveRequests(updatedData);
  };

  return (
    <div className="leave-container">
      <h1>Leave Management System</h1>
      
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
            <tr key={request.id}>
              <td>{request.email}</td>
              <td>{request.name}</td>
              <td>{request.type}</td>
              <td>{request.days}</td>
              <td>{request.reason}</td>
              <td>{request.startDate}</td>
              <td>{request.endDate}</td>
              <td>{request.status}</td>
              <td>
                {request.status === 'Pending' ? (
                  <>
                    <button onClick={() => handleStatusChange(request.id, 'Approved')}>Approve</button>
                    <button onClick={() => handleStatusChange(request.id, 'Rejected')}>Reject</button>
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
