import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LeaveManagement.css';

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get('/employeeLeave/leave-requests');
        setLeaveRequests(response.data.leaveRequests || []);
      } catch (err) {
        setError('Failed to fetch leave data.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, []);

  const handleApproveReject = async (requestId, decision) => {
    try {
      const updatedRequest = {
        status: decision,
      };

      // Update the leave request status
      const response = await axios.put(`/employeeLeave/leave-requests/${requestId}`, updatedRequest);
      
      // Update the local state with the new status
      setLeaveRequests(leaveRequests.map(request =>
        request.id === requestId
          ? { ...request, status: response.data.status }
          : request
      ));
    } catch (err) {
      setError('Failed to update leave status.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="leave-management-container">
      <h2>Leave Management - Pending Requests</h2>

      <div className="leave-requests">
        <h3></h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Days</th>
              <th>Reason</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.type}</td>
                <td>{request.days}</td>
                <td>{request.reason}</td>
                <td>{new Date(request.startDate).toLocaleDateString()}</td> {/* Format date */}
                <td>{new Date(request.endDate).toLocaleDateString()}</td>   {/* Format date */}
                <td>{request.status}</td>
                <td>
                  {request.status === 'Pending' && (
                    <>
                      <button onClick={() => handleApproveReject(request.id, 'Approved')}>
                        Approve
                      </button>
                      <button onClick={() => handleApproveReject(request.id, 'Rejected')}>
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
