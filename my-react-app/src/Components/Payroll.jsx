import React, { useState, useEffect } from "react";
import axios from "axios";
import './Payroll.css';

const Payroll = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
  });

  const [employees  , setEmployees] = useState([]);


  const calculateTotalSalary = (basicSalary, allowances, deductions) => {
    return basicSalary + allowances - deductions;
  };

  // Fetch payroll data from the backend (including employee details)
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
        try {
          const response = await axios.get('http://localhost:3000/employeedetail/all')
  
          console.log("Employees",response)
          if (response.data && response.data.Result) {
            setEmployees(response.data.Result);
          } else {
            setError(response.data.Error || 'Failed to fetch employee details.');
          }
        } catch (err) {
          console.error('Error fetching employee details:', err);
          setError('An error occurred while fetching employee details.');
        }
      };

    const fetchPayrollData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/Payroll/payroll-with-details");
        setPayrollData(response.data.payrollData);
      } catch (error) {
        console.error("Error fetching payroll data:", error);
      }
    };


    fetchEmployeeDetails();
    fetchPayrollData();
  }, []);

  // Handle search functionality
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle adding a new employee to payroll
  const handleAddEmployee = async () => {
    if (newEmployee.name && newEmployee.basicSalary && newEmployee.allowances && newEmployee.deductions) {
      try {
        const response = await axios.post("http://localhost:3000/Payroll/payroll", newEmployee);
        setPayrollData([...payrollData, response.data.employee]);
        setNewEmployee({
          name: "",
          basicSalary: "",
          allowances: "",
          deductions: "",
        });
      } catch (error) {
        console.error("Error adding employee:", error);
      }
    }
  };

  // Handle editing an employee's payroll
  const handleEditEmployee = async (id) => {
    const employee = payrollData.find((emp) => emp._id === id);
    setNewEmployee({
      name: employee.name,
      basicSalary: employee.basicSalary,
      allowances: employee.allowances,
      deductions: employee.deductions,
    });

    // Remove the employee temporarily to edit
    setPayrollData(payrollData.filter((emp) => emp._id !== id));

    // Update the employee when changes are saved
    await axios.put(`http://localhost:3000/Payroll/payroll/${id}`, newEmployee);
  };

  // Handle deleting an employee from payroll
  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/Payroll/payroll/${id}`);
      setPayrollData(payrollData.filter((emp) => emp._id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const filteredData = payrollData.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="payroll-container">
      <h1>Payroll Management</h1>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Employee"
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />

      {/* Add New Employee Form */}
      <div className="add-employee-form">
        <input
          type="text"
          placeholder="Name"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Basic Salary"
          value={newEmployee.basicSalary}
          onChange={(e) => setNewEmployee({ ...newEmployee, basicSalary: e.target.value })}
        />
        <input
          type="number"
          placeholder="Allowances"
          value={newEmployee.allowances}
          onChange={(e) => setNewEmployee({ ...newEmployee, allowances: e.target.value })}
        />
        <input
          type="number"
          placeholder="Deductions"
          value={newEmployee.deductions}
          onChange={(e) => setNewEmployee({ ...newEmployee, deductions: e.target.value })}
        />
        <button onClick={handleAddEmployee} className="add-btn">Add Employee</button>
      </div>

      <table className="payroll-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Email</th>
            <th>Department</th>
            <th>Basic Salary</th>
            <th>Allowances</th>
            <th>Deductions</th>
            <th>Total Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => {
          
            // const totalSalary = calculateTotalSalary(basicSalary, allowances, deductions);

            return (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                {/* <td>${basicSalary}</td>
                <td>${allowances}</td>
                <td>${deductions}</td>
                <td>${totalSalary}</td> */}
                <td>
                  <button onClick={() => handleEditEmployee(employee._id)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDeleteEmployee(employee._id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Payroll;
