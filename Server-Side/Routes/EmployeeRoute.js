import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// ✅ Employee Signup API (with DOB)
router.post("/employee_signup", async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;

    if (!name || !email || !password || !dob) {
      return res.status(400).json({ signupStatus: false, Error: "All fields are required" });
    }

    const collection = db.collection("employee");
    const existingEmployee = await collection.findOne({ email });

    if (existingEmployee) {
      return res.status(409).json({ signupStatus: false, Error: "Employee with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await collection.insertOne({ name, email, password: hashedPassword, dob }); // ✅ Added dob
    console.log("Employee added:", result.insertedId);

    return res.json({ signupStatus: true, message: "Employee registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ signupStatus: false, Error: "Internal server error" });
  }
});

// ✅ Employee Login API (No Changes)
router.post("/employee_login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ loginStatus: false, Error: "Email and password are required" });
    }

    const collection = db.collection("employee");
    const employee = await collection.findOne({ email });

    if (!employee) {
      return res.status(401).json({ loginStatus: false, Error: "Wrong email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({ loginStatus: false, Error: "Wrong email or password" });
    }

    const token = jwt.sign(
      { role: "employee", email: employee.email, id: employee._id },
      "jwt_secret_key",
      { expiresIn: "1d" }
    );

    res.cookie("token", token);
    return res.json({ loginStatus: true, id: employee._id });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ loginStatus: false, Error: "Internal server error" });
  }
});

// ✅ Get Employee Details API (No Changes)
router.get("/detail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new ObjectId(id);
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

// ✅ Employee Logout API (No Changes)
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true, message: "Logged out successfully" });
});

// ✅ Change Password API (No Changes)
router.put("/change_password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ Status: false, Error: "All fields are required" });
    }

    const collection = db.collection("employee");
    const employee = await collection.findOne({ email });

    if (!employee) {
      return res.status(404).json({ Status: false, Error: "Employee not found" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({ Status: false, Error: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
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

// ✅ Forgot Password API (New)
router.post("/forgot_password", async (req, res) => {
  try {
    const { email, dob, newPassword } = req.body;

    if (!email || !dob || !newPassword) {
      return res.status(400).json({ Status: false, Error: "All fields are required" });
    }

    const collection = db.collection("employee");
    const employee = await collection.findOne({ email, dob }); // ✅ Verify DOB with email

    if (!employee) {
      return res.status(404).json({ Status: false, Error: "Invalid email or date of birth" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await collection.updateOne(
      { email },
      { $set: { password: hashedNewPassword } }
    );

    return res.json({ Status: true, message: "Password reset successfully" });
  } catch (err) {
    console.error("Error in forgot password:", err);
    return res.status(500).json({ Status: false, Error: "Internal server error" });
  }
});

// ✅ Export the Router
export default router;
