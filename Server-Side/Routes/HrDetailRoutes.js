import express from 'express';
import multer from 'multer';
import path from 'path';
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb"; // ✅ Import ObjectId from MongoDB

const router = express.Router();

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploaded images to the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// Route to add a new HR
router.post("/add_hr", upload.single('image'), async (req, res) => {
  const { name, email, phone, dob, joiningDate, address, department } = req.body;

  try {
    if (!name || !email || !phone || !dob || !joiningDate || !address || !department) {
      return res.status(400).json({ Error: "All fields are required" });
    }

    const existingHR = await db.collection("hr_detail").findOne({ email });
    if (existingHR) {
      return res.status(409).json({ message: "HR already exists" });
    }

    const hrData = {
      name, email, phone, dob, joiningDate, address, department,
      image: req.file ? req.file.filename : null,
    };

    const result = await db.collection("hr_detail").insertOne(hrData);
    console.log("HR added:", result.insertedId);

    return res.status(200).json({ message: "HR added successfully", hrId: result.insertedId });
  } catch (err) {
    console.error("Error adding HR:", err);
    return res.status(500).json({ Error: "Internal server error" });
  }
});

// Route to fetch all HR records
router.get('/all', async (req, res) => {
  try {
    const hrRecords = await db.collection("hr_detail").find({}).toArray();
    if (hrRecords.length === 0) {
      return res.status(404).json({ Error: 'No HR records found' });
    }
    res.json({ Result: hrRecords });
  } catch (err) {
    console.error('Error fetching HR records:', err.message);
    res.status(500).json({ Error: 'Server error' });
  }
});

// Route to fetch HR by email
router.get('/hr', async (req, res) => {
  const { email } = req.query;

  try {
    if (!email) {
      return res.status(400).json({ Error: 'Email is required' });
    }

    const hr = await db.collection("hr_detail").findOne({ email });
    if (!hr) {
      return res.status(404).json({ Error: 'HR not found' });
    }

    res.status(200).json({ Result: hr });
  } catch (err) {
    console.error('Error fetching HR:', err.message);
    res.status(500).json({ Error: 'Internal server error' });
  }
});

// Route to update HR details
router.put('/update_hr/:email', upload.single('profilePicture'), async (req, res) => {
  const { email } = req.params;
  const { phone, address } = req.body;
  const profilePicture = req.file ? req.file.filename : null;

  try {
    if (!email) {
      return res.status(400).json({ Error: 'Email is required' });
    }

    const updateData = {};
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (profilePicture) updateData.image = profilePicture;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ Error: 'No fields to update' });
    }

    const result = await db.collection('hr_detail').updateOne(
      { email },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ Error: 'HR not found' });
    }

    console.log('HR updated:', email);
    res.status(200).json({ message: 'HR updated successfully' });
  } catch (err) {
    console.error('Error updating HR:', err.message);
    res.status(500).json({ Error: 'Internal server error' });
  }
});

// Route to delete HR
router.delete('/delete_hr/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ Error: 'Invalid HR ID' });
    }

    const objectId = new ObjectId(id);
    const hr = await db.collection("hr_detail").findOne({ _id: objectId });

    if (!hr) {
      return res.status(404).json({ Error: 'HR not found' });
    }

    const result = await db.collection("hr_detail").deleteOne({ _id: objectId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ Error: 'HR not found or already deleted' });
    }

    console.log('HR deleted:', id);
    res.status(200).json({ message: 'HR deleted successfully' });
  } catch (err) {
    console.error('Error deleting HR:', err.message);
    res.status(500).json({ Error: 'Internal server error' });
  }
});

export default router;