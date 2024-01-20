const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const primeRoutes = require("./routes/primeRoutes");
const roomRoutes = require("./routes/roomRoutes");
const messageRoutes = require("./routes/messageRoutes");
const http = require("http");
const socketIO = require("socket.io");
const pool = require("./utils/database");
const Users = require("./models/userModel");
const Rooms = require("./models/roomModel");
const Messages = require("./models/messageModel");
const Friends = require("./models/friendRequestModel");
const UserRoom = require("./models/userRoom");

const app = express();

app.use(bodyParser.json());
app.use(cors());

dotenv.config();

const server = http.createServer(app);

const io = socketIO(server);

app.use(userRoutes);
app.use(primeRoutes);
app.use(roomRoutes);
app.use(messageRoutes);

io.on("connection", (socket) => {
  console.log("User connected:--------------", socket.id);

  socket.on("message", (message) => {
    // Log the received message
    console.log("Received message====", message);

    // Broadcast the message to all connected clients except the sender
    socket.broadcast.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:------", socket.id);
  });
});

const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    Users.createTable();
    Rooms.createTable();
    Messages.createTable();
    Friends.createTable();
    UserRoom.createTable();
    console.log("Database connection and table creation successful");
    connection.release();
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
};

// Execute the database connection test
testDatabaseConnection();

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
