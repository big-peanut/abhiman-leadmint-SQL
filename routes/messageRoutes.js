// Import the Express framework for building the router
const express = require("express");

// Import authentication middleware for securing routes
const middleware = require("../middleware/auth");

// Import messageController to handle message-related requests
const messageController = require("../controllers/messageController");

// Create an instance of the Express router
const router = express.Router();

// Define routes and associate them with appropriate controller functions

// Route to add a message to a chat room, authenticated using middleware
router.post(
  "/api/addMessage",
  middleware.authenticate,
  messageController.addMessage
);

// Route to get messages for a specific chat room
router.get("/api/getMessage/:roomId", messageController.getMessage);

// Export the router for use in other parts of the application
module.exports = router;
