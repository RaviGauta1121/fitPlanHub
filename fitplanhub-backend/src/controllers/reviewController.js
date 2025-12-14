const Review = require('../models/Review');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const Notification = require('../models/Notification');

const createReview = async (req, res) => {
  try {
    const { planId, rating, comment } = req.body;

    // Check if user has active subscription
    const subscription = await Subscription.findOne({
      user: req.user.id,
      plan: planId,
      endDate: { $gte: new Date() }
    });

    const isVerified = !!subscription;

    // Check if review already exists
    const existingReview = await Review.findOne({
      user: req.user.id,
      plan: planId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this plan' });
    }

    const review = await Review.create({
      plan: planId,
      user: req.user.id,
      rating,
      comment,
      isVerifiedPurchase: isVerified
    });

    // Update plan average rating
    const reviews = await Review.find({ plan: planId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Plan.findByIdAndUpdate(planId, {
      averageRating: avgRating,
      reviewCount: reviews.length
    });

    // Notify trainer
    const plan = await Plan.findById(planId);
    await Notification.create({
      user: plan.trainer,
      type: 'review',
      title: 'New Review',
      message: `Someone reviewed your plan: ${plan.title}`,
      link: `/plans/${planId}`
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    res.status(201).json({ success: true, data: populatedReview });
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

const getPlanReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ plan: req.params.planId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user.id });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();

    // Recalculate average rating
    const reviews = await Review.find({ plan: review.plan });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Plan.findByIdAndUpdate(review.plan, {
      averageRating: avgRating
    });

    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user.id });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    const planId = review.plan;
    await review.deleteOne();

    // Recalculate average rating
    const reviews = await Review.find({ plan: planId });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    
    await Plan.findByIdAndUpdate(planId, {
      averageRating: avgRating,
      reviewCount: reviews.length
    });

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};

module.exports = {
  createReview,
  getPlanReviews,
  updateReview,
  deleteReview
};
