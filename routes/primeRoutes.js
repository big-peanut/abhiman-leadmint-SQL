// Import the Express framework for building the router
const express = require("express");

// Import authentication middleware for securing routes
const middleware = require("../middleware/auth");

// Import primeController to handle prime-related requests
const primeController = require("../controllers/primeController");

// Create an instance of the Express router
const router = express.Router();

// Define routes and associate them with appropriate controller functions

// Route to allow users to buy a prime membership, authenticated using middleware
router.post("/api/buyPrime", middleware.authenticate, primeController.buyPrime);

// Route to deduct coins from the user's account, authenticated using middleware
router.post(
  "/api/deductCoins",
  middleware.authenticate,
  primeController.deductCoins
);

// Export the router for use in other parts of the application
module.exports = router;
