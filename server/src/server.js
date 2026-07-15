// Define a basic Express server that listens on a specified port and connects to a MongoDB database using Mongoose. 
// The server will log a message when it starts and will handle any errors that occur during the database connection process.

import express from "express";
import connectDB from "./config/db.js";
import { port } from "./config/env.js";

const app = express();

// Connect to the MongoDB database
connectDB();

// create a simple route for testing
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
