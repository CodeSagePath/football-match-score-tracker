// Configuration related to database connection

import mongoose from "mongoose";
import { dbUri } from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log(`MongoDB connected successfully`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if failed to connect to DB
  }
};

export default connectDB;
