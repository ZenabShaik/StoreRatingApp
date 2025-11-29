const express = require('express'); 
const router = express.Router();

const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

// Dashboard
router.get('/dashboard', auth, requireRole('admin'), adminController.getDashboardCounts);

// Users
router.get('/users', auth, requireRole('admin'), adminController.getUsers);
router.post('/add-user', auth, requireRole('admin'), adminController.addUser);

// Stores
router.get('/stores', auth, requireRole('admin'), adminController.getStores);
router.post('/add-store', auth, requireRole('admin'), adminController.addStore);

// 🔹 NEW: list owners for dropdown
router.get('/owners', auth, requireRole('admin'), adminController.getOwners);


// ✅ NEW: single-user detail route
router.get(
  '/users/:id',
  auth,
  requireRole('admin'),
  adminController.getUserDetails
);


module.exports = router;

