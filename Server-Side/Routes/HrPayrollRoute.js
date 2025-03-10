import express from 'express';
import { db } from '../utils/db.js';

const router = express.Router();

// ✅ Add HR Payroll Data (POST)
router.post('/hr-payroll', async (req, res) => {
  const { email, basicSalary, allowances, deductions, paidUpto } = req.body;

  try {
    if (!email || basicSalary === undefined || allowances === undefined || deductions === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const totalSalary = parseFloat(basicSalary) + parseFloat(allowances) - parseFloat(deductions);

    const hrPayrollData = {
      email,
      basicSalary: parseFloat(basicSalary),
      allowances: parseFloat(allowances),
      deductions: parseFloat(deductions),
      totalSalary,
      paidUpto: paidUpto ? new Date(paidUpto) : null,
      createdAt: new Date(),
    };

    const result = await db.collection('hr_payroll').insertOne(hrPayrollData);

    res.status(201).json({ message: 'HR Payroll added successfully', payroll: hrPayrollData });
  } catch (err) {
    console.error('Error adding HR payroll:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Fetch all HR employees & merge payroll details (GET)
router.get('/hr-payroll-with-details', async (req, res) => {
  try {
    const hrEmployees = await db.collection('hr_detail').find().toArray();
    const payrollData = await db.collection('hr_payroll').find().toArray();

    const mergedData = hrEmployees.map((hr) => {
      const payroll = payrollData.find((p) => p.email === hr.email);

      return {
        _id: hr._id,
        name: hr.name,
        email: hr.email,
        department: hr.department,
        basicSalary: payroll ? payroll.basicSalary : 0,
        allowances: payroll ? payroll.allowances : 0,
        deductions: payroll ? payroll.deductions : 0,
        totalSalary: payroll ? payroll.totalSalary : 0,
        paidUpto: payroll?.paidUpto ? payroll.paidUpto.toISOString().split("T")[0] : "", // Format date
      };
    });

    res.status(200).json({ payrollData: mergedData });
  } catch (err) {
    console.error('Error fetching HR payroll details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Fetch HR payroll by email (GET)
router.get('/hr-payroll/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const hr = await db.collection('hr_detail').findOne({ email });

    if (!hr) {
      return res.status(404).json({ error: 'HR employee not found' });
    }

    const payroll = await db.collection('hr_payroll').findOne({ email });

    const mergedData = {
      _id: hr._id,
      name: hr.name,
      email: hr.email,
      department: hr.department,
      basicSalary: payroll ? payroll.basicSalary : 0,
      allowances: payroll ? payroll.allowances : 0,
      deductions: payroll ? payroll.deductions : 0,
      totalSalary: payroll ? payroll.totalSalary : 0,
      paidUpto: payroll?.paidUpto ? payroll.paidUpto.toISOString().split("T")[0] : "",
    };

    res.status(200).json({ payrollData: mergedData });
  } catch (err) {
    console.error('Error fetching HR payroll details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Update HR Payroll Data (PUT)
router.put('/hr-payroll/:email', async (req, res) => {
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

    await db.collection('hr_payroll').updateOne(
      { email },
      { $set: updatedPayroll },
      { upsert: true }
    );

    res.status(200).json({ message: 'HR Payroll updated successfully', payroll: updatedPayroll });
  } catch (err) {
    console.error('Error updating HR payroll:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Delete HR Payroll Data (DELETE)
router.delete('/hr-payroll/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const result = await db.collection('hr_payroll').deleteOne({ email });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'HR payroll not found' });
    }

    res.status(200).json({ message: 'HR Payroll deleted successfully' });
  } catch (err) {
    console.error('Error deleting HR payroll:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
