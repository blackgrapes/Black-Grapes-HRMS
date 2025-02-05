import express from "express";
import { db } from "../utils/db.js";

const router = express.Router();

router.get("/attendance-with-details", async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    // Fetch all employees
    const employees = await db.collection("employees_detail").find().toArray();

    // Fetch all attendance records
    const attendanceData = await db.collection("attendance").find().toArray();

    // Fetch all approved leave requests for today
    const leaveData = await db
      .collection("leave_requests")
      .find({
        status: "Approved",
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate },
      })
      .toArray();

    // Array to store new attendance entries for employees on leave
    const newAttendanceEntries = [];

    // Process each employee
    const mergedData = employees.map((employee) => {
      // Get attendance records for this employee
      let attendanceRecords = attendanceData.filter(
        (a) => a.employeeEmail === employee.email
      );

      // Check if employee is on approved leave today
      const isOnLeave = leaveData.some(
        (leave) => leave.email === employee.email
      );

      // Check if an attendance record exists for today
      const hasAttendanceToday = attendanceRecords.some(
        (record) => record.date === currentDate
      );

      if (isOnLeave) {
        if (hasAttendanceToday) {
          // Update existing attendance record to "On Leave"
          db.collection("attendance").updateOne(
            { employeeEmail: employee.email, date: currentDate },
            { $set: { status: "On Leave" } }
          );
        } else {
          // Create new attendance record for leave
          const newAttendance = {
            employeeEmail: employee.email,
            date: currentDate,
            status: "On Leave",
            createdAt: new Date(),
          };
          newAttendanceEntries.push(newAttendance);
          attendanceRecords.push(newAttendance); // Add it to the response structure
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

    // Insert new attendance records into the database
    if (newAttendanceEntries.length > 0) {
      await db.collection("attendance").insertMany(newAttendanceEntries);
    }

    res.status(200).json(mergedData);
  } catch (error) {
    console.error("Error fetching attendance with details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to add or update attendance
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

    const existingAttendance = await db
      .collection("attendance")
      .findOne({ employeeEmail, date });
    if (existingAttendance) {
      await db
        .collection("attendance")
        .updateOne({ employeeEmail, date }, { $set: { status } });
      return res
        .status(200)
        .json({ message: "Attendance updated successfully" });
    } else {
      await db
        .collection("attendance")
        .insertOne({ employeeEmail, date, status });
      return res.status(200).json({ message: "Attendance added successfully" });
    }
  } catch (err) {
    console.error("Error updating attendance:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get attendance for a specific employee
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
        date: { $gte: fromDate, $lte: toDate }, // MongoDB query to filter by date range
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
