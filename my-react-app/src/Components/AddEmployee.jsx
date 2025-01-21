import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    salary: "",
    address: "",
    phone: "",
    designation: "",
    image: "",
    employeeId: "",
    role: "",
    manager: "",
    dob: "",
    joiningDate: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (
      !employee.name ||
      !employee.email ||
      !employee.password ||
      !employee.salary ||
      !employee.phone ||
      !employee.designation ||
      !employee.image ||
      !employee.employeeId ||
      !employee.role ||
      !employee.manager ||
      !employee.dob ||
      !employee.joiningDate
    ) {
      setErrorMessage("Please fill all fields.");
      return;
    }

    axios
      .post("http://localhost:3000/employeedetail/add_employee", employee)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/employee");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputEmployeeId" className="form-label">
              Employee ID
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputEmployeeId"
              placeholder="Enter Employee ID"
              onChange={(e) => setEmployee({ ...employee, employeeId: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputRole" className="form-label">
              Role
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputRole"
              placeholder="Enter Role"
              onChange={(e) => setEmployee({ ...employee, role: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputManager" className="form-label">
              Manager
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputManager"
              placeholder="Enter Manager's Name"
              onChange={(e) => setEmployee({ ...employee, manager: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputDOB" className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputDOB"
              onChange={(e) => setEmployee({ ...employee, dob: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputJoiningDate" className="form-label">
              Joining Date
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputJoiningDate"
              onChange={(e) => setEmployee({ ...employee, joiningDate: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail4"
              placeholder="Enter Email"
              autoComplete="off"
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            />
          </div>
          
          <div className="col-12">
            <label htmlFor="inputPassword4" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control rounded-0"
              id="inputPassword4"
              placeholder="Enter Password"
              onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputPhone" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputPhone"
              placeholder="Enter Phone Number"
              onChange={(e) => setEmployee({ ...employee, phone: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputDesignation" className="form-label">
              Designation
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputDesignation"
              placeholder="Enter Designation"
              onChange={(e) => setEmployee({ ...employee, designation: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputSalary" className="form-label">
              Salary
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter Salary"
              autoComplete="off"
              onChange={(e) => setEmployee({ ...employee, salary: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="1234 Main St"
              autoComplete="off"
              onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="inputGroupFile01">
              Select Image
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputGroupFile01"
              name="image"
              onChange={(e) => setEmployee({ ...employee, image: e.target.files[0] })}
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
