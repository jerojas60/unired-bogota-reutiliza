const express = require('express');
const router = express.Router();
const { reserveItem, confirmDelivery } = require('../controllers/traceController');
const { protect } = require('../middleware/auth');

router.put('/reserve/:itemId', protect, reserveItem);
router.put('/confirm/:itemId', protect, confirmDelivery);

module.exports = router;