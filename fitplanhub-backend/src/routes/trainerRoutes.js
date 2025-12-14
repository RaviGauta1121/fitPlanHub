const express = require('express');
const {
  getAllTrainers,
  getTrainerById,
  followTrainer,
  unfollowTrainer,
  getFollowedTrainers,
  getPersonalizedFeed
} = require('../controllers/trainerController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, getAllTrainers);
router.get('/followed', protect, checkRole('user'), getFollowedTrainers);
router.get('/feed', protect, checkRole('user'), getPersonalizedFeed);
router.get('/:id', protect, getTrainerById);
router.post('/:id/follow', protect, checkRole('user'), followTrainer);
router.delete('/:id/unfollow', protect, checkRole('user'), unfollowTrainer);

module.exports = router;
