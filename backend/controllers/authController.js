// backend/controllers/authController.js
const db = require("../db/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

/* ======================================================
    REGISTER USER
====================================================== */
exports.register = (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  // Name validation
  if (name.length < 20 || name.length > 60) {
    return res.status(400).json({
      message: "Name must be between 20 and 60 characters"
    });
  }

  // Check email exists
  db.get("SELECT * FROM users WHERE email=?", [email], async (err, row) => {
    if (row) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (name, email, password, address, role)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashed, address, role || "user"],
      function (err2) {
        if (err2) {
          console.log(err2);
          return res.status(500).json({ message: "Registration failed" });
        }
        res.json({ message: "Registration successful" });
      }
    );
  });
};



/* ======================================================
    LOGIN
====================================================== */
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const sql = `SELECT * FROM users WHERE email = ?`;

  db.get(sql, [email], (err, user) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // Compare hashed password
    bcrypt.compare(password, user.password, (err2, match) => {
      if (err2) return res.status(500).json({ message: "Server error" });
      if (!match) return res.status(401).json({ message: "Invalid email or password" });

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Login successful",
        token,
        role: user.role,
        email: user.email,
      });
    });
  });
};



/* ======================================================
    UPDATE PASSWORD (NEW)
====================================================== */
exports.updatePassword = (req, res) => {
  const userId = req.user?.id; // auth middleware injects req.user
  const { currentPassword, newPassword } = req.body;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both passwords required" });
  }

  // Password validation (8–16 chars, 1 uppercase, 1 special)
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message:
        "New password must be 8–16 characters, include one uppercase letter and one special character.",
    });
  }

  // Fetch old password
  db.get("SELECT password FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare current password
    bcrypt.compare(currentPassword, user.password, (err2, match) => {
      if (err2) return res.status(500).json({ message: "Server error" });
      if (!match)
        return res.status(400).json({ message: "Current password incorrect" });

      // Hash new password
      bcrypt.hash(newPassword, 10, (err3, hash) => {
        if (err3)
          return res.status(500).json({ message: "Error hashing password" });

        // Update password
        db.run(
          "UPDATE users SET password = ? WHERE id = ?",
          [hash, userId],
          function (err4) {
            if (err4)
              return res.status(500).json({ message: "Error updating password" });

            res.json({ message: "Password updated successfully" });
          }
        );
      });
    });
  });
};
