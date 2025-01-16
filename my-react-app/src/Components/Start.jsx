import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Start.css'; // Import the new CSS file

const Start = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3000/verify')
      .then(result => {
        if (result.data.Status) {
          if (result.data.role === "admin") {
            navigate('/dashboard');
          } else {
            navigate('/employee_detail/' + result.data.id);
          }
        }
      }).catch(err => console.log(err));
  }, []);

  return (
    <div className="container">
      {/* Heading outside the login box */}
      <div className="heading">
        <h1>HRMS</h1>
      </div>

      <div className="login-form">
        {/* Logo Image */}
        <div className="logo">
          <img src="./src/assets/logo.png" alt="Logo" />
        </div>
        <h2>Login As</h2>
        <div className="button-group">
          <button className="btn btn-employee" onClick={() => navigate('/employee_login')}>
            Employee
          </button>
          <button className="btn btn-superadmin" onClick={() => navigate('/')}>
            Super Admin
          </button>
          <button className="btn btn-adminlogin" onClick={() => navigate('/adminlogin')}>
            Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Start;
