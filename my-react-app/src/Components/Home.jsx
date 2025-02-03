import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import './Home.css';

// Card Component
const Card = ({ title, value, buttonText, buttonClass, onClick }) => (
  <div className="card">
    <div className="text-center pb-1">
      <h4>{title}</h4>
      <br />
    </div>
      <h5>Total:</h5>
      <h5>{value}</h5>
    <button className={`btn ${buttonClass}`} onClick={onClick}>
      {buttonText}
    </button>
  </div>
);


// Pie Chart Component
const PieChartComponent = ({ title, data, colors }) => (
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

// HR Table Component
const HRTable = ({ hrRecords }) => (
  <div className="mt-4 px-5 pt-3">
    <h3>List of HR Records</h3>
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {hrRecords.map((record) => (
          <tr key={record._id}>
            <td>{record.name}</td>
            <td>{record.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Home Component
const Home = () => {
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);
  const [hrRecords, setHrRecords] = useState([]);
  const navigate = useNavigate();

  const [employeeCategories, setEmployeeCategories] = useState([
    { name: 'HR', value: 10 },
    { name: 'Engineer', value: 25 },
    { name: 'Sales', value: 15 },
    { name: 'Marketing', value: 5 },
  ]);

  const [roleDistribution, setRoleDistribution] = useState([
    { name: 'Manager', value: 20 },
    { name: 'Developer', value: 40 },
    { name: 'Designer', value: 15 },
    { name: 'QA', value: 25 },
  ]);

  useEffect(() => {
    fetchEmployeeData();
    fetchSalaryData();
    fetchHRData(); // Fetch HR data
  }, []);

  const fetchHRData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/hrdetail/all', {
        withCredentials: true,
      });
      if (response.data && response.data.Result) {
        setHrRecords(response.data.Result);
      } else {
        console.warn('No HR records found');
      }
    } catch (error) {
      console.error('Error fetching HR data:', error);
    }
  };

  const fetchEmployeeData = () => setEmployeeTotal(50);
  const fetchSalaryData = () => setSalaryTotal(100000);

  const handleEmployeeAction = () => navigate('/dashboard/employee');
  const handleSalaryAction = () => navigate('/dashboard/payroll');
  const handleLeaveAction = () => navigate('/dashboard/LeaveManagement');

  return (
    <div>
      <section className="button-row p-3 mt-3">
        <Card
          title="Employee"
          value={employeeTotal}
          buttonText="Employee Action"
          buttonClass="employee-btn"
          onClick={handleEmployeeAction}
        />
        <Card
          title="Salary"
          value={`$${salaryTotal}`}
          buttonText="Salary Action"
          buttonClass="salary-btn"
          onClick={handleSalaryAction}
        />
        <Card
          title="Leave"
          buttonText="Leave"
          buttonClass="btn-warning"
          onClick={handleLeaveAction}
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

      <HRTable hrRecords={hrRecords} />
    </div>
  );
};

export default Home;
