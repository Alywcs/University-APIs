const jwt = require("jsonwebtoken");

// Middleware to check if the user is authenticated
exports.authenticate = function (req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Token is typically passed in the "Authorization" header

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded token (user information) to the request object
    next(); // Continue to the next route handler
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid token.",
    });
  }
};
