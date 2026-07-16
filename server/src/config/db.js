import mongoose from "mongoose";
import { dbUri } from "./env.js";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
