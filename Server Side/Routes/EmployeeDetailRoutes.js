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

// Updated Companies, Departments, and Roles
const companies = {
  "Black Grapes Group": {
    departments: ["Accounting and Finance", "Education Services", "E-Commerce Solutions", "Social Media Marketing", "Government Training Programs"],
    roles: {
      "Accounting and Finance": ["Financial Analyst", "Senior Accountant", "Auditor"],
      "Education Services": ["Training Coordinator", "Curriculum Developer", "Education Consultant"],
      "E-Commerce Solutions": ["E-commerce Manager", "Web Analyst", "Product Listing Specialist"],
      "Social Media Marketing": ["Social Media Manager", "Content Creator", "Digital Marketing Strategist"],
      "Government Training Programs": ["Program Manager", "Policy Trainer", "Compliance Officer"],
    },
  },
  "Black Grapes Associate": {
    departments: ["Finance", "Marketing", "Sales"],
    roles: {
      Finance: ["Financial Analyst", "Accountant"],
      Marketing: ["SEO Specialist", "Content Strategist"],
      Sales: ["Sales Executive", "Business Development Manager"],
    },
  },
  "Black Grapes Softech": {
    departments: ["Software Engineering", "IT Support", "Marketing"],
    roles: {
      "Software Engineering": ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
      "IT Support": ["IT Technician", "Help Desk Support"],
      Marketing: ["SEO Specialist", "Content Strategist"],
    },
  },
  "Black Grapes Real Estate": {
    departments: ["Sales", "Accounting", "Housekeeping"],
    roles: {
      Sales: ["Sales Executive", "Business Development Manager"],
      Accounting: ["Senior Accountant", "Tax Specialist"],
      Housekeeping: ["Housekeeping Supervisor", "Cleaning Staff"],
    },
  },
  "Black Grapes Valuers & Engineers": {
    departments: ["Finance", "Software Engineering", "Sales"],
    roles: {
      Finance: ["Financial Analyst", "Accountant"],
      "Software Engineering": ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
      Sales: ["Sales Executive", "Business Development Manager"],
    },
  },
  "Black Grapes Investment Pvt. Ltd.": {
    departments: ["Finance", "Accounting", "Sales"],
    roles: {
      Finance: ["Financial Analyst", "Accountant", "Auditor"],
      Accounting: ["Senior Accountant", "Tax Specialist"],
      Sales: ["Sales Executive", "Business Development Manager"],
    },
  },
  "Black Grapes Insurance Surveyors & Loss Assessors Pvt. Ltd.": {
    departments: ["Sales", "Marketing", "Accounting"],
    roles: {
      Sales: ["Sales Executive", "Business Development Manager"],
      Marketing: ["SEO Specialist", "Content Strategist"],
      Accounting: ["Senior Accountant", "Tax Specialist"],
    },
  },
};

// Add Employee Route (handles image upload)
router.post("/add_employee", upload.single('image'), async (req, res) => {
  const { name, email, address, phone, role, department, manager, dob, joiningDate, company } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    if (!name || !email || !phone || !role || !manager || !dob || !joiningDate || !department || !company) {
      return res.status(400).json({ Error: "All fields are required" });
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
      role,
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

// Fetch All Employees
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

// Fetch Employee by Email
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

// Update Employee Details
router.put('/update_employee/:email', async (req, res) => {
  const { email } = req.params;
  const { address, phone, role, department, company } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ Error: 'Email is required' });
    }

    const updateData = {};
    if (address) updateData.address = address;
    if (phone) updateData.phone = phone;
    if (role) updateData.role = role;
    if (department) updateData.department = department;
    if (company) updateData.company = company;

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

// Fetch Companies with Departments and Roles
router.get('/companies', async (req, res) => {
  try {
    res.status(200).json({ companies });
  } catch (err) {
    console.error('Error fetching companies:', err.message);
    res.status(500).json({ Error: 'Internal server error' });
  }
});

// Delete Employee by ID
router.delete('/delete_employee/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ Error: `Invalid Employee ID: ${id}` });
    }

    const result = await db.collection("employees_detail").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ Error: "Employee not found" });
    }

    res.status(200).json({ Status: true, message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ Error: "Internal server error" });
  }
});

export default router;
