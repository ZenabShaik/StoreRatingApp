const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const requireRole = require("../middleware/role");
const storeController = require("../controllers/storeController");

// =====================================================
// ✅ USER STORE LIST (WITH USER RATING)
// =====================================================
router.get("/user-list", auth, storeController.getStoresForUser);

// =====================================================
// ✅ ADMIN CREATE STORE
// =====================================================
router.post(
  "/create",
  auth,
  requireRole("admin"),
  storeController.createStore
);

// =====================================================
// ✅ ADMIN + USER STORE LIST (AVG RATING)
// =====================================================
router.get("/", auth, storeController.getStores);

module.exports = router;
