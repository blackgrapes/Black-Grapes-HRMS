import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home"; // Import the Home component
import Employees from "./Employees";
import Attendance from "./Attendance";
import Calendar from "./Calendar";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/employees" element={<Employees/>}/>
        <Route path="/attendance" element={<Attendance/>}/>
        <Route path="/Calendar" element={<Calendar/>}/>
      </Routes>
    </Router>
  );
}

export default App;

