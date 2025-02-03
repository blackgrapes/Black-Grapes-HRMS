import express from 'express';
import { db } from '../utils/db.js';

const router = express.Router();

// Route to fetch all employees and merge attendance details
router.get('/attendance-with-details', async (req, res) => {
  try {
    const employees = await db.collection('employees_detail').find().toArray();
    const attendanceData = await db.collection('attendance').find().toArray();

    const mergedData = employees.map((employee) => {
      const attendanceRecords = attendanceData.filter((a) => a.employeeEmail === employee.email);
      return {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        attendance: attendanceRecords.map((record) => ({
          date: record.date,
          status: record.status,
        })),
      };
    });

    res.status(200).json({ attendanceData: mergedData });
  } catch (err) {
    console.error('Error fetching attendance with employee details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to add or update attendance
router.post('/attendance', async (req, res) => {
  const { employeeEmail, date, status } = req.body;

  try {
    if (!employeeEmail || !date || !status) {
      return res.status(400).json({ error: 'Employee email, date, and status are required' });
    }

    const employee = await db.collection('employees_detail').findOne({ email: employeeEmail });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const existingAttendance = await db.collection('attendance').findOne({ employeeEmail, date });
    if (existingAttendance) {
      await db.collection('attendance').updateOne(
        { employeeEmail, date },
        { $set: { status } }
      );
      return res.status(200).json({ message: 'Attendance updated successfully' });
    } else {
      await db.collection('attendance').insertOne({ employeeEmail, date, status });
      return res.status(200).json({ message: 'Attendance added successfully' });
    }
  } catch (err) {
    console.error('Error updating attendance:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get attendance for a specific employee
router.get('/attendance', async (req, res) => {
  const { employeeEmail, date } = req.query;

  try {
    if (!employeeEmail || !date) {
      return res.status(400).json({ error: 'Employee email and date are required' });
    }

    const attendance = await db.collection('attendance').findOne({ employeeEmail, date });

    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.status(200).json({ result: attendance });
  } catch (err) {
    console.error('Error fetching attendance:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
