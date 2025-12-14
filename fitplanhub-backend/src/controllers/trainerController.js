const User = require('../models/User');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');

// Get all trainers
const getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer' }).select('-password');
    res.json({
      success: true,
      data: trainers
    });
  } catch (error) {
    console.error('Error in getAllTrainers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trainers',
      error: error.message
    });
  }
};

// Get trainer by ID with their plans
const getTrainerById = async (req, res) => {
  try {
    const trainer = await User.findById(req.params.id).select('-password');
    if (!trainer || trainer.role !== 'trainer') {
      return res.status(404).json({ 
        success: false,
        message: 'Trainer not found' 
      });
    }

    const plans = await Plan.find({ trainer: req.params.id }).populate('trainer', 'name email');
    
    res.json({
      success: true,
      data: {
        trainer,
        plans
      }
    });
  } catch (error) {
    console.error('Error in getTrainerById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trainer',
      error: error.message
    });
  }
};

// Follow a trainer
const followTrainer = async (req, res) => {
  try {
    const trainerId = req.params.id;
    const userId = req.user.id;

    console.log('Follow request - User:', userId, 'Trainer:', trainerId);

    if (trainerId === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const trainer = await User.findById(trainerId);
    if (!trainer || trainer.role !== 'trainer') {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize following array if it doesn't exist
    if (!user.following) {
      user.following = [];
    }

    // Check if already following
    const isFollowing = user.following.some(id => id.toString() === trainerId);
    if (isFollowing) {
      return res.status(400).json({
        success: false,
        message: 'Already following this trainer'
      });
    }

    // Add to following array
    user.following.push(trainerId);
    await user.save();

    console.log('Successfully followed trainer');

    res.json({
      success: true,
      message: 'Trainer followed successfully'
    });
  } catch (error) {
    console.error('Error in followTrainer:', error);
    res.status(500).json({
      success: false,
      message: 'Error following trainer',
      error: error.message
    });
  }
};


// Unfollow a trainer
const unfollowTrainer = async (req, res) => {
  try {
    const trainerId = req.params.id;
    const userId = req.user.id;

    console.log('Unfollow request - User:', userId, 'Trainer:', trainerId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize following array if it doesn't exist
    if (!user.following) {
      user.following = [];
    }

    // Remove from following array
    user.following = user.following.filter(id => id.toString() !== trainerId);
    await user.save();

    console.log('Successfully unfollowed trainer');

    res.json({
      success: true,
      message: 'Trainer unfollowed successfully'
    });
  } catch (error) {
    console.error('Error in unfollowTrainer:', error);
    res.status(500).json({
      success: false,
      message: 'Error unfollowing trainer',
      error: error.message
    });
  }
};

// Get followed trainers
const getFollowedTrainers = async (req, res) => {
  try {
    console.log('Getting followed trainers for user:', req.user.id);
    
    const user = await User.findById(req.user.id).populate({
      path: 'following',
      select: 'name email certifications role',
      match: { role: 'trainer' }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('Found followed trainers:', user.following ? user.following.length : 0);

    res.json({
      success: true,
      data: user.following || []
    });
  } catch (error) {
    console.error('Error in getFollowedTrainers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching followed trainers',
      error: error.message
    });
  }
};


// Get feed from followed trainers
const getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const plans = await Plan.find({
      trainer: { $in: user.following }
    })
      .populate('trainer', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Error in getFeed:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feed',
      error: error.message
    });
  }
};

// Get all users following this trainer
const getMyFollowers = async (req, res) => {
  try {
    const trainerId = req.user.id;

    console.log('Getting followers for trainer:', trainerId);

    // Find all users who have this trainer in their following array
    const followers = await User.find({
      following: trainerId,
      role: 'user'
    }).select('name email createdAt');

    console.log('Found followers:', followers.length);

    res.json({
      success: true,
      data: {
        followers: followers,
        count: followers.length
      }
    });
  } catch (error) {
    console.error('Error in getMyFollowers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching followers',
      error: error.message
    });
  }
};

// Get all users subscribed to trainer's plans
const getMySubscribers = async (req, res) => {
  try {
    const trainerId = req.user.id;

    console.log('Getting subscribers for trainer:', trainerId);

    // Get all plans by this trainer
    const trainerPlans = await Plan.find({ trainer: trainerId }).select('_id title price');

    if (trainerPlans.length === 0) {
      return res.json({
        success: true,
        data: {
          totalSubscribers: 0,
          totalSubscriptions: 0,
          subscribersByPlan: {},
          uniqueSubscribers: []
        }
      });
    }

    // Get all active subscriptions for these plans
    const subscriptions = await Subscription.find({
      plan: { $in: trainerPlans.map(p => p._id) },
      endDate: { $gte: new Date() }
    })
      .populate('user', 'name email')
      .populate('plan', 'title price')
      .sort({ startDate: -1 });

    console.log('Found subscriptions:', subscriptions.length);

    // Group subscribers by plan
    const subscribersByPlan = {};
    const uniqueSubscribers = new Map();

    subscriptions.forEach(sub => {
      if (!sub.user || !sub.plan) return;

      const planId = sub.plan._id.toString();
      if (!subscribersByPlan[planId]) {
        subscribersByPlan[planId] = {
          planTitle: sub.plan.title,
          planPrice: sub.plan.price,
          subscribers: []
        };
      }
      subscribersByPlan[planId].subscribers.push({
        userId: sub.user._id,
        name: sub.user.name,
        email: sub.user.email,
        startDate: sub.startDate,
        endDate: sub.endDate,
        amount: sub.amount || sub.plan.price
      });

      uniqueSubscribers.set(sub.user._id.toString(), {
        userId: sub.user._id,
        name: sub.user.name,
        email: sub.user.email
      });
    });

    res.json({
      success: true,
      data: {
        totalSubscribers: uniqueSubscribers.size,
        totalSubscriptions: subscriptions.length,
        subscribersByPlan,
        uniqueSubscribers: Array.from(uniqueSubscribers.values())
      }
    });
  } catch (error) {
    console.error('Error in getMySubscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscribers',
      error: error.message
    });
  }
};

module.exports = {
  getAllTrainers,
  getTrainerById,
  followTrainer,
  unfollowTrainer,
  getFollowedTrainers,
  getFeed,
  getMyFollowers,
  getMySubscribers
};
