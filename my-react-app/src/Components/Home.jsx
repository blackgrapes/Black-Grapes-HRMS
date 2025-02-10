import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import './Home.css';

// ✅ Card Component
const Card = ({ title, value, buttonText, buttonClass, onClick }) => (
  <div className="card">
    <div className="text-center pb-1">
      <h4>{title}</h4>
      <br />
    </div>
    <h5>Total: {value !== undefined ? value : 'Loading...'}</h5> 
    <button className={`btn ${buttonClass}`} onClick={onClick}>
      {buttonText}
    </button>
  </div>
);

// ✅ Pie Chart Component
const PieChartComponent = ({ title, data, colors }) => (
  <div className="pie-chart-container">
    <h3>{title}</h3>
    <div className="pie-chart-content">
      <div className="pie-chart">
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
        </PieChart>
      </div>
      <div className="pie-chart-details">
        <Legend verticalAlign="middle" layout="vertical" align="left" />
      </div>
    </div>
  </div>
);

// ✅ HR Table Component
const HRTable = ({ hrRecords }) => (
  <div className="mt-4 px-5 pt-3">
    <h3>List of HR Records</h3>
    {hrRecords.length > 0 ? (
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
    ) : (
      <p>No HR records found</p>
    )}
  </div>
);

// ✅ Home Component
const Home = () => {
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [hrRecords, setHrRecords] = useState([]);
  const [employeeCategories, setEmployeeCategories] = useState([]);
  const [companyDistribution, setCompanyDistribution] = useState([]); // ✅ Replacing roleDistribution with companyDistribution

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchEmployeeData(),
        fetchSalaryData(),
        fetchHRData(),
        fetchLeaveData(),
      ]);
    };
    fetchData();
  }, []);

  // ✅ Fetch Employee Data
  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/employeedetail/all', {
        withCredentials: true,
      });

      const employees = response.data?.Result || [];
      setEmployeeTotal(employees.length);

      const departmentCount = {};
      const companyCount = {}; // ✅ New object for Company Count

      employees.forEach((emp) => {
        departmentCount[emp.department] = (departmentCount[emp.department] || 0) + 1;
        companyCount[emp.company] = (companyCount[emp.company] || 0) + 1; // ✅ Count companies
      });

      setEmployeeCategories(
        Object.entries(departmentCount).map(([name, value]) => ({ name, value }))
      );

      setCompanyDistribution(
        Object.entries(companyCount).map(([name, value]) => ({ name, value }))
      ); // ✅ Set Company Distribution
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  // ✅ Fetch HR Data
  const fetchHRData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/hrdetail/all', {
        withCredentials: true,
      });
      setHrRecords(response.data?.Result || []);
    } catch (error) {
      console.error('Error fetching HR data:', error);
    }
  };

  // ✅ Fetch Salary Data
  const fetchSalaryData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/Payroll/payroll-with-details', {
        withCredentials: true,
      });

      const payrollData = response.data?.payrollData || [];
      const total = payrollData.reduce(
        (acc, record) => acc + (record.totalSalary || 0),
        0
      );

      setSalaryTotal(total);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
    }
  };

  // ✅ Fetch Leave Data
  const fetchLeaveData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/employeeLeave/leave-requests', {
        withCredentials: true,
      });

      const leaveRequests = response.data?.leaveRequests || [];
      const approvedLeaves = leaveRequests.filter(request => request.status === 'Approved');
      const uniqueEmployeesOnLeave = new Set(approvedLeaves.map(request => request.email));
      setLeaveCount(uniqueEmployeesOnLeave.size);
    } catch (error) {
      console.error('Error fetching leave data:', error);
    }
  };

  // ✅ Navigation Handlers
  const handleEmployeeAction = () => navigate('/dashboard/employee');
  const handleSalaryAction = () => navigate('/dashboard/payroll');
  const handleLeaveAction = () => navigate('/dashboard/LeaveManagement');

  return (
    <div>
      {/* ✅ Dashboard Cards */}
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
          value={`Rs. ${salaryTotal.toLocaleString()}`}
          buttonText="Salary Action"
          buttonClass="salary-btn"
          onClick={handleSalaryAction}
        />
        <Card
          title="Leave"
          value={leaveCount}
          buttonText="Leave"
          buttonClass="btn-warning"
          onClick={handleLeaveAction}
        />
      </section>

      {/* ✅ Pie Charts */}
      <section className="pie-charts-row">
        <PieChartComponent
          title="Employee Department"
          data={employeeCategories}
          colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD']}
        />
        <PieChartComponent
          title="Employee in Company" // ✅ Changed the title
          data={companyDistribution} // ✅ Changed data source
          colors={['#FF6347', '#48C9B0', '#F39C12', '#8E44AD', '#5DADE2']}
        />
      </section>

      {/* ✅ HR Records Table */}
      <HRTable hrRecords={hrRecords} />
    </div>
  );
};

export default Home;
