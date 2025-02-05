import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SuperAddEmployee.css'; 

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    salary: "",
    address: "",
    phone: "",
    role: "",
    image: "",
    manager: "",
    dob: "",
    joiningDate: "",
    department: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !employee.name ||
      !employee.email ||
      !employee.salary ||
      !employee.phone ||
      !employee.role ||
      !employee.image ||
      !employee.manager ||
      !employee.dob ||
      !employee.joiningDate ||
      !employee.department
    ) {
      setErrorMessage("Please fill all fields.");
      return;
    }

    setIsSubmitting(true);

    axios
      .post("http://localhost:3000/employeedetail/add_employee", employee)
      .then((result) => {
        console.log(result);
        if (result.status === 409) {
          alert("Employee already exists");
        }
        if (result.status === 200) {
          setEmployee({
            name: "",
            email: "",
            salary: "",
            address: "",
            phone: "",
            role: "",
            image: "",
            manager: "",
            dob: "",
            joiningDate: "",
            department: "",
          });
          navigate("/SuperSignupEmployee");
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
      {/* Main container for the box */}
      <div className="employee-form-box p-4 rounded border shadow-lg w-75">
        <h3 className="text-center mb-4">Add Employee</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        
        {/* Form starts here */}
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="inputName"
              placeholder="Enter Name"
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="inputEmail4"
              placeholder="Enter Email"
              autoComplete="off"
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputPhone" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              className="form-control"
              id="inputPhone"
              placeholder="Enter Phone Number"
              onChange={(e) => setEmployee({ ...employee, phone: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputDOB" className="form-label">
              Date of Birth
            </label>
            <input
              type="date"
              className="form-control"
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
              className="form-control"
              id="inputJoiningDate"
              onChange={(e) => setEmployee({ ...employee, joiningDate: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputManager" className="form-label">
              Manager
            </label>
            <input
              type="text"
              className="form-control"
              id="inputManager"
              placeholder="Enter Manager's Name"
              onChange={(e) => setEmployee({ ...employee, manager: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputRole" className="form-label">
              Role
            </label>
            <input
              type="text"
              className="form-control"
              id="inputRole"
              placeholder="Enter Role"
              onChange={(e) => setEmployee({ ...employee, role: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputDepartment" className="form-label">
              Department
            </label>
            <input
              type="text"
              className="form-control"
              id="inputDepartment"
              placeholder="Enter Department"
              onChange={(e) => setEmployee({ ...employee, department: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputSalary" className="form-label">
              Salary
            </label>
            <input
              type="text"
              className="form-control"
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
              className="form-control"
              id="inputAddress"
              placeholder="Enter Address"
              autoComplete="off"
              onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
            />
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="inputGroupFile01" className="form-label">
              Select Image
            </label>
            <input
              type="file"
              className="form-control"
              id="inputGroupFile01"
              name="image"
              onChange={(e) => setEmployee({ ...employee, image: e.target.files[0] })}
            />
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
