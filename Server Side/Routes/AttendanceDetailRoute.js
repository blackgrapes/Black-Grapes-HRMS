import express from "express";
import { db } from "../utils/db.js";

const router = express.Router();

// Fetch attendance with employee details
router.get("/attendance-with-details", async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

    // Fetch employees, attendance, and approved leave requests
    const employees = await db.collection("employees_detail").find().toArray();
    const attendanceData = await db.collection("attendance").find().toArray();
    const leaveData = await db
      .collection("leave_requests")
      .find({
        status: "Approved",
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate },
      })
      .toArray();

    const newAttendanceEntries = [];

    // Process employee attendance
    const mergedData = employees.map((employee) => {
      const attendanceRecords = attendanceData.filter(
        (a) => a.employeeEmail === employee.email
      );

      const isOnLeave = leaveData.some(
        (leave) => leave.email === employee.email
      );

      const hasAttendanceToday = attendanceRecords.some(
        (record) => record.date === currentDate
      );

      if (isOnLeave) {
        if (hasAttendanceToday) {
          db.collection("attendance").updateOne(
            { employeeEmail: employee.email, date: currentDate },
            { $set: { status: "On Leave" } }
          );
        } else {
          const newAttendance = {
            employeeEmail: employee.email,
            date: currentDate,
            status: "On Leave",
            createdAt: new Date(),
          };
          newAttendanceEntries.push(newAttendance);
          attendanceRecords.push(newAttendance);
        }
      }

      return {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        attendance: attendanceRecords.map((record) => ({
          date: record.date,
          status: record.status,
        })),
      };
    });

    if (newAttendanceEntries.length > 0) {
      await db.collection("attendance").insertMany(newAttendanceEntries);
    }

    res.status(200).json(mergedData);
  } catch (error) {
    console.error("Error fetching attendance with details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add or update attendance
router.post("/attendance", async (req, res) => {
  const { employeeEmail, date, status } = req.body;

  try {
    if (!employeeEmail || !date || !status) {
      return res
        .status(400)
        .json({ error: "Employee email, date, and status are required" });
    }

    const employee = await db
      .collection("employees_detail")
      .findOne({ email: employeeEmail });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Upsert (update if exists, insert if not)
    await db
      .collection("attendance")
      .updateOne(
        { employeeEmail, date },
        { $set: { status } },
        { upsert: true }
      );

    res.status(200).json({ message: "Attendance updated successfully" });
  } catch (err) {
    console.error("Error updating attendance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get attendance for a specific employee within a date range
router.get("/attendance", async (req, res) => {
  const { employeeEmail, fromDate, toDate } = req.query;

  if (!employeeEmail || !fromDate || !toDate) {
    return res
      .status(400)
      .json({ error: "Employee email and date range are required" });
  }

  try {
    const attendanceRecords = await db
      .collection("attendance")
      .find({
        employeeEmail,
        date: { $gte: fromDate, $lte: toDate },
      })
      .toArray();

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ error: "No attendance records found." });
    }

    res.status(200).json({ result: attendanceRecords });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
