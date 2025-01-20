// Frontend: Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import './Home.css';

const Card = ({ title, value, buttonText, buttonClass, extraContent }) => {
  return (
    <div className="card">
      <div className="text-center pb-1">
        <h4>{title}</h4>
      </div>
      <hr />
      <div className="d-flex justify-content-between">
        <h5>Total:</h5>
        <h5>{value}</h5>
      </div>
      {extraContent}
      <button className={`btn ${buttonClass}`}>{buttonText}</button>
    </div>
  );
};

const PieChartComponent = ({ title, data, colors }) => {
  return (
    <div className="pie-chart-container">
      <h3>{title}</h3>
      <PieChart width={300} height={300} className="pie-chart-border">
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

const AdminTable = ({ admins }) => {
  return (
    <div className="mt-4 px-5 pt-3">
      <h3>List of Admins</h3>
      <table className="table">
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
  );
};

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
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

  const fetchAdminData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/admins', {
        withCredentials: true,
      });
  
      // Adjust to match the actual response format
      if (response.data && response.data.length > 0) {
        setAdmins(response.data); // Assuming `response.data` is an array
        setAdminTotal(response.data.length);
      } else {
        alert("No admins found.");
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      alert("Failed to fetch admin data. Please try again later.");
    }
  };
  

  const fetchEmployeeData = () => {
    const employeeCount = 50; // This would be fetched from an API
    setEmployeeTotal(employeeCount);
  };

  const fetchSalaryData = () => {
    const totalSalary = 100000; // This would be fetched from an API
    setSalaryTotal(totalSalary);
  };

  return (
    <div>
      <section className="button-row p-3 mt-3">
        <Card
          title="Admin"
          value={adminTotal}
          buttonText="Admin Action"
          buttonClass="admin-btn"
        />
        <Card
          title="Employee"
          value={employeeTotal}
          buttonText="Employee Action"
          buttonClass="employee-btn"
        />
        <Card
          title="Salary"
          value={`$${salaryTotal}`}
          buttonText="Salary Action"
          buttonClass="salary-btn"
        />
        <Card
          title="Leave"
          buttonText="Leave"
          buttonClass="btn-warning"
        />
      </section>

      <section className="pie-charts-row">
        <PieChartComponent
          title="Employee Category Distribution"
          data={employeeCategories}
          colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}
        />
        <PieChartComponent
          title="Employee Role Distribution"
          data={roleDistribution}
          colors={['#FF6347', '#48C9B0', '#F39C12', '#8E44AD']}
        />
      </section>

      <AdminTable admins={admins} />
    </div>
  );
};

export default Home;