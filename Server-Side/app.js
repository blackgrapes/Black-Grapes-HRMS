import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminRouter from "./Routes/AdminRoute.js"; // Admin routes
import EmployeeRouter from "./Routes/EmployeeRoute.js"; // Employee routes
import SuperAdminRouter from "./Routes/SuperAdminRoute.js"; // SuperAdmin routes
import EmployeeLeaveRequestRouter from "./Routes/EmployeeLeaveRequestRouter.js";
import EmployeeDetailRouter from "./Routes/EmployeeDetailRoutes.js";
import PayrollRouter from "./Routes/PayrollRoute.js";
import HrDetailRouter from "./Routes/HrDetailRoutes.js";
import AttendanceDetailRouter from "./Routes/AttendanceDetailRoute.js";
import HrPayrollRouter from "./Routes/HrPayrollRoute.js";
import HrAttendanceRouter from "./Routes/HrAttendanceRoute.js";
import HrleaveRequestRouter from "./Routes/HrleaveRequestRoute.js";

import dotenv from "dotenv";

import { connectToDatabase } from "./utils/db.js";

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000

// Database connection
connectToDatabase()
  .then(() => console.log("Connected to the database successfully"))
  .catch((err) => console.error("Database connection failed:", err));

// // Middleware setup
app.use(
  cors({
    origin: ["https://black-grapes-hrms.vercel.app", "http://localhost:5173"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })  
);
// app.use(cors({ origin:'*', credentials: true,  methods: ["GET", "POST", "PUT", "DELETE"], allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept' }));
dotenv.config(); // Load environment variables from .env file

app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Routes
app.use("/auth", adminRouter); // Admin login/signup routes
app.use("/employee", EmployeeRouter); // Employee login/signup routes
app.use("/superadmin", SuperAdminRouter); // SuperAdmin login/signup routes
app.use("/employeedetail", EmployeeDetailRouter); // Employee data routes
app.use("/hrdetail", HrDetailRouter); // HR data routes
app.use("/employeeLeave", EmployeeLeaveRequestRouter); // Leave requests
app.use("/Payroll", PayrollRouter); // Payroll
app.use("/attendance", AttendanceDetailRouter); // Attendance
app.use("/hrpayroll", HrPayrollRouter); // hr payroll
app.use("/hrattendance", HrAttendanceRouter); // hr payroll
app.use("/hrleave", HrleaveRequestRouter); // hr payroll


app.use(express.static("Public")); // Serve static files

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
