// Main entry point into the server.

import express from "express";
import cors from "cors";
import http from "http";

// Package to help with logging
import morgan from "morgan";

import connectDB from "./config/db.js";
import { port } from "./config/env.js";

// Importing socket.io
import { Server } from "socket.io";

// Error Handler (server errors)
import errorHandler from "./middleware/errorHandler.js";

// Importing routers
import { matchRoutes } from "./routes/matchRoutes.js";
import { teamRoutes } from "./routes/teamRoutes.js";

// Logging helper
import logger from "./utils/logger.js";

// Swagger API Document
import { swaggerDocument } from "./swagger.js";

const app = express();
const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
  cors: {
    // origin: "https://football-score-api.codesagepath.dev/", // client (frontend) URL
    origin: "*", // Wildcard (allow all)
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Connect to the MongoDB database
connectDB();

// HTTP Request logging with Morgan, streamed directly to Winston logger
const morganStream = {
  write: (message) => logger.info(message.trim()),
};
app.use(morgan(":method :url :status - :response-time ms", { stream: morganStream }));

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

// Serve the OpenAPI specification file
app.get("/api/swagger.json", (req, res) => {
  res.json(swaggerDocument);
});

// Serve the interactive Swagger UI page using CDN scripts
app.get("/api/docs", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Football Score Tracker API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui.css" />
    <style>
      html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
      *, *:before, *:after { box-sizing: inherit; }
      body { margin: 0; background: #fafafa; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '/api/swagger.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          layout: "BaseLayout"
        });
      };
    </script>
  </body>
</html>
  `);
});

// Error-Handling Middleware (after all routes)
app.use(errorHandler);

// Socket.IO Connection Handling
io.on("connection", (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Start the Express server
httpServer.listen(port, () => {
  logger.info(`Server is running on http://127.0.0.1:${port}`);
});
