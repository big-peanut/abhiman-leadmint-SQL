const pool = require("../utils/database");

// Define the table name
const tableName = "messages";

// Define the Messages model
const Messages = {
  // Function to create the messages table
  createTable: async () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        message TEXT NOT NULL,
        roomId INT,
        FOREIGN KEY (roomId) REFERENCES rooms (id)
      )
    `;
    try {
      const [rows, fields] = await pool.query(createTableQuery);
      console.log("Messages table created:");
    } catch (error) {
      console.error("Error creating Messages table:", error);
    }
  },

  // Add other model-related functions here
};

// Export the Messages model for use in other parts of the application
module.exports = Messages;
