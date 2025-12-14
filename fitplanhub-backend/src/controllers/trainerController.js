const User = require('../models/User');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');

// -----------------------------
// Trainers
// -----------------------------

// Get all trainers (public list)
const getAllTrainers = async (req, res) => {
try {
const trainers = await User.find({ role: 'trainer' })
.select('-password'); // never send passwords, obviously

res.json({
  success: true,
  data: trainers
});


} catch (err) {
console.error('[getAllTrainers] failed:', err);
res.status(500).json({
success: false,
message: 'Error fetching trainers',
error: err.message
});
}
};

// Get a single trainer + their plans
const getTrainerById = async (req, res) => {
try {
const trainerId = req.params.id;

const trainer = await User.findById(trainerId).select('-password');
if (!trainer || trainer.role !== 'trainer') {
  return res.status(404).json({
    success: false,
    message: 'Trainer not found'
  });
}

const plans = await Plan.find({ trainer: trainerId })
  .populate('trainer', 'name email');

res.json({
  success: true,
  data: {
    trainer,
    plans
  }
});


} catch (err) {
console.error('[getTrainerById] error:', err);
res.status(500).json({
success: false,
message: 'Error fetching trainer',
error: err.message
});
}
};

// -----------------------------
// Follow / Unfollow
// -----------------------------

// Follow a trainer
const followTrainer = async (req, res) => {
try {
const trainerId = req.params.id;
const userId = req.user.id;

console.log('Follow trainer:', { userId, trainerId });

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

// Initialize following array if missing (older users)
if (!Array.isArray(user.following)) {
  user.following = [];
}

const alreadyFollowing = user.following.some(
  id => id.toString() === trainerId
);

if (alreadyFollowing) {
  return res.status(400).json({
    success: false,
    message: 'Already following this trainer'
  });
}

user.following.push(trainerId);
await user.save();

console.log('Trainer followed successfully');

res.json({
  success: true,
  message: 'Trainer followed successfully'
});


} catch (err) {
console.error('[followTrainer] error:', err);
res.status(500).json({
success: false,
message: 'Error following trainer',
error: err.message
});
}
};

// Unfollow a trainer
const unfollowTrainer = async (req, res) => {
try {
const trainerId = req.params.id;
const userId = req.user.id;

console.log('Unfollow trainer:', { userId, trainerId });

const user = await User.findById(userId);
if (!user) {
  return res.status(404).json({
    success: false,
    message: 'User not found'
  });
}

if (!Array.isArray(user.following)) {
  user.following = [];
}

user.following = user.following.filter(
  id => id.toString() !== trainerId
);

await user.save();

res.json({
  success: true,
  message: 'Trainer unfollowed successfully'
});


} catch (err) {
console.error('[unfollowTrainer] error:', err);
res.status(500).json({
success: false,
message: 'Error unfollowing trainer',
error: err.message
});
}
};

// -----------------------------
// Following / Feed
// -----------------------------

// Get trainers the user follows
const getFollowedTrainers = async (req, res) => {
try {
const userId = req.user.id;
console.log('Fetching followed trainers for:', userId);

const user = await User.findById(userId).populate({
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

res.json({
  success: true,
  data: user.following || []
});


} catch (err) {
console.error('[getFollowedTrainers] error:', err);
res.status(500).json({
success: false,
message: 'Error fetching followed trainers',
error: err.message
});
}
};

// Get feed (latest plans from followed trainers)
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
  trainer: { $in: user.following || [] }
})
  .populate('trainer', 'name email')
  .sort({ createdAt: -1 })
  .limit(20);

res.json({
  success: true,
  data: plans
});


} catch (err) {
console.error('[getFeed] error:', err);
res.status(500).json({
success: false,
message: 'Error fetching feed',
error: err.message
});
}
};

// -----------------------------
// Trainer Insights
// -----------------------------

// Get followers for logged-in trainer
const getMyFollowers = async (req, res) => {
try {
const trainerId = req.user.id;
console.log('Fetching followers for trainer:', trainerId);

const followers = await User.find({
  following: trainerId,
  role: 'user'
}).select('name email createdAt');

res.json({
  success: true,
  data: {
    followers,
    count: followers.length
  }
});


} catch (err) {
console.error('[getMyFollowers] error:', err);
res.status(500).json({
success: false,
message: 'Error fetching followers',
error: err.message
});
}
};

// Get subscribers for trainer's plans
const getMySubscribers = async (req, res) => {
try {
const trainerId = req.user.id;
console.log('Fetching subscribers for trainer:', trainerId);

const trainerPlans = await Plan.find({ trainer: trainerId })
  .select('_id title price');

if (!trainerPlans.length) {
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

const subscriptions = await Subscription.find({
  plan: { $in: trainerPlans.map(p => p._id) },
  endDate: { $gte: new Date() }
})
  .populate('user', 'name email')
  .populate('plan', 'title price')
  .sort({ startDate: -1 });

const subscribersByPlan = {};
const uniqueSubscribers = new Map();

subscriptions.forEach(sub => {
  if (!sub.user || !sub.plan) return;

  const planKey = sub.plan._id.toString();

  if (!subscribersByPlan[planKey]) {
    subscribersByPlan[planKey] = {
      planTitle: sub.plan.title,
      planPrice: sub.plan.price,
      subscribers: []
    };
  }

  subscribersByPlan[planKey].subscribers.push({
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


} catch (err) {
console.error('[getMySubscribers] error:', err);
res.status(500).json({
success: false,
message: 'Error fetching subscribers',
error: err.message
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