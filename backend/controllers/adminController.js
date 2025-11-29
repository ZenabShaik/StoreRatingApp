const db = require('../db/database');
const bcrypt = require("bcryptjs");

// ======================================================
// =============== ADMIN DASHBOARD COUNTS ================
// ======================================================
exports.getDashboardCounts = (req, res) => {
    const stats = {};

    db.get(`SELECT COUNT(*) AS total_users FROM users`, [], (err, row) => {
        stats.users = row.total_users;

        db.get(`SELECT COUNT(*) AS total_stores FROM stores`, [], (err2, row2) => {
            stats.stores = row2.total_stores;

            db.get(`SELECT COUNT(*) AS total_ratings FROM ratings`, [], (err3, row3) => {
                stats.ratings = row3.total_ratings;

                res.json(stats);
            });
        });
    });
};


// ======================================================
// =============== GET ALL USERS (WITH FILTER) ==========
// ======================================================
exports.getUsers = (req, res) => {
    let sql = `SELECT id, name, email, address, role FROM users`;
    let params = [];

    if (req.query.role) {
        sql += ` WHERE role = ?`;
        params.push(req.query.role);
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};


// ======================================================
// =============== GET ALL OWNERS (FOR DROPDOWN) ========
// ======================================================
exports.getOwners = (req, res) => {
    const query = `SELECT id, name, email FROM users WHERE role = 'owner'`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Owner fetch error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(rows);
    });
};



// ======================================================
// =============== GET STORES WITH OWNER + AVG ==========
// ======================================================
exports.getStores = (req, res) => {
    const sql = `
    SELECT 
      stores.id,
      stores.name,
      stores.email AS store_email,
      stores.address,
      users.email AS owner_email,
      IFNULL(ROUND(AVG(ratings.rating), 1), 0) AS average_rating
    FROM stores
    LEFT JOIN users ON stores.owner_id = users.id
    LEFT JOIN ratings ON ratings.store_id = stores.id
    GROUP BY stores.id
    ORDER BY stores.id ASC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Store fetch error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(rows);
    });
};



// ======================================================
// ====================== ADD USER =======================
// ======================================================
exports.addUser = (req, res) => {
    const { name, email, address, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields required" });
    }

    // FUTURE: name length validation (20–60 chars)
    // FUTURE: password validation

    db.get("SELECT id FROM users WHERE email = ?", [email], async (err, row) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (row) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertSql = `
            INSERT INTO users (name, email, password, address, role)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.run(
            insertSql,
            [name, email, hashedPassword, address, role],
            function (err2) {
                if (err2) {
                    console.error("Add user error:", err2);
                    return res.status(500).json({ message: "Insert failed" });
                }

                res.json({ message: "User added successfully", id: this.lastID });
            }
        );
    });
};



// ======================================================
// ====================== ADD STORE ======================
// ======================================================
exports.addStore = (req, res) => {
    const { name, storeEmail, address, ownerId } = req.body;

    if (!name || !storeEmail || !ownerId) {
        return res.status(400).json({ message: "Store name, email & owner are required" });
    }

    // Validate owner existence
    const findOwner = `
        SELECT id FROM users WHERE id = ? AND role = 'owner'
    `;

    db.get(findOwner, [ownerId], (err, owner) => {
        if (err) {
            console.error("Owner lookup error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (!owner) {
            return res.status(400).json({
                message: "Owner not found or not an OWNER role"
            });
        }

        // Insert new store
        const insertStore = `
            INSERT INTO stores (name, email, address, owner_id)
            VALUES (?, ?, ?, ?)
        `;

        db.run(insertStore, [name, storeEmail, address || "", ownerId], function (err2) {
            if (err2) {
                console.error("Add store error:", err2);
                return res.status(500).json({ message: "Failed to create store" });
            }

            res.json({
                message: "Store added successfully",
                id: this.lastID
            });
        });
    });
};



// ======================================================
// ============= GET USER DETAILS + OWNER STORES =========
// ======================================================
exports.getUserDetails = (req, res) => {
    const userId = req.params.id;

    const userSql = `
      SELECT id, name, email, address, role
      FROM users
      WHERE id = ?
    `;

    db.get(userSql, [userId], (err, user) => {
        if (err) {
            console.error("User detail error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "owner") {
            return res.json({
                user,
                stores: [],
            });
        }

        const storeSql = `
          SELECT 
            s.id,
            s.name,
            s.email AS store_email,
            s.address,
            ROUND(AVG(r.rating), 1) AS average_rating
          FROM stores s
          LEFT JOIN ratings r ON r.store_id = s.id
          WHERE s.owner_id = ?
          GROUP BY s.id
          ORDER BY s.id ASC
        `;

        db.all(storeSql, [userId], (err2, stores) => {
            if (err2) {
                console.error("Owner store detail error:", err2);
                return res.status(500).json({ message: "Database error" });
            }

            res.json({
                user,
                stores: stores || [],
            });
        });
    });
};
