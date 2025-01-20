import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
import { db } from "../utils/db.js";

const router = express.Router();

// Admin login API
router.post("/adminlogin", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ loginStatus: false, Error: "Email and password are required" });
      }
  
      // Fetch admin details from MongoDB
      const collection = db.collection("admin"); // Use the 'admin' collection
      const admin = await collection.findOne({ email });
  
      if (!admin) {
        return res.status(401).json({ loginStatus: false, Error: "Wrong email or password" });
      }
  
      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ loginStatus: false, Error: "Wrong email or password" });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { role: "admin", email: admin.email, id: admin._id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
  
      // Set token in cookies
      res.cookie("token", token);
      return res.json({ loginStatus: true });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ loginStatus: false, Error: "Internal server error" });
    }
  });

  // Admin Signup API
router.post("/adminsignup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ signupStatus: false, Error: "Name, email, and password are required" });
      }
  
      // Check if the admin already exists
      const collection = db.collection("admin");
      const existingAdmin = await collection.findOne({ email });
  
      if (existingAdmin) {
        return res.status(409).json({ signupStatus: false, Error: "Admin with this email already exists" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert new admin into the database
      const result = await collection.insertOne({ name, email, password: hashedPassword });
      console.log("Admin added:", result.insertedId);
  
      return res.json({ signupStatus: true, message: "Admin registered successfully" });
    } catch (err) {
      console.error("Signup error:", err);
      return res.status(500).json({ signupStatus: false, Error: "Internal server error" });
    }
  });
  

export default router;