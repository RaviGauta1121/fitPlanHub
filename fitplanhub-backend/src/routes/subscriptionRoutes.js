const express = require('express');
const { subscribeToPlan, getUserSubscriptions } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, checkRole('user'), subscribeToPlan);
router.get('/', protect, checkRole('user'), getUserSubscriptions);

module.exports = router;
