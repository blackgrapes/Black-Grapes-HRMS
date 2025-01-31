import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LeaveManagement.css";

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leave data from your API
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/employeeLeave/leave-requests"); // Correct URL to fetch leave requests
        setLeaveRequests(response.data.leaveRequests || []);
      } catch (err) {
        setError("Failed to fetch leave data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, []);

  // Handle approve/reject requests
  const handleApproveReject = async (requestId, decision) => {
    try {
      // Send approval or rejection request to the backend
      const response = await axios.put(`http://localhost:3000/employeeLeave/leave-requests/${requestId}`,{
        decision:decision.toLowerCase()
      });

      // Update the state with the updated leave request
      const updatedRequest = response.data.leaveRequest;
      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === updatedRequest._id ? { ...updatedRequest } : request
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
              <th>Email</th>
              <th>Name</th>
              <th>Type</th>
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
                <td>{request.employeeDetails?.name || "N/A"}</td>
                <td>{request.type}</td>
                <td>{request.days}</td>
                <td>{request.reason}</td>
                <td>{new Date(request.startDate).toLocaleDateString()}</td>
                <td>{new Date(request.endDate).toLocaleDateString()}</td>
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
