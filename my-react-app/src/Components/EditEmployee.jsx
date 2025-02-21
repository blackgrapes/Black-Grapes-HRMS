import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './EditEmployee.css';  // Importing the CSS file

const EditEmployee = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    phone: '',
    address: '',
    // designation: '',
  });

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Fetch employee details
    axios
      .get(`${process.env.VITE_API_URL}/employeedetail/employee/${email}`)
      .then((result) => {
        const data = result.data.Result;
        setEmployee({
          phone: data.phone || '',
          address: data.address || '',
          designation: data.designation || '',
        });
      })
      .catch((err) => console.error('Error fetching employee details:', err));
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updateData = {
      phone: employee.phone,
      address: employee.address,
      // designation: employee.designation,
    };

    axios
      .put(`${process.env.VITE_API_URL}/employeedetail/update_employee/${email}`, updateData)
      .then((result) => {
        if (result.data.message) {
          alert('Details Updated Successfully, Please Re-Login');
          navigate(-1); // Navigate back to the employee dashboard
        } else {
          alert(result.data.Error); // Show any error returned by the backend
        }
      })
      .catch((err) => console.error('Error updating employee:', err));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New Password and Confirm Password do not match.');
      return;
    }

    const passwordData = {
      email,
      oldPassword: passwords.oldPassword,
      newPassword: passwords.newPassword,
    };

    axios
      .put(`${process.env.VITE_API_URL}/employee/change_password`, passwordData)
      .then((result) => {
        if (result.data.message) {
          alert('Password Changed Successfully, Please Re-Login');
          navigate(-1);

          setPasswords({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.error('Error changing password:', err));
  };

  return (
    <div className="edit-employee-container">
      <div className="form-container d-flex justify-content-center">
        <div className="form-inner">
        

          <h3 className="text-center">Edit Employee</h3>

          {/* Employee Details Form */}
          <form className="row g-3" onSubmit={handleSubmit}>
            {/* Phone */}
            <div className="col-12">
              <label htmlFor="inputPhone" className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                id="inputPhone"
                placeholder="Enter Phone Number"
                value={employee.phone}
                onChange={(e) => setEmployee({ ...employee, phone: e.target.value })}
                required
              />
            </div>

            {/* Address */}
            <div className="col-12">
              <label htmlFor="inputAddress" className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                id="inputAddress"
                placeholder="Enter Address"
                value={employee.address}
                onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
                required
              />
            </div>

            {/* Designation */}
            {/* <div className="col-12">
              <label htmlFor="inputDesignation" className="form-label">Designation</label>
              <input
                type="text"
                className="form-control"
                id="inputDesignation"
                placeholder="Enter Designation"
                value={employee.designation}
                onChange={(e) => setEmployee({ ...employee, designation: e.target.value })}
                required
              />
            </div> */}

            {/* Save Changes Button */}
            <div className="col-12">
              <button type="submit" className="btn btn-primary w-100">Save Changes</button>
            </div>
          </form>

          <hr />

          {/* Change Password Section */}
          <h3 className="text-center">Change Password</h3>
          <form className="row g-3" onSubmit={handleChangePassword}>
            {/* Old Password */}
            <div className="col-12">
              <label htmlFor="inputOldPassword" className="form-label">Old Password</label>
              <input
                type="password"
                className="form-control"
                id="inputOldPassword"
                placeholder="Enter Old Password"
                value={passwords.oldPassword}
                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                required
              />
            </div>

            {/* New Password */}
            <div className="col-12">
              <label htmlFor="inputNewPassword" className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                id="inputNewPassword"
                placeholder="Enter New Password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="col-12">
              <label htmlFor="inputConfirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="inputConfirmPassword"
                placeholder="Confirm New Password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                required
              />
            </div>

            {/* Change Password Button */}
            <div className="col-12">
              <button type="submit" className="btn btn-secondary w-100">Change Password</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
