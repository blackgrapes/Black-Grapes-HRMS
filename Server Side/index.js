import express from "express";
import cors from "cors";
import adminRouter from "./Routes/AdminRoute.js"; // Admin routes
import EmployeeRouter from "./Routes/EmployeeRoute.js"; // Employee routes
import SuperAdminRouter from "./Routes/SuperAdminRoute.js"; // SuperAdmin routes
import EmployeeLeaveRequestRouter from "./Routes/EmployeeLeaveRequestRouter.js";
import EmployeeDetailRouter from "./Routes/EmployeeDetailRoutes.js";
import HrDetailRouter from "./Routes/HrDetailRoutes.js";
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./utils/db.js";

const app = express();

// Connect to the database and start the server
connectToDatabase()
  .then(() => {
    console.log("Connected to the database successfully");

    // Middleware setup
    app.use(
      cors({
        origin: ["http://localhost:5173"], // Adjust the frontend URL if needed
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true, // Allow cookies to be sent
      })
    );
    app.use(express.json()); // Parse JSON request bodies
    app.use(cookieParser()); // Parse cookies

    // Routes
    app.use("/auth", adminRouter); // Admin login/signup routes
    app.use("/employee", EmployeeRouter); // Employee login/signup routes
    app.use("/superadmin", SuperAdminRouter); // SuperAdmin login/signup routes
    app.use ("/employeedetail", EmployeeDetailRouter)// employee data routes
    app.use ("/hrdetail", HrDetailRouter)// Hr data routes
    app.use ("/employeeLeave", EmployeeLeaveRequestRouter)// Hr data routes

    app.use(express.static("Public")); // Serve static files from the 'Public' directory

    // Start the server
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
