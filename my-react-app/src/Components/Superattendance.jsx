import React, { useState } from 'react';
import './Superattendance.css';

const Superattendance = () => {
  // Initial employee data with attendance status
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: 'John Doe', position: 'Software Developer', status: 'Present' },
    { id: 2, name: 'Jane Smith', position: 'HR Manager', status: 'Absent' },
    { id: 3, name: 'Michael Johnson', position: 'Designer', status: 'Present' },
  ]);

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Filter employees based on search query
  const filteredData = attendanceData.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle employee attendance status (Present/Absent)
  const handleStatusChange = (id, newStatus) => {
    const updatedData = attendanceData.map((employee) =>
      employee.id === id ? { ...employee, status: newStatus } : employee
    );
    setAttendanceData(updatedData);
  };

  // Handle Search button click
  const handleSearch = () => {
    console.log('Search button clicked with query:', searchQuery);
  };

  // Handle Show Attendance Report button click
  const handleShowReport = () => {
    console.log('Attendance report generated');
    // You can modify this function to display or download the report
  };

  return (
    <div className="attendance-container">
      <h1>HR Attendance Management</h1>
      
      {/* Search Bar, Search Button, and Show Attendance Report Button */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
       
        <button onClick={handleShowReport} className="report-btn">
          Show Attendance Report
        </button>
      </div>

      {/* Attendance Table */}
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>{employee.status}</td>
              <td>
                <button
                  className="status-btn"
                  onClick={() =>
                    handleStatusChange(
                      employee.id,
                      employee.status === 'Present' ? 'Absent' : 'Present'
                    )
                  }
                >
                  Mark as {employee.status === 'Present' ? 'Absent' : 'Present'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Superattendance;
