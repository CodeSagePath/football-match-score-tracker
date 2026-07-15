/**
 * - Import mongoose.
   - Import the `dbUri` from your env.js config.
   - Define an asynchronous function named `connectDB`.
   - Inside this function: Use `mongoose.connect(dbUri, { ... })`.
     (Mongoose options: useNewUrlParser, useUnifiedTopology).
   - Use try/catch. If successful, log a success message.
   - If error, log the error and call `process.exit(1)`.
   - Export this `connectDB` function.
 */

import mongoose from "mongoose";
import { dbUri, port } from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log(`MongoDB connected successfully on port ${port}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
