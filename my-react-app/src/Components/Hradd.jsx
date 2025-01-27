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
      !hr.salary ||
      !hr.image ||
      !hr.dob ||
      !hr.joiningDate
    ) {
      setErrorMessage('Please fill all fields.');
      return;
    }

    setIsSubmitting(true);

    // Prepare form data for submission
    const formData = new FormData();
    Object.keys(hr).forEach((key) => {
      formData.append(key, hr[key]);
    });

    axios
      .post('http://localhost:3000/hrdetail/add_hr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        if (response.status === 200) {
          alert('HR added successfully');
          setHR({
            name: '',
            email: '',
            phone: '',
            salary: '',
            image: '',
            dob: '',
            joiningDate: '',
          }); // Clear the form
          navigate('/SignupHR'); // Redirect to HR management page
          alert("Please Sign-Up HR with the same Email");
        } else {
          alert('Error adding HR');
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMessage('An error occurred while adding HR.');
      })
      .finally(() => {
        setIsSubmitting(false); // Re-enable the button
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add New HR</h3>
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
              value={hr.name}
              onChange={(e) => setHR({ ...hr, name: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputEmail" className="form-label">
              Email
            </label>
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
            <label htmlFor="inputPhone" className="form-label">
              Phone Number
            </label>
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
            <label htmlFor="inputSalary" className="form-label">
              Salary
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter Salary"
              value={hr.salary}
              onChange={(e) => setHR({ ...hr, salary: e.target.value })}
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
              value={hr.dob}
              onChange={(e) => setHR({ ...hr, dob: e.target.value })}
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
              value={hr.joiningDate}
              onChange={(e) => setHR({ ...hr, joiningDate: e.target.value })}
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label" htmlFor="inputImage">
              Upload Image
            </label>
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
              disabled={isSubmitting} // Disable button while submitting
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
