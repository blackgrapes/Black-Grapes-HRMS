import React, { useState } from 'react';
import './Profile.css'; // Import the corresponding CSS file

const Profile = () => {
  const [employeeDetails, setEmployeeDetails] = useState({
    name: 'Michael Johnson',
    position: 'HR Specialist',
    department: 'Human Resources',
    email: 'michael.johnson@company.com',
    phone: '123-456-7890',
    location: 'New York, NY',
    profilePicture: 'https://via.placeholder.com/150', // Placeholder image URL
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmployeeDetails((prevDetails) => ({
          ...prevDetails,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-picture-container">
          <img
            className="profile-picture"
            src={employeeDetails.profilePicture}
            alt="Profile"
          />
          <label htmlFor="profilePicture" className="change-profile-btn">
            Change Photo
          </label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            className="profile-picture-input"
            onChange={handleImageChange}
          />
        </div>
        <h1 className="profile-title">{employeeDetails.name}</h1>
        <p className="profile-position">{employeeDetails.position}</p>
      </div>

      <div className="profile-details">
        <div className="profile-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={employeeDetails.email}
            onChange={handleChange}
          />
        </div>
        <div className="profile-field">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={employeeDetails.phone}
            onChange={handleChange}
          />
        </div>
        <div className="profile-field">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={employeeDetails.location}
            onChange={handleChange}
          />
        </div>
        <div className="profile-field">
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={employeeDetails.department}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="profile-actions">
        <button className="save-btn">Save Changes</button>
        <button className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default Profile;
