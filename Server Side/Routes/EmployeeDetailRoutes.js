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

// Companies and their departments and roles
const companies = {
  "Black Grapes Associate": {
    "Finance": ["Financial Analyst", "Accountant", "Auditor"],
    "Marketing": ["Marketing Manager", "SEO Specialist", "Content Strategist"],
    "IT Support": ["IT Technician", "Help Desk Support"],
  },
  "Black Grapes Softech": {
    "Software Engineering": ["Frontend Developer", "Backend Developer", "Full Stack Developer"],
    "Sales": ["Sales Executive", "Business Development Manager"],
  },
  "Black Grapes Real Estate": {
    "Sales": ["Real Estate Agent", "Property Manager"],
    "Marketing": ["Marketing Coordinator", "SEO Specialist"],
  },
  "Black Grapes Valuers & Engineers": {
    "Engineering": ["Civil Engineer", "Structural Engineer"],
    "Accounting": ["Accountant", "Auditor"],
  },
  "Black Grapes Investment Pvt. Ltd.": {
    "Finance": ["Investment Analyst", "Portfolio Manager"],
    "Accounting": ["Senior Accountant", "Tax Specialist"],
  },
  "Black Grapes Insurance Surveyors & Loss Assessors Pvt. Ltd.": {
    "Insurance": ["Claims Adjuster", "Loss Assessor"],
    "Finance": ["Financial Analyst", "Accountant"],
  },
};

// Route to add a new employee
router.post("/add_employee", upload.single('image'), async (req, res) => {
  const { name, email, address, phone, role, department, manager, dob, joiningDate, company } = req.body;

  try {
    // Validate input data
    if (!name || !email || !address || !phone || !role || !department || !manager || !dob || !joiningDate || !company) {
      return res.status(400).json({ Error: "All fields are required" });
    }

    // Check if the employee already exists
    const existingEmployee = await db.collection("employees_detail").findOne({ email });
    if (existingEmployee) {
      return res.status(409).json({ message: "Employee already exists" });
    }

    // Step 1️⃣: Insert Employee Data
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
      image: req.file ? req.file.filename : null,
    };

    const employeeResult = await db.collection("employees_detail").insertOne(employeeData);
    console.log("Employee added:", employeeResult.insertedId);

    // Step 2️⃣: Add Initial Leave Balance in leave_requests Collection
    const currentYear = new Date().getFullYear();
    const leaveBalanceData = {
      employeeId: employeeResult.insertedId,
      email: email,
      year: currentYear,
      paidLeavesRemaining: 30,
      createdAt: new Date(),
    };

    await db.collection("leave_requests").insertOne(leaveBalanceData);
    console.log("Leave balance initialized for:", employeeResult.insertedId);

    return res.status(200).json({
      message: "Employee added successfully with initial leave balance",
      employeeId: employeeResult.insertedId,
    });
  } catch (err) {
    console.error("Error adding employee:", err);
    return res.status(500).json({ Error: "Internal server error" });
  }
});


// Route to fetch all employees (sorted by latest created)
router.get('/all', async (req, res) => {
  try {
    const employees = await db.collection("employees_detail").find({}).sort({ createdAt: -1 }).toArray(); // Sort by latest
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

// New Route: Fetch employee by email
router.get('/employee', async (req, res) => {
  const { email } = req.query; // Extract query parameters

  try {
    // Validate input
    if (!email) {
      return res.status(400).json({ Error: 'Email is required' });
    }

    // Fetch employee data from the collection
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

// Route to update employee details
router.put('/update_employee/:email', async (req, res) => {
  const { email } = req.params; // Extract email from the request parameters
  const { address, phone, role, department, company } = req.body; // Get updated fields from the request body

  try {
    // Validate email
    if (!email) {
      return res.status(400).json({ Error: 'Email is required' });
    }

    // Prepare update data
    const updateData = {};
    if (address) updateData.address = address;
    if (phone) updateData.phone = phone;
    if (role) updateData.role = role;
    if (department) updateData.department = department;
    if (company) updateData.company = company;

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

// Route to fetch all companies with their departments and roles
router.get('/companies', async (req, res) => {
  try {
    res.status(200).json({ companies });
  } catch (err) {
    console.error('Error fetching companies:', err.message);
    res.status(500).json({ Error: 'Internal server error' });
  }
});

router.delete('/delete_employee/:id', async (req, res) => {
  const { id } = req.params;
  console.log("Received ID for deletion:", id);  // Debug log

  try {
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ Error: `Invalid Employee ID: ${id}` });
    }

    const result = await db.collection("employees_detail").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ Error: "Employee not found" });
    }

    console.log("Employee deleted successfully:", id);
    res.status(200).json({ Status: true, message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ Error: "Internal server error" });
  }
});

export default router;
