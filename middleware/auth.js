// Import the jsonwebtoken library for token verification
const jwt = require("jsonwebtoken");

// Import dotenv for loading environment variables
const dotenv = require("dotenv");

// Import the MySQL connection pool
const pool = require("../utils/database");

// Load environment variables from a .env file
dotenv.config();

// Middleware function to authenticate user requests using JWT
const authenticate = async (req, res, next) => {
  try {
    // Extract the JWT token from the request headers
    const token = req.headers.authorization;

    // Verify the token using the JWT secret key
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Find the user associated with the decoded token in the database
    const [userRows, userFields] = await pool.query(
      "SELECT * FROM users WHERE userId = ?",
      [decodedToken.userId]
    );

    // Check if the user was found
    if (userRows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach the user information to the request object
    req.user = userRows[0];

    // Call the next middleware or route handler
    next();
  } catch (err) {
    // Handle errors related to token verification
    console.log(err);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Export the authenticate middleware for use in other parts of the application
module.exports = { authenticate };
