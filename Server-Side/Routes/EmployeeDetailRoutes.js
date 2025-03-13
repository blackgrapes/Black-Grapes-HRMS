import express from 'express';
import multer from 'multer';
import path from 'path';
import { ObjectId } from 'mongodb';
import { db } from "../utils/db.js";

const router = express.Router();

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Updated Companies (Roles Removed, Departments Modified)
const companies = {
  "Black Grapes Group": {
    departments: [
      "Accounting",
      "Finance",
      "Marketing",
      "IT Support",
      "Education Service",
      "E-Commerce Solution",
      "Social Media Marketing",
      "Government Training Program",
      "Operations",
    ],
  },
  "Black Grapes Softech": {
    departments: ["Senior Project Manager", "Project Manager", "Senior Developer", "Developer", "Intern"],
  },
  "Black Grapes Associate": {
    departments: ["Management", "Business Development", "Associates"],
  },
  "Black Grapes Real Estate": {
    departments: ["Manager", "Executive"],
  },
  "Black Grapes Valuers & Engineers": {
    departments: ["Manager", "Executive", "Back Office"],
  },
  "Black Grapes Investment & Securities": {
    departments: ["Portfolio Manager", "Executive"],
  },
  "Black Grapes Insurance Surveyors & Loss Assessors Pvt. Ltd.": {
    departments: ["Manager", "Executive", "Back Office"],
  },
};

// ✅ Add Employee Route (unchanged except for dynamic department validation)
router.post("/add_employee", upload.single('image'), async (req, res) => {
  const { name, email, address, phone, department, manager, dob, joiningDate, company } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    if (!name || !email || !phone || !manager || !dob || !joiningDate || !department || !company) {
      return res.status(400).json({ Error: "All fields are required" });
    }

    // ✅ Department validation based on the updated company structure
    if (!companies[company] || !companies[company].departments.includes(department)) {
      return res.status(400).json({ Error: "Invalid department for the selected company" });
    }

    const existingEmployee = await db.collection("employees_detail").findOne({ email });
    if (existingEmployee) {
      return res.status(409).json({ message: "Employee already exists" });
    }

    const employeeData = {
      name,
      email,
      address,
      phone,
      department,
      manager,
      dob,
      joiningDate,
      company,
      createdAt: new Date(),
      image,
    };

    const employeeResult = await db.collection("employees_detail").insertOne(employeeData);
    console.log("Employee added:", employeeResult.insertedId);

    return res.status(200).json({
      message: "Employee added successfully",
      employeeId: employeeResult.insertedId,
    });
  } catch (err) {
    console.error("Error adding employee:", err);
    return res.status(500).json({ Error: "Internal server error" });
  }
});

// ✅ Fetch All Employees (unchanged)
router.get('/all', async (req, res) => {
  try {
    const employees = await db.collection("employees_detail").find({}).sort({ createdAt: -1 }).toArray();
    if (employees.length === 0) {
      return res.status(404).json({ Error: 'No employees found' });
    }
    res.json({ Result: employees });
  } catch (err) {
    console.error('Error fetching employees:', err.message);
    res.status(500).json({ Error: 'Server error' });
  }
});

// ✅ Fetch Employee by Email (unchanged)
router.get('/employee', async (req, res) => {
  const { email } = req.query;

  try {
    if (!email) {
      return res.status(400).json({ Error: 'Email is required' });
    }

    const employee = await db.collection("employees_detail").findOne({ email });
    if (!employee) {
      return res.status(404).json({ Error: 'Employee not found' });
    }

    res.status(200).json({ Result: employee });
  } catch (err) {
    console.error('Error fetching employee:', err.message);
    res.status(500).json({ Error: 'Internal server error' });
  }
});

// ✅ Update Employee Details (unchanged except for dynamic department validation)
router.put('/update_employee/:email', async (req, res) => {
  const { email } = req.params;
  const { address, phone,department, company } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ Error: 'Email is required' });
    }

    const updateData = {};
    if (address) updateData.address = address;
    if (phone) updateData.phone = phone;
    if (company) updateData.company = company;

    // ✅ Validate department only if provided
    if (department) {
      if (!companies[company] || !companies[company].departments.includes(department)) {
        return res.status(400).json({ Error: "Invalid department for the selected company" });
      }
      updateData.department = department;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ Error: 'No fields to update' });
    }

    const result = await db.collection('employees_detail').updateOne(
      { email },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ Error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (err) {
    console.error('Error updating employee:', err.message);
    res.status(500).json({ Error: 'Internal server error' });
  }
});

// ✅ Fetch Companies with Updated Departments (unchanged)
router.get('/companies', async (req, res) => {
  try {
    res.status(200).json({ companies });
  } catch (err) {
    console.error('Error fetching companies:', err.message);
    res.status(500).json({ Error: 'Internal server error' });
  }
});

// ✅ Delete Employee by ID (unchanged)
router.delete('/delete_employee/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ Error: `Invalid Employee ID: ${id}` });
    }

    // Find the Employee to get the image filename (if exists)
    const employee = await db.collection("employees_detail").findOne({ _id: new ObjectId(id) });

    if (!employee) {
      return res.status(404).json({ Error: "Employee not found" });
    }

    // Delete Employee from the database
    const result = await db.collection("employees_detail").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ Error: "Employee not found or already deleted" });
    }

    res.status(200).json({ Status: true, message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Error deleting Employee:", err);
    res.status(500).json({ Error: "Internal server error" });
  }
});

export default router;
