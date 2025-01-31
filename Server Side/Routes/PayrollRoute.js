import express from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../utils/db.js'; // Assuming db is your MongoDB connection

const router = express.Router();

// Route to add a new employee's payroll
router.post('/payroll', async (req, res) => {
  const { name, basicSalary, allowances, deductions } = req.body;

  try {
    // Validate input data
    if (!name || !basicSalary || !allowances || !deductions) {
      return res.status(400).json({
        error: 'All fields are required',
      });
    }

    // Step 1: Create a new employee record in the payroll collection
    const payrollData = {
      name,
      basicSalary: parseFloat(basicSalary), // Ensure these values are numbers
      allowances: parseFloat(allowances),
      deductions: parseFloat(deductions),
      createdAt: new Date(),
    };

    // Step 2: Insert the new payroll data
    const result = await db.collection('payroll').insertOne(payrollData);

    // Return the response with the created payroll record
    res.status(201).json({
      message: 'Employee payroll added successfully',
      employee: result.ops[0],
    });
  } catch (err) {
    console.error('Error adding payroll data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch all employee payroll data
router.get('/payroll', async (req, res) => {
  try {
    const payrollData = await db.collection('payroll').find().toArray();
    res.status(200).json({ payrollData });
  } catch (err) {
    console.error('Error fetching payroll data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get a specific employee's payroll by ID
router.get('/payroll/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const employee = await db.collection('payroll').findOne({ _id: new ObjectId(id) });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ employee });
  } catch (err) {
    console.error('Error fetching payroll data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update an employee's payroll
router.put('/payroll/:id', async (req, res) => {
  const { id } = req.params;
  const { name, basicSalary, allowances, deductions } = req.body;

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    // Validate input data
    if (!name || !basicSalary || !allowances || !deductions) {
      return res.status(400).json({
        error: 'All fields are required',
      });
    }

    const updatedPayrollData = {
      name,
      basicSalary: parseFloat(basicSalary),
      allowances: parseFloat(allowances),
      deductions: parseFloat(deductions),
      updatedAt: new Date(),
    };

    const result = await db.collection('payroll').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedPayrollData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const updatedEmployee = await db.collection('payroll').findOne({ _id: new ObjectId(id) });

    res.status(200).json({ message: 'Employee payroll updated successfully', employee: updatedEmployee });
  } catch (err) {
    console.error('Error updating payroll data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete an employee's payroll data
router.delete('/payroll/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }

    const result = await db.collection('payroll').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee payroll deleted successfully' });
  } catch (err) {
    console.error('Error deleting payroll data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch payroll with employee details
router.get('/payroll-with-details', async (req, res) => {
  try {
    const payrollData = await db.collection('payroll').aggregate([
      {
        $lookup: {
          from: 'employees_detail', // Join with employees_detail collection
          localField: 'name', // Match payroll name with employee name
          foreignField: 'name', // Assuming employee name is unique
          as: 'employeeDetails', // Alias for joined data
        },
      },
      { $unwind: '$employeeDetails' }, // Unwind the employeeDetails array
      {
        $project: {
          _id: 1,
          name: 1,
          basicSalary: 1,
          allowances: 1,
          deductions: 1,
          totalSalary: { $sum: ['$basicSalary', '$allowances', { $multiply: [-1, '$deductions'] }] },
          'employeeDetails.email': 1,
          'employeeDetails.department': 1,
        },
      },
    ]).toArray();

    res.status(200).json({ payrollData });
  } catch (err) {
    console.error('Error fetching payroll data with employee details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
