const pool = require("../utils/database");

// Define the table name
const tableName = "users";

// Define the Users model
const Users = {
  // Function to create the users table
  createTable: async () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        deviceId INT NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        coins INT,
        isPrime BOOLEAN DEFAULT false
      )
    `;
    try {
      const [rows, fields] = await pool.query(createTableQuery);
      console.log("Users table created:");
    } catch (error) {
      console.error("Error creating Users table:", error);
    }
  },
};

// Export the Users model for use in other parts of the application
module.exports = Users;
