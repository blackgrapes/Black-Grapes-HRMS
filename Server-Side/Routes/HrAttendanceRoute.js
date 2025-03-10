import express from "express";
import { db } from "../utils/db.js";

const router = express.Router();

// ✅ Fetch attendance with HR details (Modified)
router.get("/hr-attendance-with-details", async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

    // Fetch HR details, attendance, and approved leave requests
    const hrList = await db.collection("hr_detail").find().toArray();
    const attendanceData = await db.collection("hr_attendance").find().toArray();
    const leaveData = await db
      .collection("hr_leave_requests")
      .find({
        status: "Approved",
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate },
      })
      .toArray();

    const newAttendanceEntries = [];

    // ✅ Process HR attendance
    const mergedData = hrList.map((hr) => {
      const attendanceRecords = attendanceData.filter(
        (a) => a.hrEmail === hr.email
      );

      const approvedLeave = leaveData.find(
        (leave) => leave.email === hr.email
      );

      const hasAttendanceToday = attendanceRecords.some(
        (record) => record.date === currentDate
      );

      if (approvedLeave) {
        const leaveStatus =
          approvedLeave.paidLeave > 0 ? "Paid Leave" : "Unpaid Leave";

        if (hasAttendanceToday) {
          // ✅ Update existing attendance record
          db.collection("hr_attendance").updateOne(
            { hrEmail: hr.email, date: currentDate },
            { $set: { status: leaveStatus } }
          );
        } else {
          // ✅ Insert new attendance record for leave
          const newAttendance = {
            hrEmail: hr.email,
            date: currentDate,
            status: leaveStatus,
            createdAt: new Date(),
          };
          newAttendanceEntries.push(newAttendance);
          attendanceRecords.push(newAttendance);
        }
      }

      return {
        _id: hr._id,
        name: hr.name,
        email: hr.email,
        department: hr.department,
        attendance: attendanceRecords.map((record) => ({
          date: record.date,
          status: record.status,
        })),
      };
    });

    // ✅ Insert any new attendance records
    if (newAttendanceEntries.length > 0) {
      await db.collection("hr_attendance").insertMany(newAttendanceEntries);
    }

    res.status(200).json(mergedData);
  } catch (error) {
    console.error("Error fetching HR attendance with details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add or update HR attendance
router.post("/hr-attendance", async (req, res) => {
  const { hrEmail, date, status } = req.body;

  try {
    if (!hrEmail || !date || !status) {
      return res
        .status(400)
        .json({ error: "HR email, date, and status are required" });
    }

    const hr = await db.collection("hr_detail").findOne({ email: hrEmail });

    if (!hr) {
      return res.status(404).json({ error: "HR not found" });
    }

    // Upsert (update if exists, insert if not)
    await db
      .collection("hr_attendance")
      .updateOne(
        { hrEmail, date },
        { $set: { status } },
        { upsert: true }
      );

    res.status(200).json({ message: "HR Attendance updated successfully" });
  } catch (err) {
    console.error("Error updating HR attendance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get attendance for a specific HR within a date range
router.get("/hr-attendance", async (req, res) => {
  const { hrEmail, fromDate, toDate } = req.query;

  if (!hrEmail || !fromDate || !toDate) {
    return res
      .status(400)
      .json({ error: "HR email and date range are required" });
  }

  try {
    const attendanceRecords = await db
      .collection("hr_attendance")
      .find({
        hrEmail,
        date: { $gte: fromDate, $lte: toDate },
      })
      .toArray();

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ error: "No attendance records found." });
    }

    res.status(200).json({ result: attendanceRecords });
  } catch (err) {
    console.error("Error fetching HR attendance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
