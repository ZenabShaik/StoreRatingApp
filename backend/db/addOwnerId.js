const db = require('./database');

db.run(`ALTER TABLE stores ADD COLUMN owner_id INTEGER;`, (err) => {
    if (err) {
        console.log("❌ Could not add owner_id:", err.message);
    } else {
        console.log("✅ owner_id column added successfully!");
    }
});
