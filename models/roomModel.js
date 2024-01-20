const pool = require("../utils/database");

// Define the table name
const tableName = "rooms";

// Define the Rooms model
const Rooms = {
  // Function to create the rooms table
  createTable: async () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        roomId INT NOT NULL,
        password VARCHAR(255) NOT NULL,
        creatorId INT NOT NULL,
        FOREIGN KEY (creatorId) REFERENCES users (id)
      )
    `;
    try {
      const [rows, fields] = await pool.query(createTableQuery);
      console.log("Rooms table created:");
    } catch (error) {
      console.error("Error creating Rooms table:", error);
    }
  },

  // Add other model-related functions here
};

// Export the Rooms model for use in other parts of the application
module.exports = Rooms;
