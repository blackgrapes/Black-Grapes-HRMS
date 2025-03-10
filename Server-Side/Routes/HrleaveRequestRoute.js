import express from "express";
import { db } from "../utils/db.js";

const router = express.Router();

// ✅ Utility Function: Initialize or Reset Leave Balance
const initializeOrUpdateLeaveBalance = async (hr, email) => {
  const currentYear = new Date().getFullYear();

  if (!hr.leaveBalance) {
    hr.leaveBalance = { year: currentYear, paidLeavesRemaining: 30 };
    await db.collection("hr_detail").updateOne(
      { email },
      { $set: { leaveBalance: hr.leaveBalance } }
    );
  } else if (hr.leaveBalance.year < currentYear) {
    hr.leaveBalance = { year: currentYear, paidLeavesRemaining: 30 };
    await db.collection("hr_detail").updateOne(
      { email },
      { $set: { leaveBalance: hr.leaveBalance } }
    );
  }
  return hr.leaveBalance;
};

// Route to create a new leave request for HR
router.post("/hr-leave-request", async (req, res) => {
  const { email, type, days, reason, startDate } = req.body;

  try {
    if (!type || !days || !reason || days <= 0 || !startDate) {
      return res.status(400).json({
        error: "All fields are required, and days must be greater than 0",
      });
    }

    let hr = await db.collection("hr_detail").findOne({ email });
    if (!hr) {
      const newHR = {
        email,
        leaveBalance: { year: new Date().getFullYear(), paidLeavesRemaining: 30 },
      };
      await db.collection("hr_detail").insertOne(newHR);
      hr = newHR;
    }

    await initializeOrUpdateLeaveBalance(hr, email);

    const startDateObj = new Date(startDate);
    startDateObj.setDate(startDateObj.getDate() + (days - 1));
    const endDate = startDateObj.toISOString().split("T")[0];

    const leaveRequest = {
      hrId: hr._id,
      email,
      type,
      days,
      reason,
      startDate,
      endDate,
      paidLeave: 0,
      unpaidLeave: 0,
      status: "Pending",
      createdAt: new Date(),
    };

    const result = await db.collection("hr_leave_requests").insertOne(leaveRequest);

    return res.status(201).json({
      message: "HR leave request created successfully",
      leaveRequestId: result.insertedId,
    });
  } catch (err) {
    console.error("Error creating HR leave request:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get all HR leave requests
router.get("/hr-leave-requests", async (req, res) => {
  try {
    const leaveRequests = await db
      .collection("hr_leave_requests")
      .aggregate([
        {
          $lookup: {
            from: "hr_detail",
            localField: "hrId",
            foreignField: "_id",
            as: "hrDetails",
          },
        },
        { $unwind: "$hrDetails" },
        {
          $project: {
            _id: 1,
            email: 1,
            type: 1,
            days: 1,
            reason: 1,
            startDate: 1,
            endDate: 1,
            status: 1,
            createdAt: 1,
            paidLeave: 1,
            unpaidLeave: 1,
            "hrDetails.name": 1,
          },
        },
      ])
      .toArray();

    res.status(200).json({ leaveRequests });
  } catch (err) {
    console.error("Error fetching HR leave requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get specific HR leave requests using email
router.get("/hr-leave-request/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const leaveRequests = await db
      .collection("hr_leave_requests")
      .find({ email })
      .toArray();

    if (leaveRequests.length === 0) {
      return res.status(404).json({ error: "No leave requests found for this HR" });
    }

    res.status(200).json({ leaveRequests });
  } catch (err) {
    console.error("Error fetching HR leave requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Route to get HR leave balance
router.get("/hr-leave-balance/:email", async (req, res) => {
  const { email } = req.params;

  try {
    let hr = await db.collection("hr_detail").findOne({ email });
    if (!hr) {
      return res.status(404).json({ error: "HR not found" });
    }

    await initializeOrUpdateLeaveBalance(hr, email);

    return res.status(200).json({
      paidLeavesRemaining: hr.leaveBalance.paidLeavesRemaining,
    });
  } catch (err) {
    console.error("Error fetching HR leave balance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
