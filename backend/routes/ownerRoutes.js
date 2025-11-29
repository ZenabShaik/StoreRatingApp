const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

router.get('/my-store', auth, requireRole('owner'), ownerController.getMyStoreRatings);
router.get('/my-store/average', auth, requireRole('owner'), ownerController.getMyStoreAverage);


module.exports = router;
