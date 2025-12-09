// server.js
const express = require("express");
const cors = require("cors");
const db = require("./db/database");
require("dotenv").config();

const app = express();

// ================= CORS SETUP =================
const allowedOrigins = [
  "http://localhost:3000",              // local React dev
  "https://storerating.shaikzenab.me",  // your custom Vercel domain
  // optional: also add your Vercel default domain if you use it
  // "https://your-project-name.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman) or allowed origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false, // set true only if using cookies/auth headers that need it
};

// ✅ Apply CORS globally BEFORE routes
app.use(cors(corsOptions));

// =================================================

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
  db.all(
    "SELECT name FROM sqlite_master WHERE type='table';",
    [],
    (err, rows) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      res.json({ tables: rows });
    }
  );
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
