const express = require("express");
const cors = require("cors");
const db = require("./db/database");
require("dotenv").config();

const app = express();
// verified push test

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/stores", require("./routes/storeRoutes"));
app.use("/api/ratings", require("./routes/ratingRoutes"));
app.use("/api/owner", require("./routes/ownerRoutes"));

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Store Rating API is running successfully!");
});

// DB Test Route
app.get("/test-db", (req, res) => {
  db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error", error: err.message });
    res.json({ tables: rows });
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
