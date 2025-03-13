import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Updated companies with new departments and roles
const companies = {
  "Black Grapes Group": {
    departments: [
      "Accounting",
      "Finance",
      "Marketing",
      "IT Support",
      "Education Service",
      "E-Commerce Solution",
      "Social Media Marketing",
      "Government Training Program",
      "Operations",
    ],
  },
  "Black Grapes Softech": {
    departments: ["Senior Project Manager", "Project Manager", "Senior Developer", "Developer", "Intern"],
  },
  "Black Grapes Associate": {
    departments: ["Management", "Business Development", "Associates"],
  },
  "Black Grapes Real Estate": {
    departments: ["Manager", "Executive"],
  },
  "Black Grapes Valuers & Engineers": {
    departments: ["Manager", "Executive", "Back Office"],
  },
  "Black Grapes Investment & Securities": {
    departments: ["Portfolio Manager", "Executive"],
  },
  "Black Grapes Insurance Surveyors & Loss Assessors Pvt. Ltd.": {
    departments: ["Manager", "Executive", "Back Office"],
  },
};

const SuperAddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    role: "",
    manager: "",
    dob: "",
    joiningDate: "",
    department: "",
    company: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCompanyChange = (e) => {
    const selectedCompany = e.target.value;
    setEmployee({
      ...employee,
      company: selectedCompany,
      department: "",
      role: "", // Removed role dependency
    });
  };

  const handleDepartmentChange = (e) => {
    const selectedDept = e.target.value;
    setEmployee({
      ...employee,
      department: selectedDept,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !employee.name ||
      !employee.email ||
      !employee.phone ||
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
      .post(`${process.env.VITE_API_URL}/employeedetail/add_employee`, employee)
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

export default SuperAddEmployee;
