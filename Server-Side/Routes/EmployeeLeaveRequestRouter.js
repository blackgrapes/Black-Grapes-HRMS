import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../utils/db.js";

const router = express.Router();

// ✅ Utility Function: Initialize or Reset Leave Balance
const initializeOrUpdateLeaveBalance = async (employee, email) => {
  const currentYear = new Date().getFullYear();

  if (!employee.leaveBalance) {
    employee.leaveBalance = { year: currentYear, paidLeavesRemaining: 30 };
    await db.collection("employees_detail").updateOne(
      { email },
      { $set: { leaveBalance: employee.leaveBalance } }
    );
  } else if (employee.leaveBalance.year < currentYear) {
    employee.leaveBalance = { year: currentYear, paidLeavesRemaining: 30 };
    await db.collection("employees_detail").updateOne(
      { email },
      { $set: { leaveBalance: employee.leaveBalance } }
    );
  }
  return employee.leaveBalance;
};

// Route to create a new leave request
router.post("/leave-request", async (req, res) => {
  const { email, type, days, reason, startDate } = req.body;

  try {
    if (!type || !days || !reason || days <= 0 || !startDate) {
      return res.status(400).json({
        error: "All fields are required, and days must be greater than 0",
      });
    }

    let employee = await db.collection("employees_detail").findOne({ email });
    if (!employee) {
      // ✅ Auto-create employee if not found
      const newEmployee = {
        email,
        leaveBalance: { year: new Date().getFullYear(), paidLeavesRemaining: 30 },
      };
      await db.collection("employees_detail").insertOne(newEmployee);
      employee = newEmployee;
    }

    // ✅ Initialize or reset leave balance if needed
    await initializeOrUpdateLeaveBalance(employee, email);

    const startDateObj = new Date(startDate);
    startDateObj.setDate(startDateObj.getDate() + (days - 1));
    const endDate = startDateObj.toISOString().split("T")[0];

    const leaveRequest = {
      employeeId: employee._id,
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

    const result = await db.collection("leave_requests").insertOne(leaveRequest);

    return res.status(201).json({
      message: "Leave request created successfully",
      leaveRequestId: result.insertedId,
    });
  } catch (err) {
    console.error("Error creating leave request:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get all leave requests
router.get("/leave-requests", async (req, res) => {
  try {
    const leaveRequests = await db
      .collection("leave_requests")
      .aggregate([
        {
          $lookup: {
            from: "employees_detail",
            localField: "employeeId",
            foreignField: "_id",
            as: "employeeDetails",
          },
        },
        { $unwind: "$employeeDetails" },
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
            "employeeDetails.name": 1,
          },
        },
      ])
      .toArray();

    res.status(200).json({ leaveRequests });
  } catch (err) {
    console.error("Error fetching leave requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get specific employee leave requests using email
router.get("/leave-request/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const leaveRequests = await db
      .collection("leave_requests")
      .find({ email })
      .toArray();

    if (leaveRequests.length === 0) {
      return res
        .status(404)
        .json({ error: "No leave requests found for this employee" });
    }

    res.status(200).json({ leaveRequests });
  } catch (err) {
    console.error("Error fetching leave requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Route to get leave balance
router.get("/leave-balance/:email", async (req, res) => {
  const { email } = req.params;

  try {
    let employee = await db.collection("employees_detail").findOne({ email });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // ✅ Initialize or reset leave balance if needed
    await initializeOrUpdateLeaveBalance(employee, email);

    return res.status(200).json({
      paidLeavesRemaining: employee.leaveBalance.paidLeavesRemaining,
    });
  } catch (err) {
    console.error("Error fetching leave balance:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Route to approve/reject a leave request
router.put("/leave-requests/:id", async (req, res) => {
  const { id } = req.params;
  const { decision } = req.body;

  if (!["approved", "rejected"].includes(decision)) {
    return res
      .status(400)
      .json({ error: 'Invalid decision. Use "approved" or "rejected".' });
  }

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid leave request ID" });
    }

    const leaveRequest = await db
      .collection("leave_requests")
      .findOne({ _id: new ObjectId(id) });

    if (!leaveRequest) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    const employee = await db
      .collection("employees_detail")
      .findOne({ email: leaveRequest.email });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // ✅ Initialize or reset leave balance if needed
    await initializeOrUpdateLeaveBalance(employee, employee.email);

    if (decision === "approved") {
      let paidLeave = 0;
      let unpaidLeave = 0;

      if (employee.leaveBalance.paidLeavesRemaining > 0) {
        paidLeave = Math.min(
          employee.leaveBalance.paidLeavesRemaining,
          leaveRequest.days
        );
        unpaidLeave = leaveRequest.days - paidLeave;
      } else {
        unpaidLeave = leaveRequest.days; // No paid leaves left
      }

      // Deduct paid leaves
      employee.leaveBalance.paidLeavesRemaining = Math.max(
        0,
        employee.leaveBalance.paidLeavesRemaining - paidLeave
      );

      // Update employee leave balance
      await db.collection("employees_detail").updateOne(
        { email: employee.email },
        { $set: { leaveBalance: employee.leaveBalance } }
      );

      // Update leave request with leave details
      await db.collection("leave_requests").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: "Approved",
            paidLeave: paidLeave,
            unpaidLeave: unpaidLeave,
          },
        }
      );

      return res.status(200).json({
        message:
          unpaidLeave > 0
            ? "Leave approved with unpaid days"
            : "Leave request approved successfully",
        leaveRequest: {
          ...leaveRequest,
          status: "Approved",
          paidLeave,
          unpaidLeave,
        },
        unpaidAlert:
          unpaidLeave > 0
            ? "⚠️ Some of the approved leave days are unpaid."
            : null,
      });
    } else {
      // Rejected leave request
      await db.collection("leave_requests").updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "Rejected" } }
      );

      return res
        .status(200)
        .json({ message: "Leave request rejected successfully" });
    }
  } catch (err) {
    console.error("Error updating leave request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
