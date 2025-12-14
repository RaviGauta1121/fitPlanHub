const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['first_workout', 'week_streak', 'month_streak', 'plan_completed', 'follower_milestone', 'review_milestone'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  icon: String,
  earnedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Achievement', achievementSchema);
