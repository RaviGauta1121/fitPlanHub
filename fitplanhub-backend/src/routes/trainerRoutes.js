const express = require('express');
const {
  getAllTrainers,
  getTrainerById,
  followTrainer,
  unfollowTrainer,
  getFollowedTrainers,
  getFeed,
  getMyFollowers,
  getMySubscribers
} = require('../controllers/trainerController');
const { protect } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();


router.get('/', protect, getAllTrainers);
router.get('/followed', protect, getFollowedTrainers);
router.get('/feed', protect, getFeed);
router.get('/my-followers', protect, checkRole('trainer'), getMyFollowers);
router.get('/my-subscribers', protect, checkRole('trainer'), getMySubscribers);


router.get('/:id', protect, getTrainerById);
router.post('/:id/follow', protect, followTrainer);
router.delete('/:id/unfollow', protect, unfollowTrainer);

module.exports = router;
