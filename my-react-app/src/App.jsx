import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home"; // Import the Home component
import Employees from "./Employees";
import Attendance from "./Attendance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/employees" element={<Employees/>}/>
        <Route path="/attendance" element={<Attendance/>}/>
      </Routes>
    </Router>
  );
}

export default App;

