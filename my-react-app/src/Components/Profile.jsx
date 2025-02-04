import React, { useEffect, useState } from "react";
import axios from "axios";  // Make sure axios is imported to fetch data
import "./Profile.css"; // Import the corresponding CSS file

const Profile = () => {
  const [hrDetails, sethrDetails] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    address: "",
    profilePicture: "https://via.placeholder.com/150", // Placeholder image URL
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve email from localStorage
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchhrDetails = async () => {
      if (!email) {
        setError("Email is required to fetch employee details.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/hrdetail/hr", {
          params: { email }, // Pass query parameters for email
        });

        if (response.data && response.data.Result) {
          sethrDetails(response.data.Result); // Update state with fetched details
        } else {
          setError(response.data.Error || "Failed to fetch employee details.");
        }
      } catch (err) {
        console.error("Error fetching employee details:", err);
        setError("An error occurred while fetching employee details.");
      } finally {
        setLoading(false);
      }
    };

    fetchhrDetails();
  }, [email]); // Fetch details on component mount or email change

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
        sethrDetails((prevDetails) => ({
          ...prevDetails,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-picture-container">
          <img
            className="profile-picture"
            src={hrDetails.profilePicture}
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
        <h1 className="profile-title">{hrDetails.name}</h1>
        <p className="profile-position">HR</p>
      </div>

      <div className="profile-details">
        <div className="profile-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={hrDetails.email}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="profile-field">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={hrDetails.phone}
            onChange={handleChange}
          />
        </div>
        <div className="profile-field">
          <label>address</label>
          <input
            type="text"
            name="location"
            value={hrDetails.address}
            onChange={handleChange}
          />
        </div>
        <div className="profile-field">
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={hrDetails.department}
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
