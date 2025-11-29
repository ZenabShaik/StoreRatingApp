const db = require('../db/database');

exports.addRating = (req, res) => {
    const userId = req.user.id;
    const { store_id, rating } = req.body;

    if (!store_id || !rating)
        return res.status(400).json({ message: "store_id and rating required" });

    const query = `
        INSERT INTO ratings (user_id, store_id, rating)
        VALUES (?, ?, ?)
    `;

    db.run(query, [userId, store_id, rating], function(err) {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({
            message: "Rating submitted",
            rating_id: this.lastID
        });
    });
};

exports.updateRating = (req, res) => {
    const ratingId = req.params.id;
    const userId = req.user.id;
    const { rating } = req.body;

    const checkQuery = 'SELECT * FROM ratings WHERE id=? AND user_id=?';

    db.get(checkQuery, [ratingId, userId], (err, row) => {
        if (err || !row) return res.status(403).json({ message: "Not allowed" });

        const updateQuery = 'UPDATE ratings SET rating=? WHERE id=?';

        db.run(updateQuery, [rating, ratingId], function(err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ message: "Rating updated" });
        });
    });
};
