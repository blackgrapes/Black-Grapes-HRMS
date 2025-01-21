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
  const { name, email, password, salary, address, phone, designation, image } = req.body;

  try {
    // Validate input data
    if (!name || !email || !password || !salary || !address || !phone || !designation) {
      return res.status(400).json({ Error: "All fields are required" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create an employee object
    const employeeData = {
      name,
      email,
      password: hashedPassword,
      salary,
      address,
      phone,
      designation,
      image,
    };

    // Access the 'employees' collection
    const collection = db.collection("employees_detail");

    // Insert employee data into the collection
    const result = await collection.insertOne(employeeData);

    console.log("Employee added:", result.insertedId);

    return res.json({ message: "Employee added successfully", employeeId: result.insertedId });
  } catch (err) {
    console.error("Error adding employee:", err);
    return res.status(500).json({ Error: "Internal server error" });
  }
});


// Employee Model
const employeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  salary: String,
  address: String,
  designation: String,
  image: String, // Store the image URL or path
});

const Employee = mongoose.model('Employee_detail', employeeSchema);

// Get employee by ID
router.get('/employee/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ Error: 'Employee not found' });
    res.json({ Result: [employee] });
  } catch (err) {
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
