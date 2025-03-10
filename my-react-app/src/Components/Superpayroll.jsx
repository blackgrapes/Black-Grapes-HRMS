import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Superpayroll.css";

const Superpayroll = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHRPayrollData = async () => {
      try {
        const response = await axios.get(`${process.env.VITE_API_URL}/hrpayroll/hr-payroll-with-details`);
        setPayrollData(response.data.payrollData);
      } catch (error) {
        console.error("Error fetching HR payroll data:", error);
      }
    };

    fetchHRPayrollData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (email, field, value) => {
    setPayrollData((prevData) =>
      prevData.map((employee) =>
        employee.email === email ? { ...employee, [field]: value } : employee
      )
    );
  };

  const handleSavePayroll = async (employee) => {
    try {
      const updatedPayroll = {
        basicSalary: parseFloat(employee.basicSalary) || 0,
        allowances: parseFloat(employee.allowances) || 0,
        deductions: parseFloat(employee.deductions) || 0,
        paidUpto: employee.paidUpto || "",
      };

      const response = await axios.put(
        `${process.env.VITE_API_URL}/hrpayroll/hr-payroll/${employee.email}`,
        updatedPayroll
      );

      if (response.status === 200 || response.status === 201) {
        setPayrollData((prevData) =>
          prevData.map((emp) =>
            emp.email === employee.email ? { ...emp, ...updatedPayroll } : emp
          )
        );

        alert(`✅ Payroll updated successfully for ${employee.name}!`);
      } else {
        alert(`❌ Failed to update payroll for ${employee.name}.`);
      }
    } catch (error) {
      console.error("Error updating HR payroll:", error);
      alert(`❌ Failed to update payroll for ${employee.name}.`);
    }
  };

  const filteredData = payrollData.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="hr-payroll-container">
      <h1>HR Payroll Management</h1>
      <input
        type="text"
        placeholder="Search HR Employee"
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />

      <table className="hr-payroll-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Basic Salary</th>
            <th>Allowances</th>
            <th>Deductions</th>
            <th>Total Salary</th>
            <th>Paid Upto</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((employee) => {
            const totalSalary =
              parseFloat(employee.basicSalary) +
              parseFloat(employee.allowances) -
              parseFloat(employee.deductions);

            return (
              <tr key={employee.email}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>
                  <input
                    type="number"
                    value={employee.basicSalary}
                    onChange={(e) => handleInputChange(employee.email, "basicSalary", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={employee.allowances}
                    onChange={(e) => handleInputChange(employee.email, "allowances", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={employee.deductions}
                    onChange={(e) => handleInputChange(employee.email, "deductions", e.target.value)}
                  />
                </td>
                <td>Rs.{totalSalary.toFixed(2)}</td>
                <td>
                  <input
                    type="date"
                    value={employee.paidUpto || ""}
                    onChange={(e) => handleInputChange(employee.email, "paidUpto", e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => handleSavePayroll(employee)} className="save-btn">
                    Save
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Superpayroll;
