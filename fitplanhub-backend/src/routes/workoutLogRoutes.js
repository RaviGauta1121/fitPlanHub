const express = require('express');
const {
  createWorkoutLog,
  getUserWorkoutLogs,
  getWorkoutStats,
  deleteWorkoutLog
} = require('../controllers/workoutLogController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', protect, checkRole('user'), createWorkoutLog);
router.get('/', protect, checkRole('user'), getUserWorkoutLogs);
router.get('/stats', protect, checkRole('user'), getWorkoutStats);
router.delete('/:id', protect, checkRole('user'), deleteWorkoutLog);

module.exports = router;
