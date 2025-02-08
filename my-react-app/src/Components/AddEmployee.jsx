import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const departments = {
  Finance: ["Financial Analyst", "Accountant", "Auditor"],
  Marketing: ["Marketing Manager", "SEO Specialist", "Content Strategist"],
  Accounting: ["Senior Accountant", "Tax Specialist"],
  Housekeeping: ["Housekeeping Supervisor", "Cleaning Staff"],
  "IT Support": ["IT Technician", "Help Desk Support"],
  Sales: ["Sales Executive", "Business Development Manager"],
  "Software Engineering": ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
};

// Mapping companies to departments and roles
const companies = {
  "Black Grapes Group":{},
  "Black Grapes Associate": {
    departments: ["Finance", "Marketing", "Sales"],
    roles: {
      Finance: ["Financial Analyst", "Accountant"],
      Marketing: ["SEO Specialist", "Content Strategist"],
      Sales: ["Sales Executive", "Business Development Manager"],
    },
  },
  "Black Grapes Softech": {
    departments: ["Software Engineering", "IT Support", "Marketing"],
    roles: {
      "Software Engineering": ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
      "IT Support": ["IT Technician", "Help Desk Support"],
      Marketing: ["SEO Specialist", "Content Strategist"],
    },
  },
  "Black Grapes Real Estate": {
    departments: ["Sales", "Accounting", "Housekeeping"],
    roles: {
      Sales: ["Sales Executive", "Business Development Manager"],
      Accounting: ["Senior Accountant", "Tax Specialist"],
      Housekeeping: ["Housekeeping Supervisor", "Cleaning Staff"],
    },
  },
  "Black Grapes Valuers & Engineers": {
    departments: ["Finance", "Software Engineering", "Sales"],
    roles: {
      Finance: ["Financial Analyst", "Accountant"],
      "Software Engineering": ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
      Sales: ["Sales Executive", "Business Development Manager"],
    },
  },
  "Black Grapes Investment Pvt. Ltd.": {
    departments: ["Finance", "Accounting", "Sales"],
    roles: {
      Finance: ["Financial Analyst", "Accountant", "Auditor"],
      Accounting: ["Senior Accountant", "Tax Specialist"],
      Sales: ["Sales Executive", "Business Development Manager"],
    },
  },
  "Black Grapes Insurance Surveyors & Loss Assessors Pvt. Ltd.": {
    departments: ["Sales", "Marketing", "Accounting"],
    roles: {
      Sales: ["Sales Executive", "Business Development Manager"],
      Marketing: ["SEO Specialist", "Content Strategist"],
      Accounting: ["Senior Accountant", "Tax Specialist"],
    },
  },
};

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    role: "",
    image: "",
    manager: "",
    dob: "",
    joiningDate: "",
    department: "",
    company: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle company change and update departments dynamically
  const handleCompanyChange = (e) => {
    const selectedCompany = e.target.value;
    setEmployee({
      ...employee,
      company: selectedCompany,
      department: "", // Reset department when company changes
      role: "", // Reset role when company changes
    });
  };

  // Handle department change and update roles dynamically
  const handleDepartmentChange = (e) => {
    const selectedDept = e.target.value;
    setEmployee({
      ...employee,
      department: selectedDept,
      role: "", // Reset role when department changes
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !employee.name ||
      !employee.email ||
      !employee.phone ||
      !employee.role ||
      !employee.image ||
      !employee.manager ||
      !employee.dob ||
      !employee.joiningDate ||
      !employee.department ||
      !employee.company
    ) {
      setErrorMessage("Please fill all fields.");
      return;
    }

    setIsSubmitting(true);

    axios
      .post("http://localhost:3000/employeedetail/add_employee", employee)
      .then((result) => {
        if (result.status === 409) {
          alert("Employee already exists");
        }
        if (result.status === 200) {
          setEmployee({
            name: "",
            email: "",
            address: "",
            phone: "",
            role: "",
            image: "",
            manager: "",
            dob: "",
            joiningDate: "",
            department: "",
            company: "",
          });
          navigate("/dashboard/signup_employee");
          alert("Employee added successfully. Please sign up with the same email.");
        } else {
          alert("Error adding employee");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Enter Name"
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control rounded-0"
              placeholder="Enter Email"
              autoComplete="off"
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Enter Phone Number"
              onChange={(e) => setEmployee({ ...employee, phone: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control rounded-0"
              onChange={(e) => setEmployee({ ...employee, dob: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Joining Date</label>
            <input
              type="date"
              className="form-control rounded-0"
              onChange={(e) => setEmployee({ ...employee, joiningDate: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Manager</label>
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Enter Manager's Name"
              onChange={(e) => setEmployee({ ...employee, manager: e.target.value })}
            />
          </div>

          {/* Company Dropdown */}
          <div className="col-12">
            <label className="form-label">Company</label>
            <select className="form-control rounded-0" onChange={handleCompanyChange}>
              <option value="">Select Company</option>
              {Object.keys(companies).map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          {/* Department Dropdown */}
          <div className="col-12">
            <label className="form-label">Department</label>
            <select
              className="form-control rounded-0"
              value={employee.department}
              onChange={handleDepartmentChange}
              disabled={!employee.company}
            >
              <option value="">Select Department</option>
              {employee.company &&
                companies[employee.company].departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
            </select>
          </div>

          {/* Role Dropdown */}
          <div className="col-12">
            <label className="form-label">Role</label>
            <select
              className="form-control rounded-0"
              value={employee.role}
              onChange={(e) => setEmployee({ ...employee, role: e.target.value })}
              disabled={!employee.department}
            >
              <option value="">Select Role</option>
              {employee.department &&
                companies[employee.company].roles[employee.department].map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-12">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="1234 Main St"
              autoComplete="off"
              onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">Select Image</label>
            <input
              type="file"
              className="form-control rounded-0"
              name="image"
              onChange={(e) => setEmployee({ ...employee, image: e.target.files[0] })}
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
