import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddHR = () => {
  const [hr, setHR] = useState({
    name: '',
    email: '',
    phone: '',
    salary: '',
    image: '',
    dob: '',
    joiningDate: '',
    address: '',
    department: 'Human Resource Department' // Fixed value for Department
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation to ensure all fields are filled
    if (
      !hr.name ||
      !hr.email ||
      !hr.phone ||
      !hr.image ||
      !hr.dob ||
      !hr.joiningDate ||
      !hr.address ||
      !hr.department
    ) {
      setErrorMessage('Please fill all fields.');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    Object.keys(hr).forEach((key) => {
      formData.append(key, hr[key]);
    });

    axios
      .post(`${process.env.VITE_API_URL}/hrdetail/add_hr`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        if (response.status === 200) {
          alert('HR added successfully');
          setHR({
            name: '',
            email: '',
            phone: '',
            image: '',
            dob: '',
            joiningDate: '',
            address: '',
            department: 'Human Resource Department' // Reset to fixed value
          });
          navigate('/SignupHR');
          alert('Please Sign-Up HR with the same Email');
        } else {
          alert('Error adding HR');
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage('An error occurred while adding HR.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add New HR</h3>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">Name</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              value={hr.name}
              onChange={(e) => setHR({ ...hr, name: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputEmail" className="form-label">Email</label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail"
              placeholder="Enter Email"
              value={hr.email}
              onChange={(e) => setHR({ ...hr, email: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputPhone" className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputPhone"
              placeholder="Enter Phone Number"
              value={hr.phone}
              onChange={(e) => setHR({ ...hr, phone: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputDOB" className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputDOB"
              value={hr.dob}
              onChange={(e) => setHR({ ...hr, dob: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputJoiningDate" className="form-label">Joining Date</label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputJoiningDate"
              value={hr.joiningDate}
              onChange={(e) => setHR({ ...hr, joiningDate: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">Address</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="Enter Address"
              value={hr.address}
              onChange={(e) => setHR({ ...hr, address: e.target.value })}
            />
          </div>

          {/* Fixed Department Field (Read-Only Input) */}
          <div className="col-12">
            <label htmlFor="inputDepartment" className="form-label">Department</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputDepartment"
              value={hr.department}
              readOnly // Makes the field non-editable
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="inputImage">Upload Image</label>
            <input
              type="file"
              className="form-control rounded-0"
              id="inputImage"
              onChange={(e) => setHR({ ...hr, image: e.target.files[0] })}
            />
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add HR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHR;
