import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb"; // Ensure this is imported for handling MongoDB ObjectId

const router = express.Router();

// Employee Signup API
router.post("/employee_signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ signupStatus: false, Error: "Name, email, and password are required" });
    }

    // Check if the employee already exists
    const collection = db.collection("employee");
    const existingEmployee = await collection.findOne({ email });

    if (existingEmployee) {
      return res.status(409).json({ signupStatus: false, Error: "Employee with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new employee into the database
    const result = await collection.insertOne({ name, email, password: hashedPassword });
    console.log("Employee added:", result.insertedId);

    return res.json({ signupStatus: true, message: "Employee registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ signupStatus: false, Error: "Internal server error" });
  }
});

// Employee Login API
router.post("/employee_login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ loginStatus: false, Error: "Email and password are required" });
    }

    // Fetch employee details from the database
    const collection = db.collection("employee");
    const employee = await collection.findOne({ email });

    if (!employee) {
      return res.status(401).json({ loginStatus: false, Error: "Wrong email or password" });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({ loginStatus: false, Error: "Wrong email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { role: "employee", email: employee.email, id: employee._id },
      "jwt_secret_key",
      { expiresIn: "1d" }
    );

    // Set token in cookies
    res.cookie("token", token);
    return res.json({ loginStatus: true, id: employee._id });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ loginStatus: false, Error: "Internal server error" });
  }
});

// Get Employee Details API
router.get("/detail/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Convert `id` to ObjectId for MongoDB query
    const objectId = new ObjectId(id);

    // Fetch employee details from the database
    const collection = db.collection("employee");
    const employee = await collection.findOne({ _id: objectId });

    if (!employee) {
      return res.status(404).json({ Status: false, Error: "Employee not found" });
    }

    return res.json({ Status: true, employee });
  } catch (err) {
    console.error("Error fetching employee details:", err);
    return res.status(500).json({ Status: false, Error: "Internal server error" });
  }
});

// Employee Logout API
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true, message: "Logged out successfully" });
});

// Change Password API
router.put("/change_password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword} = req.body;

    // Validate input
    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ Status: false, Error: "All fields are required" });
    }

    // Fetch employee from the database
    const collection = db.collection("employee");
    const employee = await collection.findOne({ email });

    if (!employee) {
      return res.status(404).json({ Status: false, Error: "Employee not found" });
    }

    // Compare old password
    const isPasswordValid = await bcrypt.compare(oldPassword, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({ Status: false, Error: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the database
    await collection.updateOne(
      { email },
      { $set: { password: hashedNewPassword } }
    );

    return res.json({ Status: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    return res.status(500).json({ Status: false, Error: "Internal server error" });
  }
});

// Export the router
export default router;
