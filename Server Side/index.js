import express from "express";
import cors from "cors";
import adminRouter from "./Routes/AdminRoute.js"; // Default export
import EmployeeRouter from "./Routes/EmployeeRoute.js"; // Default export
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./utils/db.js"; // Ensure this is correctly implemented

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
    app.use("/auth", adminRouter); // Admin routes
    app.use("/employee", EmployeeRouter); // Employee routes
    app.use(express.static("Public")); // Serve static files from the 'Public' directory

    // Start the server
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
