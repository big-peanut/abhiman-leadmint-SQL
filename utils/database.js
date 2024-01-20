const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log("pool created");

// Export the pool for use in other parts of the application
module.exports = pool;
