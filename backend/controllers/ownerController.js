const db = require('../db/database');

exports.getMyStoreRatings = (req, res) => {
    const ownerId = req.user.id;

    const query = `
        SELECT 
            ratings.id,
            users.name AS user_name,
            ratings.rating
        FROM ratings
        JOIN users ON ratings.user_id = users.id
        JOIN stores ON ratings.store_id = stores.id
        WHERE stores.owner_id = ?;
    `;

    db.all(query, [ownerId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

// Get average rating of the owner's store
exports.getMyStoreAverage = (req, res) => {
    const ownerId = req.user.id;

    const query = `
        SELECT 
            IFNULL(AVG(ratings.rating), 0) AS average_rating
        FROM ratings
        JOIN stores ON ratings.store_id = stores.id
        WHERE stores.owner_id = ?;
    `;

    db.get(query, [ownerId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
            average_rating: parseFloat(row.average_rating).toFixed(1)
        });
    });
};
