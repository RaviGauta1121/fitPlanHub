const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Plan title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: 1
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'weight_loss', 'muscle_gain', 'endurance', 'general'],
    default: 'general'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exercises: [{
    name: String,
    sets: Number,
    reps: Number,
    description: String,
    videoUrl: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  subscriberCount: {
    type: Number,
    default: 0
  },
  tags: [String]
}, {
  timestamps: true
});

planSchema.index({ trainer: 1 });
planSchema.index({ category: 1, difficulty: 1 });
planSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Plan', planSchema);
