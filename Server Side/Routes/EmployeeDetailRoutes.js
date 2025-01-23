import express from 'express';
import multer from 'multer';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { db } from "../utils/db.js";

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/add_employee", async (req, res) => {
  const { name, email, salary, address, phone, designation, image, manager, dob, joiningDate } = req.body;

  try {
    // Validate input data
    if (!name || !email || !salary || !address || !phone || !designation || !manager || !dob || !joiningDate) {
      return res.status(400).json({ Error: "All fields are required" });
    }

    // Access the 'employees' collection
    const collection = db.collection("employees_detail");

    // Check if the employee already exists
    const user = await collection.findOne({ email });
    if (user) {
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
      image,
      manager,
      dob,
      joiningDate,
    };

    // Insert employee data into the collection
    const result = await collection.insertOne(employeeData);

    console.log("Employee added:", result.insertedId);

    return res.status(200).json({ message: "Employee added successfully", employeeId: result.insertedId });
  } catch (err) {
    console.error("Error adding employee:", err);
    return res.status(500).json({ Error: "Internal server error" });
  }
});

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  salary: { type: String, required: true },
  address: { type: String, required: true },
  designation: { type: String, required: true },
  image: { type: String }, // Store the image URL or path
  manager: { type: String, required: true },
  dob: { type: Date, required: true },
  joiningDate: { type: Date, required: true },
});



const Employee = mongoose.model('employees_detail', employeeSchema);

// Get employee by ID
router.get('/all', async (req, res) => {
  const collection = db.collection("employees_detail");
  try {
    const employes = await collection.find();
    console.log('Fetching employees...');
    if (employes.length === 0) {
      return res.status(404).json({ Error: 'No employees found' });
    }
    res.json({ Result: employes });
  } catch (err) {
    // Log only the error message to avoid circular structure issues
    console.error('Error fetching employees:', err.message);

    // Send a generic error message to the client
    res.status(500).json({ Error: 'Server error' });
  }
});


// Edit employee
router.put('/edit_employee/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, email, phone, salary, address, designation } = req.body;
    const updatedEmployee = {
      name,
      email,
      phone,
      salary,
      address,
      designation,
    };

    // Handle image upload
    if (req.file) {
      updatedEmployee.image = req.file.path; // Save the file path
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updatedEmployee,
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ Error: 'Employee not found' });
    }

    res.json({ Status: true, Message: 'Employee updated successfully' });
  } catch (err) {
    res.status(500).json({ Error: 'Server error' });
  }
});

export default router;
