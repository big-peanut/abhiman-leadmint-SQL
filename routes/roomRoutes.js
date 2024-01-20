// Import the Express framework for building the router
const express = require("express");

// Import authentication middleware for securing routes
const middleware = require("../middleware/auth");

// Import roomController to handle room-related requests
const roomController = require("../controllers/roomController");

// Create an instance of the Express router
const router = express.Router();

// Define routes and associate them with appropriate controller functions

// Route to create a chat room, authenticated using middleware
router.post(
  "/api/chatrooms",
  middleware.authenticate,
  roomController.createRoom
);

// Route to get all chat rooms
router.get("/api/getchatrooms", roomController.getChatRooms);

// Route to join a chat room by roomId, authenticated using middleware
router.post(
  "/api/joinroom/:roomId",
  middleware.authenticate,
  roomController.joinRoom
);

// Route to check room membership by roomId, authenticated using middleware
router.get(
  "/api/checkRoomMembership/:roomId",
  middleware.authenticate,
  roomController.checkRoomMembership
);

// Route to count members in a specific chat room
router.get("/api/countRoomMembers/:roomId", roomController.countRoomMembers);

// Route to count non-prime members in a chat room, authenticated using middleware
router.get(
  "/api/countNonPrimeRoomMember",
  middleware.authenticate,
  roomController.countNonPrimeRoomMember
);

// Export the router for use in other parts of the application
module.exports = router;
