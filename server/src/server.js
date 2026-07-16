// Define a basic Express server that listens on a specified port and connects to a MongoDB database using Mongoose. 
// The server will log a message when it starts and will handle any errors that occur during the database connection process.

import express from "express";
import connectDB from "./config/db.js";
import { port } from "./config/env.js";

import errorHandler from "./middleware/errorHandler.js";

// Importing routers
import {matchRoutes} from "./routes/matchRoutes.js";
import {teamRoutes} from "./routes/teamRoutes.js";

const app = express();

// Connect to the MongoDB database
connectDB();

// JSON body parser
app.use(express.json());

// Mounting routes
app.use("/api/teams", teamRoutes);
app.use("/api/matches", matchRoutes);

// create a simple route for testing
app.get("/api/", (req, res) => {
  res.send("Hello, World!");
});

// Error-Handling Middleware (after all routes)
app.use(errorHandler);

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
