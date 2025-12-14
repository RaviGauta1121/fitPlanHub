const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');

const subscribeToPlan = async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const existingSubscription = await Subscription.findOne({
      user: req.user.id,
      plan: planId,
      endDate: { $gte: new Date() }
    });

    if (existingSubscription) {
      return res.status(400).json({ message: 'Already subscribed to this plan' });
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const subscription = await Subscription.create({
      user: req.user.id,
      plan: planId,
      amount: plan.price,
      endDate,
      paymentStatus: 'completed'
    });

    res.status(201).json({ 
      success: true, 
      message: 'Subscription successful', 
      data: subscription 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating subscription', error: error.message });
  }
};

const getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id })
      .populate('plan')
      .populate({
        path: 'plan',
        populate: { path: 'trainer', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: subscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
  }
};

module.exports = { subscribeToPlan, getUserSubscriptions };
