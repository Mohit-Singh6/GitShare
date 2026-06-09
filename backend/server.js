const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const snippetRoutes = require('./routes/snippetRoutes');
const tagRoutes = require('./routes/tagRoutes');

app.use('/api/users', userRoutes);
app.use('/api/snippets', snippetRoutes);
app.use('/api/tags', tagRoutes);


// Test Connection Route
// app.get("/api/test-db", async (req, res) => {
//   try {
//     // This query tests if your tables exist by pulling your user records
//     const result = await db.query("SELECT * FROM users;");
    
//     res.status(200).json({
//       message: "Successfully connected to PostgreSQL via Neon!",
//       userCount: result.rowCount,
//       data: result.rows, // This will contain the test user you seeded earlier
//     });
//   } catch (err) {
//     console.error("Database connection error:", err.message);
//     res.status(500).json({ error: "Database query failed", details: err.message });
//   }
// });

// Basic Root Route
app.get("/", (req, res) => {
  res.send("GitShare API Server is running smoothly.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is happily humming on port ${PORT}`);
});