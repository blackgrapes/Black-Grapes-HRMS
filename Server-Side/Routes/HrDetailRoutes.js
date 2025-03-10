import express from 'express';
import multer from 'multer';
import path from 'path';
import { db } from "../utils/db.js"; // Assuming db is your MongoDB connection

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploaded images to the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp + file extension for unique filenames
  },
});
const upload = multer({ storage });

const router = express.Router();

// Route to add a new HR
router.post("/add_hr", upload.single('image'), async (req, res) => {
  const { name, email, phone, dob, joiningDate, address, department } = req.body;

  try {
    // Validate input data
    if (!name || !email || !phone || !dob || !joiningDate || !address || !department) {
      return res.status(400).json({ Error: "All fields are required" });
    }

    // Check if the HR already exists
    const existingHR = await db.collection("hr_detail").findOne({ email });
    if (existingHR) {
      return res.status(409).json({ message: "HR already exists" });
    }

    // Create an HR object
    const hrData = {
      name,
      email,
      phone,
      dob,
      joiningDate,
      address,        // Save address
      department,     // Save department
      image: req.file ? req.file.filename : null, // Save image filename if uploaded
    };

    // Insert HR data into the collection
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
    const hrRecords = await db.collection("hr_detail").find({}).toArray(); // Convert cursor to array
    console.log('Fetching HR records...');
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
  const { email } = req.query; // Extract query parameters

  try {
    // Validate input
    if (!email) {
      return res.status(400).json({ Error: 'Email is required' });
    }

    // Fetch HR data from the collection
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
  const { email } = req.params; // Extract email from the request parameters
  const { phone, address, } = req.body; // Get updated fields from the request body
  const profilePicture = req.file ? req.file.filename : null; // Handle profile picture upload

  try {
    // Validate email
    if (!email) {
      return res.status(400).json({ Error: 'Email is required' });
    }

    // Prepare update data
    const updateData = {};
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (profilePicture) updateData.image = profilePicture; // Update profile picture

    // Ensure there are fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ Error: 'No fields to update' });
    }

    // Update the HR in the collection
    const result = await db.collection('hr_detail').updateOne(
      { email }, // Match by email
      { $set: updateData } // Update only the provided fields
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

router.delete('/delete_hr/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Validate email
    if (!email) {
      return res.status(400).json({ Error: 'Email is required' });
    }

    // Find the HR to get the image filename
    const hr = await db.collection("hr_detail").findOne({ email });

    if (!hr) {
      return res.status(404).json({ Error: 'HR not found' });
    }

    // Delete the HR record from the database
    const result = await db.collection("hr_detail").deleteOne({ email });

    if (result.deletedCount === 0) {
      return res.status(404).json({ Error: 'HR not found or already deleted' });
    }

    // If there's an image associated with the HR, delete it from the "uploads" folder
    if (hr.image) {
      const imagePath = path.join('uploads', hr.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
        } else {
          console.log('Image deleted successfully:', hr.image);
        }
      });
    }

    console.log('HR deleted:', email);
    res.status(200).json({ message: 'HR deleted successfully' });
  } catch (err) {
    console.error('Error deleting HR:', err.message);
    res.status(500).json({ Error: 'Internal server error' });
  }
});

export default router;
