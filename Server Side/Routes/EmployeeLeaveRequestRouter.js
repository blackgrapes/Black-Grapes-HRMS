import express from 'express';
import { ObjectId } from 'mongodb'; // Import ObjectId
import { db } from '../utils/db.js'; // Assuming db is your MongoDB connection

const router = express.Router();

// Route to create a new leave request
router.post('/leave-requests', async (req, res) => {
  const { type, days, reason } = req.body;

  try {
    // Validate input data
    if (!type || !days || !reason || days <= 0) {
      return res.status(400).json({ error: 'All fields are required, and days must be greater than 0' });
    }

    // Create a new leave request object
    const leaveRequest = {
      type,
      days,
      reason,
      status: 'Pending', // Default status is 'Pending'
      createdAt: new Date(), // Add timestamp
    };

    // Insert the leave request into the collection
    const result = await db.collection('leave_requests').insertOne(leaveRequest);
    console.log('Leave request added:', result.insertedId);

    return res.status(201).json({ message: 'Leave request created successfully', leaveRequestId: result.insertedId });
  } catch (err) {
    console.error('Error creating leave request:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch all leave requests
router.get('/leave-requests', async (req, res) => {
  try {
    const leaveRequests = await db.collection('leave_requests').find({}).toArray(); // Convert cursor to array
    console.log('Fetching leave requests...');
    res.status(200).json({ leaveRequests });
  } catch (err) {
    console.error('Error fetching leave requests:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to approve a leave request
router.put('/leave-requests/:id/approve', async (req, res) => {
  const { id } = req.params;

  try {
    // Validate input
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid leave request ID' });
    }

    // Update the leave request status to 'Approved'
    const result = await db.collection('leave_requests').updateOne(
      { _id: new ObjectId(id) }, // Match by ID
      { $set: { status: 'Approved' } } // Update status
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    console.log('Leave request approved:', id);
    res.status(200).json({ message: 'Leave request approved successfully' });
  } catch (err) {
    console.error('Error approving leave request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to reject a leave request
router.put('/leave-requests/:id/reject', async (req, res) => {
  const { id } = req.params;

  try {
    // Validate input
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid leave request ID' });
    }

    // Update the leave request status to 'Rejected'
    const result = await db.collection('leave_requests').updateOne(
      { _id: new ObjectId(id) }, // Match by ID
      { $set: { status: 'Rejected' } } // Update status
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    console.log('Leave request rejected:', id);
    res.status(200).json({ message: 'Leave request rejected successfully' });
  } catch (err) {
    console.error('Error rejecting leave request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
