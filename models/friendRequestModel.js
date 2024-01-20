const pool = require("../utils/database");

// Define the table name
const tableName = "friendrequests";

// Define the Friends model
const Friends = {
  // Function to create the friendrequests table
  createTable: async () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        senderId INT NOT NULL,
        receiverId INT NOT NULL,
        areFriends BOOLEAN DEFAULT false NOT NULL
      )
    `;
    try {
      const [rows, fields] = await pool.query(createTableQuery);
      console.log("Friends table created:");
    } catch (error) {
      console.error("Error creating Friends table:", error);
    }
  },

  // Add other model-related functions here
};

// Export the Friends model for use in other parts of the application
module.exports = Friends;
