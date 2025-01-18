import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../utils/db.js";

const router = express.Router();

// Super Admin Login API
router.post("/superadminlogin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ Status: false, Error: "Email and password are required" });
    }

    // Fetch super admin details from the database
    const collection = db.collection("superadmin");
    const superAdmin = await collection.findOne({ email });

    if (!superAdmin) {
      return res.status(401).json({ Status: false, Error: "Invalid credentials" });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, superAdmin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ Status: false, Error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { role: "superadmin", email: superAdmin.email, id: superAdmin._id },
      "jwt_secret_key",
      { expiresIn: "1d" }
    );

    // Set token in cookies
    res.cookie("token", token);
    return res.json({ Status: true, message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ Status: false, Error: "Internal server error" });
  }
});

// Super Admin Signup API (optional if you need to create super admin accounts)
router.post("/superadminsignup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ Status: false, Error: "Name, email, and password are required" });
    }

    // Check if the super admin already exists
    const collection = db.collection("superadmin");
    const existingAdmin = await collection.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({ Status: false, Error: "Super Admin with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new super admin into the database
    const result = await collection.insertOne({ name, email, password: hashedPassword });
    console.log("Super Admin added:", result.insertedId);

    return res.json({ Status: true, message: "Super Admin registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ Status: false, Error: "Internal server error" });
  }
});

// Super Admin Logout API
router.get("/superadminlogout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true, message: "Logged out successfully" });
});

export default router;
