const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

router.post('/', auth, requireRole('user'), ratingController.addRating);
router.patch('/:id', auth, requireRole('user'), ratingController.updateRating);


module.exports = router;
