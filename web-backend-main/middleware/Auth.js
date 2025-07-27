const jwt = require("jsonwebtoken");
require("dotenv").config();

// const generateToken = (user) => {
//   return jwt.sign(
//     { userId: user.id, role: user.role }, // Payload
//     process.env.JWT_SECRET,              // Secret Key
//     { expiresIn: "7d" }                  // Set expiry (e.g., 7 days)
//   );
// };


// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("No token provided:", authHeader);
    return res.status(401).json({ message: "Access denied: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    
    console.log("✅ Authenticated User:", req.user);  // Debugging

    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(error.name === "TokenExpiredError" ? 401 : 403).json({ message: "Invalid or expired token" });
  }
};


// Middleware to authorize based on role (supports multiple roles)
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied: Insufficient Permission" });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
