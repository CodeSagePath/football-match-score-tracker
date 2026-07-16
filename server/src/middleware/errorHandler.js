import logger from "../utils/logger.js";

export default function errorHandler(error, req, res, next) {
  logger.error("API Error:", error);

  res.status(500).json({ error: "Something went wrong." });
}
