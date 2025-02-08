import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../utils/db.js";

const router = express.Router();

/* ===========================
   ✅ Super Admin Login API
=========================== */
router.post("/superadminlogin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ Status: false, Error: "Email and password are required" });
    }

    const collection = db.collection("superadmin");
    const superAdmin = await collection.findOne({ email });

    if (!superAdmin) {
      return res.status(401).json({ Status: false, Error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, superAdmin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ Status: false, Error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { role: "superadmin", email: superAdmin.email, id: superAdmin._id },
      "jwt_secret_key",
      { expiresIn: "1d" }
    );

    res.cookie("token", token);
    return res.json({ Status: true, message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ Status: false, Error: "Internal server error" });
  }
});

/* ===========================
   ✅ Super Admin Signup API
=========================== */
router.post("/superadminsignup", async (req, res) => {
  try {
    const { name, email, password, dob } = req.body; // ✅ Added dob

    if (!name || !email || !password || !dob) {
      return res.status(400).json({ Status: false, Error: "Name, email, password, and DOB are required" });
    }

    const collection = db.collection("superadmin");
    const existingAdmin = await collection.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({ Status: false, Error: "Super Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await collection.insertOne({ name, email, dob, password: hashedPassword }); // ✅ Save DOB
    console.log("Super Admin added:", result.insertedId);

    return res.json({ Status: true, message: "Super Admin registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ Status: false, Error: "Internal server error" });
  }
});
/* ===========================
   ✅ Forgot Password API (Fixed)
=========================== */
router.post("/superadmin/forgotpassword", async (req, res) => {
  try {
    const { email, dob, newPassword } = req.body;

    if (!email || !dob || !newPassword) {
      return res.status(400).json({ Status: false, Error: "Email, DOB, and new password are required" });
    }

    const collection = db.collection("superadmin");

    // Convert DOB to string to ensure consistent format
    const superAdmin = await collection.findOne({ email, dob: dob.toString() });

    if (!superAdmin) {
      return res.status(404).json({ Status: false, Error: "Super Admin not found or DOB mismatch" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Secure password update with both email and dob
    const updateResult = await collection.updateOne(
      { email, dob: dob.toString() },
      { $set: { password: hashedPassword } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({ Status: false, Error: "Failed to update password. Please try again." });
    }

    return res.json({ Status: true, message: "✅ Password reset successfully!" });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ Status: false, Error: "⚠️ Internal server error" });
  }
});


/* ===========================
   ✅ Super Admin Logout API
=========================== */
router.get("/superadminlogout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true, message: "Logged out successfully" });
});

export default router;
