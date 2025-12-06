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
  if (name.length < 3 || name.length > 20) {
  return res.status(400).json({
    message: "Name must be between 3 and 20 characters"
  });
  }

  db.get("SELECT * FROM users WHERE email=?", [email], async (err, row) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (row) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (name, email, password, address, role)
       VALUES (?, ?, ?, ?, ?)` ,
      [name, email, hashed, address || "", role || "user"],
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
    ✅✅ FIXED & HARDENED LOGIN
====================================================== */
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const sql = `SELECT * FROM users WHERE email = ?`;

  db.get(sql, [email], async (err, user) => {
    if (err) {
      console.error("Login DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let isMatch = false;

    // ✅ Primary: bcrypt check
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (e) {
      console.log("⚠️ bcrypt compare failed:", e.message);
    }

    // ✅ Fallback: plain-text legacy password support
    if (!isMatch && password === user.password) {
      console.log("✅ Legacy password detected → auto-upgrading");

      const newHash = await bcrypt.hash(password, 10);
      db.run("UPDATE users SET password = ? WHERE id = ?", [newHash, user.id]);

      isMatch = true;
    }

    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ JWT TOKEN
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
};



/* ======================================================
    UPDATE PASSWORD
====================================================== */
exports.updatePassword = (req, res) => {
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both passwords required" });
  }

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message:
        "New password must be 8–16 characters, include one uppercase letter and one special character.",
    });
  }

  db.get("SELECT password FROM users WHERE id = ?", [userId], async (err, user) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!user) return res.status(404).json({ message: "User not found" });

    let match = false;
    try {
      match = await bcrypt.compare(currentPassword, user.password);
    } catch {}

    if (!match)
      return res.status(400).json({ message: "Current password incorrect" });

    const newHash = await bcrypt.hash(newPassword, 10);

    db.run(
      "UPDATE users SET password = ? WHERE id = ?",
      [newHash, userId],
      function (err4) {
        if (err4)
          return res.status(500).json({ message: "Error updating password" });

        res.json({ message: "Password updated successfully" });
      }
    );
  });
};
