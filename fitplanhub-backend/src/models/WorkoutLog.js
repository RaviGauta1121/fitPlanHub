const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  exercises: [{
    exerciseName: String,
    setsCompleted: Number,
    repsCompleted: Number,
    weight: Number,
    notes: String
  }],
  duration: {
    type: Number, // in minutes
    required: true
  },
  caloriesBurned: {
    type: Number
  },
  notes: String,
  mood: {
    type: String,
    enum: ['excellent', 'good', 'average', 'tired', 'exhausted']
  }
}, {
  timestamps: true
});

workoutLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
