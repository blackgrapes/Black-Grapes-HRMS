import React, { useState, useEffect } from 'react';
import './Report.css'; // Importing the corresponding CSS file

const Report = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Fetch employee data from an API or mock data for now
    const fetchEmployeeData = async () => {
      const data = [
        {
          id: 1,
          name: 'John Doe',
          image: 'https://via.placeholder.com/50',
          email: 'john.doe@example.com',
          address: '123 Main St, Cityville',
          phone: '+1 234 567 890',
          designation: 'Software Engineer',
          manager: 'Alice Johnson',
          joiningDate: '2020-01-15',
          salary: '$80,000',
        },
        {
          id: 2,
          name: 'Jane Smith',
          image: 'https://via.placeholder.com/50',
          email: 'jane.smith@example.com',
          address: '456 Oak Rd, Townsville',
          phone: '+1 987 654 321',
          designation: 'Product Manager',
          manager: 'Bob Williams',
          joiningDate: '2019-08-01',
          salary: '$95,000',
        },
        {
          id: 3,
          name: 'Michael Johnson',
          image: 'https://via.placeholder.com/50',
          email: 'michael.johnson@example.com',
          address: '789 Pine Ave, Villageburg',
          phone: '+1 555 123 456',
          designation: 'HR Specialist',
          manager: 'Charlotte Davis',
          joiningDate: '2018-06-30',
          salary: '$55,000',
        },
      ];
      setEmployees(data);
    };

    fetchEmployeeData();
  }, []);

  return (
    <div className="report-container">
      <h1 className="report-title">Employee Report</h1>
      <table className="report-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Designation</th>
            <th>Manager</th>
            <th>Joining Date</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td><img src={employee.image} alt={employee.name} className="employee-image" /></td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.address}</td>
              <td>{employee.phone}</td>
              <td>{employee.designation}</td>
              <td>{employee.manager}</td>
              <td>{employee.joiningDate}</td>
              <td>{employee.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Report;
