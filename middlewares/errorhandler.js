const errorHandler = (err, req, res, next) => {
    if (err.name === "ValidationError") {
      return res.status(400).json({ status: "failure", message: err.message });
    }
  
    if (err.code === 11000) {
      return res.status(400).json({ status: "failure", message: "Duplicate key error" });
    }
  
    if (err.name === "CastError") {
      return res.status(400).json({ status: "failure", message: "Invalid ID" });
    }
  
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ status: "failure", message: "Unauthorized" });
    }
  
    console.error(err.stack);
    res.status(500).json({ status: "failure", message: "Internal Server Error" });
  };
  
  module.exports = errorHandler;