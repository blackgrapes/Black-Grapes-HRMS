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
    role: "", // Updated this field to "role" instead of "designation"
    image: "",
    manager: "",
    dob: "",
    joiningDate: "",
    department: "", // Added department
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Simple validation
    if (
      !employee.name ||
      !employee.email ||
      !employee.salary ||
      !employee.phone ||
      !employee.role || // Updated validation to check for "role"
      !employee.image ||
      !employee.manager ||
      !employee.dob ||
      !employee.joiningDate ||
      !employee.department // Added validation for department
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
          console.log("already exists");
        }
        // Clear the form by resetting the state to initial values
        if (result.status === 200) {
          setEmployee({
            name: "",
            email: "",
            salary: "",
            address: "",
            phone: "",
            role: "", // Reset the "role"
            image: "",
            manager: "",
            dob: "",
            joiningDate: "",
            department: "", // Reset department as well
          });
          navigate("/dashboard/signup_employee");
          alert("Employee added successfully. Please sign up with the same email.");
        } else {
          alert("Error adding employee");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        // Set isSubmitting to false once the request is complete
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
            <label htmlFor="inputRole" className="form-label">
              Role
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputRole"
              placeholder="Enter Role"
              onChange={(e) => setEmployee({ ...employee, role: e.target.value })} // Updated field to "role"
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputDepartment" className="form-label">
              Department
            </label>
            <input
              type="text"
              className="form-control rounded-0"
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
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting} // Disable button when submitting
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
