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

// Route to edit an employee
router.put('/edit_employee/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, email, phone, salary, address, designation } = req.body;
    const updatedEmployee = { name, email, phone, salary, address, designation };

    // Handle image upload
    if (req.file) {
      updatedEmployee.image = req.file.path; // Save the file path
    }

    const result = await db.collection("employees_detail").updateOne(
      { _id: new mongoose.Types.ObjectId(req.params.id) }, // Match employee by ID
      { $set: updatedEmployee }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ Error: 'Employee not found' });
    }

    res.json({ Status: true, Message: 'Employee updated successfully' });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ Error: 'Server error' });
  }
});

export default router;
