// backend/db/database.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "store-rating.db");
console.log("✅ ACTUAL DB PATH:", dbPath);


// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to SQLite database:", err.message);
  } else {
    console.log("Connected to SQLite database successfully!");
  }
});

// Create tables if they don't exist
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    address TEXT,
    role TEXT CHECK(role IN ('admin', 'user', 'owner')) NOT NULL
  )`);

  // Stores table
 db.run(`CREATE TABLE IF NOT EXISTS stores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  owner_id INTEGER,
  FOREIGN KEY (owner_id) REFERENCES users(id)
)`);


  // Ratings table
  db.run(`CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    store_id INTEGER,
    rating INTEGER CHECK(rating BETWEEN 1 AND 5),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (store_id) REFERENCES stores(id)
  )`);

  console.log("Tables checked/created successfully!");
});

module.exports = db;
