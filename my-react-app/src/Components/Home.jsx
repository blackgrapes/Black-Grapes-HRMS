import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import './Home.css';

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setemployeeTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);
  const [admins, setAdmins] = useState([]);

  // Hardcoded employee category data for the first pie chart
  const [employeeCategories, setEmployeeCategories] = useState([
    { name: 'HR', value: 10 },
    { name: 'Engineer', value: 25 },
    { name: 'Sales', value: 15 },
    { name: 'Marketing', value: 5 }
  ]);

  // New pie chart data for employee distribution by role
  const [roleDistribution, setRoleDistribution] = useState([
    { name: 'Manager', value: 20 },
    { name: 'Developer', value: 40 },
    { name: 'Designer', value: 15 },
    { name: 'QA', value: 25 }
  ]);

  useEffect(() => {
    fetchAdminData();
    fetchEmployeeData();
    fetchSalaryData();
  }, []);

  const fetchAdminData = () => {
    const result = {
      Status: true,
      Result: [
        { email: 'admin1@example.com' },
        { email: 'admin2@example.com' },
      ]
    };
    if (result.Status) {
      setAdmins(result.Result);
      setAdminTotal(result.Result.length);
    } else {
      alert(result.Error);
    }
  }

  const fetchEmployeeData = () => {
    const employeeCount = 50; // This would be fetched from an API
    setemployeeTotal(employeeCount);
  }

  const fetchSalaryData = () => {
    const totalSalary = 100000; // This would be fetched from an API
    setSalaryTotal(totalSalary);
  }

  return (
    <div>
      <div className="button-row p-3 mt-3">
        <div className="card">
          <div className="text-center pb-1">
            <h4>Admin</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{adminTotal}</h5>
          </div>
          <button className="btn admin-btn">Admin Action</button>
        </div>
        <div className="card">
          <div className="text-center pb-1">
            <h4>Employee</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>{employeeTotal}</h5>
          </div>
          <button className="btn employee-btn">Employee Action</button>
        </div>
        <div className="card">
          <div className="text-center pb-1">
            <h4>Salary</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5>Total:</h5>
            <h5>${salaryTotal}</h5>
          </div>
          <div className="d-flex justify-content-start">
            <button className="btn salary-btn">Salary Action</button>
          </div>
        </div>
        <div className="card">
          <div className="text-center pb-1">
            <h4>Leave</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-start">
            <button className="btn btn-warning">Leave</button>
          </div>
        </div>
      </div>

      {/* Pie Chart for Employee Categories and Role Distribution in One Row */}
      <div className="pie-charts-row">
        <div className="pie-chart-container">
          <h3>Employee Category Distribution</h3>
          <PieChart width={300} height={300} className="pie-chart-border">
            <Pie
              data={employeeCategories}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {employeeCategories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="pie-chart-container">
          <h3>Employee Role Distribution</h3>
          <PieChart width={300} height={300} className="pie-chart-border">
            <Pie
              data={roleDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {roleDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#FF6347', '#48C9B0', '#F39C12', '#8E44AD'][index % 4]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Admin List Table */}
      <div className="mt-4 px-5 pt-3">
        <h3>List of Admins</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.email}>
                <td>{a.email}</td>
                <td>
                  <button className="btn btn-info btn-sm me-2">Edit</button>
                  <button className="btn btn-warning btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
