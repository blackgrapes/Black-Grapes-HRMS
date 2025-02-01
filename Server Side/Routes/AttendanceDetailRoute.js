import express from 'express';
import { db } from "../utils/db.js"; // MongoDB connection

const router = express.Router();

// Route to add or update attendance
router.post("/attendance", async (req, res) => {
  const { employeeEmail, date, status } = req.body;

  try {
    // Validate input data
    if (!employeeEmail || !date || !status) {
      return res.status(400).json({ Error: "Employee email, date, and status are required" });
    }

    // Check if the employee exists
    const employee = await db.collection("employees_detail").findOne({ email: employeeEmail });
    if (!employee) {
      return res.status(404).json({ Error: "Employee not found" });
    }

    // Insert or update attendance record for the employee
    const attendanceData = {
      employeeEmail,
      date,
      status, // Can be 'Present' or 'Absent'
    };

    const existingAttendance = await db.collection("attendance").findOne({ employeeEmail, date });
    if (existingAttendance) {
      // Update existing attendance record if it exists
      const result = await db.collection("attendance").updateOne(
        { employeeEmail, date },
        { $set: { status } }
      );
      return res.status(200).json({ message: "Attendance updated successfully" });
    } else {
      // Insert new attendance record if it doesn't exist
      const result = await db.collection("attendance").insertOne(attendanceData);
      return res.status(200).json({ message: "Attendance added successfully" });
    }

  } catch (err) {
    console.error("Error updating attendance:", err);
    return res.status(500).json({ Error: "Internal server error" });
  }
});

// Route to get attendance for a specific employee
router.get("/attendance", async (req, res) => {
  const { employeeEmail, date } = req.query;

  try {
    // Validate input data
    if (!employeeEmail || !date) {
      return res.status(400).json({ Error: "Employee email and date are required" });
    }

    // Fetch attendance record for the employee
    const attendance = await db.collection("attendance").findOne({ employeeEmail, date });

    if (!attendance) {
      return res.status(404).json({ Error: "Attendance record not found" });
    }

    res.status(200).json({ Result: attendance });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    return res.status(500).json({ Error: "Internal server error" });
  }
});

// Route to fetch all attendance records for a specific date
router.get("/attendance_by_date", async (req, res) => {
  const { date } = req.query;

  try {
    if (!date) {
      return res.status(400).json({ Error: "Date is required" });
    }

    const attendanceRecords = await db.collection("attendance").find({ date }).toArray();

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ Error: "No attendance records found for this date" });
    }

    res.status(200).json({ Result: attendanceRecords });
  } catch (err) {
    console.error("Error fetching attendance by date:", err);
    return res.status(500).json({ Error: "Internal server error" });
  }
});

export default router;
