import React, { useState } from "react";
import './Category.css';

const Category = () => {
  // State for fields
  const [fields, setFields] = useState([
    'Finance',
    'Marketing',
    'Accounting',
    'Housekeeping',
    'Human Resources',
    'IT Support',
    'Sales',
  ]);

  // State for employees and their assigned fields
  const [employees, setEmployees] = useState([
    { name: 'John Doe', field: 'Finance' },
    { name: 'Jane Smith', field: 'Marketing' },
    { name: 'Mark Brown', field: 'Sales' },
  ]);

  // State for the new field, new employee, search query, and selected field
  const [newField, setNewField] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddField = () => {
    if (newField.trim() !== '' && !fields.includes(newField)) {
      setFields([...fields, newField]);
      setNewField('');
    }
  };

  const handleAddEmployee = () => {
    if (employeeName.trim() !== '' && selectedField !== '') {
      setEmployees([...employees, { name: employeeName, field: selectedField }]);
      setEmployeeName('');
      setSelectedField('');
    }
  };

  // Search functionality to filter employees by name
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Group employees by field
  const groupedEmployees = fields.reduce((acc, field) => {
    acc[field] = employees.filter(emp => 
      emp.field === field && emp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return acc;
  }, {});

  return (
    <div className="categories-container">
      <h2>Employee Categories by Field</h2>

      {/* Search Section */}
      <div className="search-section">
        <i className="fas fa-search"></i> {/* Search Icon */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Employee"
          className="search-input"
        />
      </div>

      {/* Field List Section */}
      <div className="field-list">
        {fields.map((field) => (
          <div key={field} className="field-section">
            <h3>
              <i className="fas fa-briefcase"></i> {/* Briefcase Icon */}
              {field}
            </h3>
            <ul>
              {groupedEmployees[field].map((emp, index) => (
                <li key={index} className="field-item">
                  {emp.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Add New Field Section */}
      <div className="add-field">
        <input
          type="text"
          value={newField}
          onChange={(e) => setNewField(e.target.value)}
          placeholder="Add New Field"
          className="field-input"
        />
        <button onClick={handleAddField} className="add-button">
          <i className="fas fa-plus-circle"></i> {/* Add Icon */}
          Add Field
        </button>
      </div>

      {/* Add New Employee Section */}
      <div className="add-employee">
        <input
          type="text"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          placeholder="Employee Name"
          className="employee-input"
        />
        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          className="field-select"
        >
          <option value="">Select Field</option>
          {fields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
        <button onClick={handleAddEmployee} className="add-button">
          <i className="fas fa-user-plus"></i> {/* User Add Icon */}
          Add Employee
        </button>
      </div>
    </div>
  );
};

export default Category;
