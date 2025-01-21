import React, { useState } from 'react';
import './LeaveManagement.css';

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, type: 'Sick', days: 3, reason: 'Flu', status: 'Pending' },
    { id: 2, type: 'Vacation', days: 5, reason: 'Family trip', status: 'Approved' },
    { id: 3, type: 'Casual', days: 2, reason: 'Personal', status: 'Rejected' }
  ]);

  const handleApproveRequest = (id) => {
    const updatedRequests = leaveRequests.map((request) =>
      request.id === id ? { ...request, status: 'Approved' } : request
    );
    setLeaveRequests(updatedRequests);
  };

  const handleRejectRequest = (id) => {
    const updatedRequests = leaveRequests.map((request) =>
      request.id === id ? { ...request, status: 'Rejected' } : request
    );
    setLeaveRequests(updatedRequests);
  };

  return (
    <div className="leave-management-container">
      <h2></h2>

      <div className="leave-requests">
        <h3>Leave Requests</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
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
                <td>
                  {request.status === 'Pending' && (
                    <>
                      <button onClick={() => handleApproveRequest(request.id)}>
                        Approve
                      </button>
                      <button onClick={() => handleRejectRequest(request.id)}>
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveManagement;
