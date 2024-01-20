const pool = require("../utils/database");

// Define the table name
const tableName = "user_room";

// Define the UserRoom model
const UserRoom = {
  // Function to create the user_room table
  createTable: async () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        roomId INT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id),
        FOREIGN KEY (roomId) REFERENCES rooms (id)
      )
    `;
    try {
      const [rows, fields] = await pool.query(createTableQuery);
      console.log("user_room table created:");
    } catch (error) {
      console.error("Error creating user_room table:", error);
    }
  },

  // Add other model-related functions here
};

// Export the UserRoom model for use in other parts of the application
module.exports = UserRoom;
