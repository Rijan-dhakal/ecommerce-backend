const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.success = false;
  error.message = err.message;

  // mongoose bad ObjectId
  if (error.name === "CastError") {
    error.message = "Resource Not Found";
    error.statusCode = 404;
  }

  // mongoose duplicate key
  if (err.code === 11000) {
    error.message = "Duplicate field value entered";
    error.statusCode = 400;
  }

  // mongoose validation error
  if (err.name === "ValidationError") {
    error.message = Object.values(err.errors).map((val) => val.message).join(', ');
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};

export default errorMiddleware;