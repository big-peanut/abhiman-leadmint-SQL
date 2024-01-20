const pool = require("../utils/database");

exports.addMessage = async (req, res, next) => {
  try {
    // Extract necessary information from the request body
    const roomId = req.body.roomId;
    const message = req.body.message;
    const userId = req.user.id;

    // Create a new message in the Messages table
    const addMessageQuery = `
      INSERT INTO messages (message, roomId, userId)
      VALUES (?, ?, ?)
    `;
    const [data] = await pool.query(addMessageQuery, [message, roomId, userId]);

    // Return the newly created message data in the response
    res.json({ data: data });
  } catch (err) {
    console.log(err);
  }
};

exports.getMessage = async (req, res, next) => {
  try {
    // Extract the room ID from the request parameters
    const roomId = req.params.roomId;

    // Fetch all messages associated with the specified room from the database
    const getMessagesQuery = "SELECT * FROM messages WHERE roomId = ?";
    const [messages] = await pool.query(getMessagesQuery, [roomId]);

    // Return the list of messages in the response
    res.json({ messages: messages });
  } catch (err) {
    console.log(err);
  }
};
