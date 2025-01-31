import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LeaveManagement.css";

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/employeeLeave/leave-requests"); // Ensure correct API URL
        setLeaveRequests(response.data.leaveRequests || []);
      } catch (err) {
        setError("Failed to fetch leave data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, []);

  const handleApproveReject = async (requestId, decision) => {
    try {
      await axios.put(`http://localhost:5000/leave-requests/${requestId}/${decision.toLowerCase()}`);

      // Update state after approval/rejection
      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, status: decision } : request
        )
      );
    } catch (err) {
      setError("Failed to update leave status.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="leave-management-container">
      <h2>Leave Management - Pending Requests</h2>

      <div className="leave-requests">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request) => (
              <tr key={request._id}>
                <td>{request._id}</td>
                <td>{request.type}</td>
                <td>{request.days}</td>
                <td>{request.reason}</td>
                <td>{request.status}</td>
                <td>
                  {request.status === "Pending" && (
                    <>
                      <button onClick={() => handleApproveReject(request._id, "Approved")}>
                        Approve
                      </button>
                      <button onClick={() => handleApproveReject(request._id, "Rejected")}>
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
