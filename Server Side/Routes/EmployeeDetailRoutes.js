const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

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

const Employee = mongoose.model('Employee', employeeSchema);

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

module.exports = router;
