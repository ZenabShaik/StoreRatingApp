// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// Register (if you are using it)
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// 🔐 Update Password (protected)
// UPDATE PASSWORD
router.post("/update-password", auth, authController.updatePassword);


module.exports = router;
