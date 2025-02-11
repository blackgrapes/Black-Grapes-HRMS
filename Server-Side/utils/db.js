import express from "express";
import { MongoClient } from "mongodb";

const router = express.Router();

// MongoDB connection URL and Database name
const url = "mongodb+srv://shrivanshu4:shrivanshu@cluster0.kp0f3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "employeems";

// Create a new MongoClient
const client = new MongoClient(url);

let db;

// Connect to MongoDB
 export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    db = client.db(dbName);
  } catch (err) {
    console.error("Connection error:", err);
  }
}

// Export the db object to use in other files
export { db };







// import { MongoClient, ObjectId } from 'mongodb';

// // MongoDB connection URL
// // const url = "mongodb://localhost:27017";
// const url="mongodb+srv://shrivanshu4:shrivanshu@cluster0.kp0f3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" 

// // Database name
// const dbName = "employeems";

// // Create a new MongoClient
// const client = new MongoClient(url);

// let db;

// // Connect to MongoDB
// async function connectToDatabase() {
//     try {
//         // Connect the client to the server
//         await client.connect();
//         console.log("Connected successfully to MongoDB");

//         // Select the database
//         db = client.db(dbName);
//     } catch (err) {
//         console.error("Connection error:", err);
//     }
// }

// // Call the connection function
// connectToDatabase();

// // CRUD Operations

// // Insert Employee
// async function insertEmployee(employee) {
//     try {
//         const collection = db.collection('employees'); // Use 'employees' collection
//         const result = await collection.insertOne(employee);
//         console.log("Employee inserted:", result.insertedId);
//     } catch (err) {
//         console.error("Error inserting employee:", err);
//     }
// }

// // Fetch Employees
// async function getEmployees() {
//     try {
//         const collection = db.collection('employees');
//         const employees = await collection.find({}).toArray();
//         console.log("Employees:", employees);
//     } catch (err) {
//         console.error("Error fetching employees:", err);
//     }
// }

// // Update Employee
// async function updateEmployee(id, updateData) {
//     try {
//         const collection = db.collection('employees');
//         const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
//         console.log("Updated employee:", result.modifiedCount);
//     } catch (err) {
//         console.error("Error updating employee:", err);
//     }
// }

// // Delete Employee
// async function deleteEmployee(id) {
//     try {
//         const collection = db.collection('employees');
//         const result = await collection.deleteOne({ _id: new ObjectId(id) });
//         console.log("Deleted employee:", result.deletedCount);
//     } catch (err) {
//         console.error("Error deleting employee:", err);
//     }
// }

// // Example Usage
// (async () => {
//     // Insert a new employee
//     await insertEmployee({ name: "John Doe", position: "Developer", salary: 50000 });

//     // Fetch all employees
//     await getEmployees();

//     // Update an employee
//     const employeeId = "your-employee-id-here"; // Replace with a valid ObjectId from your database
//     await updateEmployee(employeeId, { salary: 60000 });

//     // Delete an employee
//     await deleteEmployee(employeeId);
// })();
