const db = require('./database');

// 1) Get owner id by email
db.get(`SELECT id FROM users WHERE email = ?`, ['shaik.bandi@gmail.com'], (err, ownerRow) => {
    if (err) return console.log("❌ Error:", err.message);

    if (!ownerRow) return console.log("❌ Owner not found!");

    const ownerId = ownerRow.id;

    // 2) Update store
    db.run(`UPDATE stores SET owner_id = ? WHERE email = ?`,
        [ownerId, 'shaikznw@gmail.com'],
        function (err) {
            if (err) return console.log("❌ Error updating store:", err.message);

            console.log("✅ Store linked to owner successfully!");
        }
    );
});
