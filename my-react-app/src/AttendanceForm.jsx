import React, { useState } from "react";

const AttendanceForm = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [status, setStatus] = useState("Present");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Marked ${employeeName} as ${status} on today's date.`);
  };

  return (
    <div className="attendance-form">
      <h3>Mark Attendance</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee Name:</label>
          <input
            type="text"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AttendanceForm;
