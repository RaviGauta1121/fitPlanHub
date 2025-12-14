
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');

const createPlan = async (req, res) => {
  try {
    const { title, description, price, duration, exercises } = req.body;

    const plan = await Plan.create({
      title,
      description,
      price,
      duration,
      trainer: req.user.id,
      exercises: exercises || []
    });

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ message: 'Error creating plan', error: error.message });
  }
};

const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).populate('trainer', 'name email certifications');

    const plansWithAccess = await Promise.all(plans.map(async (plan) => {
      const hasSubscription = await Subscription.findOne({
        user: req.user.id,
        plan: plan._id,
        endDate: { $gte: new Date() }
      });

      if (hasSubscription) {
        return plan;
      } else {
        return {
          _id: plan._id,
          title: plan.title,
          price: plan.price,
          duration: plan.duration,
          trainer: plan.trainer,
          preview: true
        };
      }
    }));

    res.json({ success: true, data: plansWithAccess });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans', error: error.message });
  }
};

const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).populate('trainer', 'name email certifications');

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const hasSubscription = await Subscription.findOne({
      user: req.user.id,
      plan: plan._id,
      endDate: { $gte: new Date() }
    });

    if (!hasSubscription && req.user.role !== 'trainer') {
      return res.json({
        success: true,
        data: {
          _id: plan._id,
          title: plan.title,
          price: plan.price,
          duration: plan.duration,
          trainer: plan.trainer,
          preview: true,
          message: 'Subscribe to view full plan details'
        }
      });
    }

    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plan', error: error.message });
  }
};

const getTrainerPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ trainer: req.user.id });
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainer plans', error: error.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, trainer: req.user.id });

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found or unauthorized' });
    }

    const { title, description, price, duration, exercises } = req.body;

    plan.title = title || plan.title;
    plan.description = description || plan.description;
    plan.price = price !== undefined ? price : plan.price;
    plan.duration = duration || plan.duration;
    plan.exercises = exercises || plan.exercises;

    await plan.save();

    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ message: 'Error updating plan', error: error.message });
  }
};

const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, trainer: req.user.id });

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found or unauthorized' });
    }

    await plan.deleteOne();

    res.json({ success: true, message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting plan', error: error.message });
  }
};
const searchPlans = async (req, res) => {
  try {
    const { keyword, category, difficulty, minPrice, maxPrice, minRating, sort } = req.query;

    let query = { isActive: true };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [new RegExp(keyword, 'i')] } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_low') sortOption = { price: 1 };
    if (sort === 'price_high') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { averageRating: -1 };
    if (sort === 'popular') sortOption = { subscriberCount: -1 };

    const plans = await Plan.find(query)
      .populate('trainer', 'name email certifications')
      .sort(sortOption);

    const plansWithAccess = await Promise.all(plans.map(async (plan) => {
      const hasSubscription = await Subscription.findOne({
        user: req.user.id,
        plan: plan._id,
        endDate: { $gte: new Date() }
      });

      if (hasSubscription) {
        return plan;
      } else {
        return {
          _id: plan._id,
          title: plan.title,
          price: plan.price,
          duration: plan.duration,
          category: plan.category,
          difficulty: plan.difficulty,
          trainer: plan.trainer,
          averageRating: plan.averageRating,
          reviewCount: plan.reviewCount,
          subscriberCount: plan.subscriberCount,
          preview: true
        };
      }
    }));

    res.json({ success: true, data: plansWithAccess, count: plans.length });
  } catch (error) {
    res.status(500).json({ message: 'Error searching plans', error: error.message });
  }
};

module.exports = {
  createPlan,
  getAllPlans,
  getPlanById,
  getTrainerPlans,
  updatePlan,
  deletePlan,
  searchPlans
};
