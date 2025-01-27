import express from 'express';
import multer from 'multer';
import path from 'path';
import { ObjectId } from 'mongodb'; // Import ObjectId to handle MongoDB IDs
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

// Route to add a new employee
router.post("/add_employee", async (req, res) => {
  const { name, email, salary, address, phone, designation, manager, dob, joiningDate } = req.body;

  try {
    // Validate input data
    if (!name || !email || !salary || !address || !phone || !designation || !manager || !dob || !joiningDate) {
      return res.status(400).json({ Error: "All fields are required" });
    }

    // Check if the employee already exists
    const existingEmployee = await db.collection("employees_detail").findOne({ email });
    if (existingEmployee) {
      return res.status(409).json({ message: "Employee already exists" });
    }

    // Create an employee object
    const employeeData = {
      name,
      email,
      salary,
      address,
      phone,
      designation,
      manager,
      dob,
      joiningDate,
      image: req.file ? req.file.filename : null, // Save image filename if uploaded
    };

    // Insert employee data into the collection
    const result = await db.collection("employees_detail").insertOne(employeeData);
    console.log("Employee added:", result.insertedId);

    return res.status(200).json({ message: "Employee added successfully", employeeId: result.insertedId });
  } catch (err) {
    console.error("Error adding employee:", err);
    return res.status(500).json({ Error: "Internal server error" });
  }
});

// Route to fetch all employees
router.get('/all', async (req, res) => {
  try {
    const employees = await db.collection("employees_detail").find({}).toArray(); // Convert cursor to array
    console.log('Fetching employees...');
    if (employees.length === 0) {
      return res.status(404).json({ Error: 'No employees found' });
    }
    res.json({ Result: employees });
  } catch (err) {
    console.error('Error fetching employees:', err.message);
    res.status(500).json({ Error: 'Server error' });
  }
});

// New Route: Fetch employee by  email
router.get('/employee', async (req, res) => {
  const { email } = req.query; // Extract query parameters

  try {
    // Validate input
    if (!email) {
      return res.status(400).json({ Error: 'Email is required' });
    }

    // Fetch employee data from the collection
    const employee = await db.collection("employees_detail").findOne({email});

    if (!employee) {
      return res.status(404).json({ Error: 'Employee not found' });
    }

    res.status(200).json({ Result: employee });
  } catch (err) {
    console.error('Error fetching employee:', err.message);
    res.status(500).json({ Error: 'Internal server error' });
  }
});


// Route to update employee details
router.put('/update_employee/:email', async (req, res) => {
  const { email } = req.params; // Extract email from the request parameters
  const { address, phone, designation } = req.body; // Get updated fields from the request body

  try {
    // Validate email
    if (!email) {
      return res.status(400).json({ Error: 'Email is required' });
    }

    // Prepare update data
    const updateData = {};
    if (address) updateData.address = address;
    if (phone) updateData.phone = phone;
    if (designation) updateData.designation = designation;

    // Ensure there are fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ Error: 'No fields to update' });
    }

    // Update the employee in the collection
    const result = await db.collection('employees_detail').updateOne(
      { email }, // Match by email
      { $set: updateData } // Update only the provided fields
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ Error: 'Employee not found' });
    }

    console.log('Employee updated:', email);
    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (err) {
    console.error('Error updating employee:', err.message);
    res.status(500).json({ Error: 'Internal server error' });
  }
});





export default router;

