const db = require("../db/database");

// =====================================================
// ✅ 1. ADMIN: CREATE NEW STORE (WITH STORE EMAIL)
// =====================================================
exports.createStore = (req, res) => {
  const { name, storeEmail, address, ownerId } = req.body;

  if (!name || !storeEmail || !ownerId) {
    return res.status(400).json({
      message: "Store name, store email, and owner are required",
    });
  }

  // ✅ Verify owner exists and is OWNER
  const findOwner = `
    SELECT id FROM users 
    WHERE id = ? AND role = 'owner'
  `;

  db.get(findOwner, [ownerId], (err, owner) => {
    if (err) {
      console.error("Owner lookup error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (!owner) {
      return res.status(400).json({
        message: "Owner not found or not an OWNER role",
      });
    }

    const insertStore = `
      INSERT INTO stores (name, email, address, owner_id)
      VALUES (?, ?, ?, ?)
    `;

    db.run(
      insertStore,
      [name, storeEmail, address || "", ownerId],
      function (err2) {
        if (err2) {
          console.error("Add store error:", err2);
          return res.status(500).json({ message: "Failed to create store" });
        }

        res.status(201).json({
          message: "Store added successfully",
          id: this.lastID,
        });
      }
    );
  });
};

// =====================================================
// ✅ 2. USER + ADMIN: GET ALL STORES WITH AVG RATING
// =====================================================
exports.getStores = (req, res) => {
  const query = `
    SELECT 
      s.id,
      s.name,
      s.email AS store_email,
      s.address,
      IFNULL(ROUND(AVG(r.rating), 1), 0) AS average_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    GROUP BY s.id
    ORDER BY s.id ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Store fetch error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(rows);
  });
};

// =====================================================
// ✅ 3. USER: GET STORES + USER’S OWN RATING
// =====================================================
exports.getStoresForUser = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      s.id,
      s.name,
      s.address,
      s.email AS store_email,

      IFNULL(ROUND(AVG(r.rating), 1), 0) AS average_rating,

      (
        SELECT rating 
        FROM ratings 
        WHERE user_id = ? AND store_id = s.id
      ) AS user_rating

    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    GROUP BY s.id
    ORDER BY s.id ASC
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error("Store fetch error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(rows);
  });
};
