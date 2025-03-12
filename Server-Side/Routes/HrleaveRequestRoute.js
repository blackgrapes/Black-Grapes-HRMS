import express from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// ✅ Utility Function: Initialize or Reset Leave Balance
const initializeOrUpdateLeaveBalance = async (hr, email) => {
  const currentYear = new Date().getFullYear();

  if (!hr.leaveBalance || hr.leaveBalance.year < currentYear) {
    hr.leaveBalance = { year: currentYear, paidLeavesRemaining: 30 };
    await db.collection("hr_detail").updateOne(
      { email },
      { $set: { leaveBalance: hr.leaveBalance } }
    );
  }
  return hr.leaveBalance;
};

// ✅ Check if leave dates overlap
const isLeaveOverlapping = async (email, startDate, endDate) => {
  const existingLeaves = await db
    .collection("hr_leave_requests")
    .find({ email, status: { $ne: "Rejected" } })
    .toArray();

  return existingLeaves.some((leave) => {
    const requestStart = new Date(leave.startDate);
    const requestEnd = new Date(leave.endDate);
    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);
    return (
      (newStart >= requestStart && newStart <= requestEnd) ||
      (newEnd >= requestStart && newEnd <= requestEnd) ||
      (newStart <= requestStart && newEnd >= requestEnd)
    );
  });
};

// ✅ Route: Create a new leave request
router.post("/leave-request", async (req, res) => {
  const { email, type, days, reason, startDate } = req.body;
  if (!email || !type || !days || !reason || days <= 0 || !startDate) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let hr = await db.collection("hr_detail").findOne({ email });
    if (!hr) {
      return res.status(404).json({ error: "HR not found" });
    }

    await initializeOrUpdateLeaveBalance(hr, email);

    const startDateObj = new Date(startDate);
    startDateObj.setDate(startDateObj.getDate() + (days - 1));
    const endDate = startDateObj.toISOString().split("T")[0];

    if (await isLeaveOverlapping(email, startDate, endDate)) {
      return res.status(409).json({ error: "Leave dates overlap with an existing request" });
    }

    let paidLeave = Math.min(hr.leaveBalance.paidLeavesRemaining, days);
    let unpaidLeave = days - paidLeave;

    await db.collection("hr_detail").updateOne(
      { email },
      { $inc: { "leaveBalance.paidLeavesRemaining": -paidLeave } }
    );

    const leaveRequest = {
      email,
      type,
      days,
      reason,
      startDate,
      endDate,
      paidLeave,
      unpaidLeave,
      status: "Pending",
      createdAt: new Date(),
    };

    const result = await db.collection("hr_leave_requests").insertOne(leaveRequest);
    return res.status(201).json({
      message: "Leave request submitted successfully",
      leaveRequestId: result.insertedId,
    });
  } catch (err) {
    console.error("Error creating leave request:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Route: Get leave requests for a specific HR
router.get("/leave-request/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const leaveRequests = await db.collection("hr_leave_requests").find({ email }).toArray();
    res.status(200).json({ leaveRequests });
  } catch (err) {
    console.error("Error fetching leave requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Route: Get all leave requests
router.get("/leave-requests", async (req, res) => {
  try {
    const leaveRequests = await db.collection("hr_leave_requests").find().toArray();
    res.status(200).json({ leaveRequests });
  } catch (err) {
    console.error("Error fetching all leave requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Route: Get HR leave balance
router.get("/leave-balance/:email", async (req, res) => {
  const { email } = req.params;
  try {
    let hr = await db.collection("hr_detail").findOne({ email });
    if (!hr) {
      return res.status(404).json({ error: "HR not found" });
    }
    await initializeOrUpdateLeaveBalance(hr, email);
    return res.status(200).json({ paidLeavesRemaining: hr.leaveBalance.paidLeavesRemaining });
  } catch (err) {
    console.error("Error fetching leave balance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Route: Approve or Reject Leave Request
router.put("/hr-leave-requests/:email", async (req, res) => {
  const { email } = req.params;
  const { decision } = req.body;

  if (!["Approved", "Rejected"].includes(decision)) {
    return res.status(400).json({ error: "Invalid status update" });
  }

  try {
    const leaveRequest = await db.collection("hr_leave_requests").findOne({ email, status: "Pending" });
    if (!leaveRequest) {
      return res.status(404).json({ error: "Pending leave request not found" });
    }

    if (decision === "Rejected") {
      await db.collection("hr_detail").updateOne(
        { email },
        { $inc: { "leaveBalance.paidLeavesRemaining": leaveRequest.paidLeave } }
      );
    }

    await db.collection("hr_leave_requests").updateOne(
      { email, status: "Pending" },
      { $set: { status: decision } }
    );

    return res.status(200).json({ message: `Leave request ${decision.toLowerCase()} successfully` });
  } catch (err) {
    console.error("Error updating leave request status:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
