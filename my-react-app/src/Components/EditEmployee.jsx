import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    salary: '',
    address: '',
    designation: '',
    image: '',
  });

  useEffect(() => {
    // Fetch employee details
    axios
      .get(`http://localhost:3000/auth/employee/${id}`)
      .then((result) => {
        const data = result.data.Result[0];
        setEmployee({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          salary: data.salary,
          address: data.address,
          designation: data.designation || '', // Default to empty if not present
          image: '', // Image needs to be re-uploaded
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('phone', employee.phone);
    formData.append('salary', employee.salary);
    formData.append('address', employee.address);
    formData.append('designation', employee.designation);
    if (employee.image) formData.append('image', employee.image);

    axios
      .put(`http://localhost:3000/auth/edit_employee/${id}`, formData)
      .then((result) => {
        if (result.data.Status) {
          navigate('/dashboard/employee');
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              value={employee.name}
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className="col-12">
            <label htmlFor="inputEmail" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail"
              placeholder="Enter Email"
              autoComplete="off"
              value={employee.email}
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
          </div>

          {/* Phone */}
          <div className="col-12">
            <label htmlFor="inputPhone" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputPhone"
              placeholder="Enter Phone Number"
              autoComplete="off"
              value={employee.phone}
              onChange={(e) =>
                setEmployee({ ...employee, phone: e.target.value })
              }
            />
          </div>

          {/* Designation */}
          <div className="col-12">
            <label htmlFor="inputDesignation" className="form-label">
              Designation
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputDesignation"
              placeholder="Enter Designation"
              value={employee.designation}
              onChange={(e) =>
                setEmployee({ ...employee, designation: e.target.value })
              }
            />
          </div>

          {/* Salary */}
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
              value={employee.salary}
              onChange={(e) =>
                setEmployee({ ...employee, salary: e.target.value })
              }
            />
          </div>

          {/* Address */}
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
              value={employee.address}
              onChange={(e) =>
                setEmployee({ ...employee, address: e.target.value })
              }
            />
          </div>

          {/* Image Upload */}
          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="inputGroupFile01">
              Select Image
            </label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputGroupFile01"
              name="image"
              onChange={(e) =>
                setEmployee({ ...employee, image: e.target.files[0] })
              }
            />
          </div>

          {/* Submit Button */}
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
