import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 🔥 Import useNavigate
import axios from "axios";
import "./Profile.css";
import gudda from "/src/assets/gudda.svg"; // ✅ Import gudda.svg

const Profile = () => {
  const [hrDetails, sethrDetails] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    address: "",
    profilePicture: gudda, // ✅ Default profile picture
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originalDetails, setOriginalDetails] = useState({});

  const navigate = useNavigate(); // ✅ Initialize useNavigate
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchhrDetails = async () => {
      if (!email) {
        setError("Email is required to fetch employee details.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.VITE_API_URL}/hrdetail/hr`, {
          params: { email },
        });

        if (response.data && response.data.Result) {
          const fetchedDetails = response.data.Result;
          sethrDetails({
            ...fetchedDetails,
            profilePicture: fetchedDetails.profilePicture || gudda, // ✅ Use `gudda.svg` if no image
          });
          setOriginalDetails(fetchedDetails);
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
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    sethrDetails((prevDetails) => ({
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

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        `${process.env.VITE_API_URL}/hrdetail/update_hr/${hrDetails.email}`,
        {
          phone: hrDetails.phone,
          address: hrDetails.address,
          profilePicture: hrDetails.profilePicture,
        }
      );

      if (response.status === 200) {
        alert("Changes saved successfully!");
        setOriginalDetails(hrDetails);
      }
    } catch (err) {
      console.error("Error saving changes:", err);
      alert("An error occurred while saving changes.");
    }
  };

  const handleCancelChanges = () => {
    sethrDetails(originalDetails);
  };

  // ✅ HR Leave Button Click → Navigate to "/dashboard/HrLeave"
  const handleHRLeave = () => {
    navigate(`/dashboard/HrLeave?email=${hrDetails.email}`);
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
            src={hrDetails.profilePicture || gudda} // ✅ Fallback to `gudda.svg`
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
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={hrDetails.address}
            onChange={handleChange}
          />
        </div>

        {/* ✅ Department Field (Read-Only) */}
        <div className="profile-field">
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={hrDetails.department}
            readOnly // Makes the field non-editable
          />
        </div>
      </div>

      <div className="profile-actions">
        <button className="save-btn" onClick={handleSaveChanges}>
          Save Changes
        </button>
        <button className="hr-leave-btn" onClick={handleHRLeave}>
          HR Leave
        </button>
        <button className="cancel-btn" onClick={handleCancelChanges}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Profile;
