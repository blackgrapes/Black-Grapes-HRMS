import express from "express";
import { ObjectId } from "mongodb"; // Import ObjectId
import { db } from "../utils/db.js"; // Assuming db is your MongoDB connection

const router = express.Router();

// Route to create a new leave request
router.post("/leave-request", async (req, res) => {
  const { email, type, days, reason, startDate } = req.body;

  try {
    // Validate input data
    if (!type || !days || !reason || days <= 0 || !startDate) {
      return res.status(400).json({
        error: "All fields are required, and days must be greater than 0",
      });
    }

    // Step 1: Find Employee by Email
    const employee = await db.collection("employees_detail").findOne({ email });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Calculate end date
    const startDateObj = new Date(startDate);
    startDateObj.setDate(startDateObj.getDate() + (days - 1));
    const endDate = startDateObj.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    // Step 2: Create Leave Request with Employee ID Reference
    const leaveRequest = {
      employeeId: employee._id, // Store the ObjectId reference
      email, // Keep email for easy lookup
      type,
      days,
      reason,
      startDate, // Added start date
      endDate, // Added end date
      status: "Pending", // Default status
      createdAt: new Date(),
    };

    // Step 3: Insert the Leave Request
    const result = await db.collection("leave_requests").insertOne(leaveRequest);
    console.log("Leave request added:", result.insertedId);

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
            from: "employees_detail", // The collection to join
            localField: "employeeId", // Field in leave_requests
            foreignField: "_id", // Field in employees_detail
            as: "employeeDetails", // Alias for joined data
          },
        },
        { $unwind: "$employeeDetails" }, // Convert array to object
        {
          $project: {
            _id: 1,
            email: 1, 
            type: 1,
            days: 1,
            reason: 1,
            startDate: 1, // Include start date
            endDate: 1, // Include end date
            status: 1,
            createdAt: 1,
            "employeeDetails.name": 1, // Include employee name
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
      .find({ email }) // Filter by email
      .toArray();

    if (leaveRequests.length === 0) {
      return res.status(404).json({ error: "No leave requests found for this employee" });
    }

    res.status(200).json({ leaveRequests });
  } catch (err) {
    console.error("Error fetching leave requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Route to approve a leave request
router.put('/leave-requests/:id', async (req, res) => {
  const { id } = req.params;
  const{ decision } = req.body;
  console.log(id,decision)


  // Validate decision parameter
  if (!['approved', 'rejected'].includes(decision)) {
    return res.status(400).json({ error: 'Invalid decision. Use "approve" or "reject".' });
  }

  try {
    // Validate the ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid leave request ID' });
    }

    // Determine the status based on the decision
    const status = decision.charAt(0).toUpperCase() + decision.slice(1); // Capitalize the first letter (approve/reject)

    // Update the leave request status based on the decision
    const result = await db.collection('leave_requests').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    // Fetch the updated leave request
    const updatedRequest = await db.collection('leave_requests').findOne({ _id: new ObjectId(id) });

    // Return the updated leave request
    res.status(200).json({ message: `Leave request ${status.toLowerCase()}d successfully`, leaveRequest: updatedRequest });
  } catch (err) {
    console.error(`Error ${decision} leave request:`, err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




export default router;
