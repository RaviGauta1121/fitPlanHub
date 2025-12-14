const User = require('../models/User');
const Plan = require('../models/Plan');

const getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer' }).select('-password');
    res.json({ success: true, data: trainers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainers', error: error.message });
  }
};

const getTrainerById = async (req, res) => {
  try {
    const trainer = await User.findOne({ _id: req.params.id, role: 'trainer' }).select('-password');
    
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    const plans = await Plan.find({ trainer: req.params.id, isActive: true });

    res.json({ success: true, data: { trainer, plans } });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainer', error: error.message });
  }
};

const followTrainer = async (req, res) => {
  try {
    const trainerId = req.params.id;

    const trainer = await User.findOne({ _id: trainerId, role: 'trainer' });
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    const user = await User.findById(req.user.id);

    if (user.followedTrainers.includes(trainerId)) {
      return res.status(400).json({ message: 'Already following this trainer' });
    }

    user.followedTrainers.push(trainerId);
    await user.save();

    res.json({ success: true, message: 'Trainer followed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error following trainer', error: error.message });
  }
};

const unfollowTrainer = async (req, res) => {
  try {
    const trainerId = req.params.id;

    const user = await User.findById(req.user.id);

    user.followedTrainers = user.followedTrainers.filter(
      id => id.toString() !== trainerId
    );

    await user.save();

    res.json({ success: true, message: 'Trainer unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing trainer', error: error.message });
  }
};

const getFollowedTrainers = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('followedTrainers', 'name email certifications');
    res.json({ success: true, data: user.followedTrainers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching followed trainers', error: error.message });
  }
};

const getPersonalizedFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('followedTrainers');

    const trainerIds = user.followedTrainers.map(trainer => trainer._id);

    const plans = await Plan.find({ 
      trainer: { $in: trainerIds },
      isActive: true 
    }).populate('trainer', 'name email certifications').sort({ createdAt: -1 });

    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feed', error: error.message });
  }
};

module.exports = {
  getAllTrainers,
  getTrainerById,
  followTrainer,
  unfollowTrainer,
  getFollowedTrainers,
  getPersonalizedFeed
};
