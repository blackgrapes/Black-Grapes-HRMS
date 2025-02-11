import express from 'express';
import { db } from '../utils/db.js';

const router = express.Router();

// ✅ Add Payroll Data (POST)
router.post('/payroll', async (req, res) => {
  const { email, basicSalary, allowances, deductions, paidUpto } = req.body;

  try {
    if (!email || basicSalary === undefined || allowances === undefined || deductions === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const totalSalary = parseFloat(basicSalary) + parseFloat(allowances) - parseFloat(deductions);

    const payrollData = {
      email,
      basicSalary: parseFloat(basicSalary),
      allowances: parseFloat(allowances),
      deductions: parseFloat(deductions),
      totalSalary,
      paidUpto: paidUpto ? new Date(paidUpto) : null,
      createdAt: new Date(),
    };

    const result = await db.collection('payroll').insertOne(payrollData);

    res.status(201).json({ message: 'Payroll added successfully', payroll: payrollData });
  } catch (err) {
    console.error('Error adding payroll:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Fetch all employees & merge payroll details (GET)
router.get('/payroll-with-details', async (req, res) => {
  try {
    const employees = await db.collection('employees_detail').find().toArray();
    const payrollData = await db.collection('payroll').find().toArray();

    const mergedData = employees.map((employee) => {
      const payroll = payrollData.find((p) => p.email === employee.email);

      return {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        basicSalary: payroll ? payroll.basicSalary : 0,
        allowances: payroll ? payroll.allowances : 0,
        deductions: payroll ? payroll.deductions : 0,
        totalSalary: payroll ? payroll.totalSalary : 0,
        paidUpto: payroll?.paidUpto ? payroll.paidUpto.toISOString().split("T")[0] : "", // Format date for frontend
      };
    });

    res.status(200).json({ payrollData: mergedData });
  } catch (err) {
    console.error('Error fetching payroll with employee details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/payroll/:email', async (req, res) => {
  const { email } = req.params;  // Extract email from the route parameter

  try {
    // Fetch employee details by email
    const employee = await db.collection('employees_detail').findOne({ email });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Fetch payroll details for the same email
    const payroll = await db.collection('payroll').findOne({ email });

    // Merge employee and payroll data
    const mergedData = {
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      department: employee.department,
      basicSalary: payroll ? payroll.basicSalary : 0,
      allowances: payroll ? payroll.allowances : 0,
      deductions: payroll ? payroll.deductions : 0,
      totalSalary: payroll ? payroll.totalSalary : 0,
      paidUpto: payroll?.paidUpto ? payroll.paidUpto.toISOString().split("T")[0] : "", // Date formatting
    };

    res.status(200).json({ payrollData: mergedData });
  } catch (err) {
    console.error('Error fetching payroll details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// ✅ Update Payroll Data (PUT)
router.put('/payroll/:email', async (req, res) => {
  const { email } = req.params;
  const { basicSalary, allowances, deductions, paidUpto } = req.body;

  try {
    if (basicSalary === undefined || allowances === undefined || deductions === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const totalSalary = parseFloat(basicSalary) + parseFloat(allowances) - parseFloat(deductions);

    const updatedPayroll = {
      basicSalary: parseFloat(basicSalary),
      allowances: parseFloat(allowances),
      deductions: parseFloat(deductions),
      totalSalary,
      paidUpto: paidUpto ? new Date(paidUpto) : null,
      updatedAt: new Date(),
    };

    const result = await db.collection('payroll').updateOne(
      { email },
      { $set: updatedPayroll },
      { upsert: true } // Create payroll if not exists
    );

    res.status(200).json({ message: 'Payroll updated successfully', payroll: updatedPayroll });
  } catch (err) {
    console.error('Error updating payroll:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Delete Payroll Data (DELETE)
router.delete('/payroll/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const result = await db.collection('payroll').deleteOne({ email });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Employee payroll not found' });
    }

    res.status(200).json({ message: 'Payroll deleted successfully' });
  } catch (err) {
    console.error('Error deleting payroll:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
