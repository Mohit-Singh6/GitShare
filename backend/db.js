const { Pool } = require("pg");
require("dotenv").config();

// Create a pool instance using your Neon Connection URI from your .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // This line is highly recommended for Neon/cloud databases to secure the connection
  ssl: {
    rejectUnauthorized: false, 
  },
});

// Export the pool so you can import it into your route files or server.js
module.exports = {
  query: (text, params) => pool.query(text, params),
};