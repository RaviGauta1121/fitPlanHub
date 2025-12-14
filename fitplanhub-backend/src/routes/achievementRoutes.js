const express = require('express');
const { getUserAchievements } = require('../controllers/achievementController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getUserAchievements);

module.exports = router;
