import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const router = express.Router();

// MongoDB connection details from environment variables
const url = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

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
