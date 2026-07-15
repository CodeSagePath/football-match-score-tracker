// Error Handler Middleware

export default function errorHandler(error, req, res, next) {
  console.log("Error Handler:", error);

  res.status(500).json({ message: "Something went wrong" });
};
