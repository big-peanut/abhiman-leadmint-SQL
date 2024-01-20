// Import the Express framework for building the router
const express = require("express");

// Import userController to handle user-related requests
const userController = require("../controllers/userController");

// Import authentication middleware for securing routes
const middleware = require("../middleware/auth");

// Create an instance of the Express router
const router = express.Router();

// Define routes and associate them with appropriate controller functions

// Route for user signup
router.post("/api/signup", userController.signup);

// Route for user login
router.post("/api/login", userController.login);

// Route to get user information, authenticated using middleware
router.get("/api/getUser", middleware.authenticate, userController.getUser);

// Route to get all users
router.get("/api/getAllUsers", userController.getAllUsers);

// Route to get user profile by userId
router.get("/api/profile/:userId", userController.getProfile);

// Route to add a friend, authenticated using middleware
router.post(
  "/api/addFriend",
  middleware.authenticate,
  userController.addFriend
);

// Route to get friends of a user, authenticated using middleware
router.get(
  "/api/getFriends",
  middleware.authenticate,
  userController.getFriends
);

// Export the router for use in other parts of the application
module.exports = router;
