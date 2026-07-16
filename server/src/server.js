// Define a basic Express server that listens on a specified port and connects to a MongoDB database using Mongoose. 
// The server will log a message when it starts and will handle any errors that occur during the database connection process.

import express from "express";
import cors from "cors";

// Package to help with logging
import morgan from "morgan";

import connectDB from "./config/db.js";
import { port } from "./config/env.js";

// Error Handler (server errors)
import errorHandler from "./middleware/errorHandler.js";

// Importing routers
import {matchRoutes} from "./routes/matchRoutes.js";
import {teamRoutes} from "./routes/teamRoutes.js";

// Logging helper
import logger from "./utils/logger.js";

const app = express();

// Connect to the MongoDB database
connectDB();

// HTTP Request logging with Morgan, streamed directly to Winston logger
const morganStream = {
  write: (message) => logger.info(message.trim()),
};
app.use(morgan("combined", { stream: morganStream }));

// Allow requests from any origin
app.use(cors());

// JSON body parser
app.use(express.json());

// Mounting routes
app.use("/api/teams", teamRoutes);
app.use("/api/matches", matchRoutes);

// create a simple route for testing
app.get("/api/", (req, res) => {
  res.send("Welcome to \"Football Match Score Tracker.\"");
});

// Error-Handling Middleware (after all routes)
app.use(errorHandler);

// Start the Express server
app.listen(port, () => {
  logger.info(`Server is running on http://127.0.0.1:${port}`);
});
