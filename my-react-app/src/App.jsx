import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home"; // Import the Home component
import Employees from "./Employees";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/employees" element={<Employees/>}/>
      </Routes>
    </Router>
  );
}

export default App;

