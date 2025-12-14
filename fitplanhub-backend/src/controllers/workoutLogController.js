const WorkoutLog = require('../models/WorkoutLog');
const Achievement = require('../models/Achievement');
const Notification = require('../models/Notification');

const createWorkoutLog = async (req, res) => {
  try {
    const { planId, exercises, duration, caloriesBurned, notes, mood } = req.body;

    const log = await WorkoutLog.create({
      user: req.user.id,
      plan: planId,
      exercises,
      duration,
      caloriesBurned,
      notes,
      mood
    });

    // Check for achievements
    const totalLogs = await WorkoutLog.countDocuments({ user: req.user.id });
    
    if (totalLogs === 1) {
      await Achievement.create({
        user: req.user.id,
        type: 'first_workout',
        title: 'First Workout! 🎉',
        description: 'Completed your first workout',
        icon: '🏋️'
      });
    }

    // Check for streak
    const recentLogs = await WorkoutLog.find({
      user: req.user.id,
      date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    if (recentLogs.length === 7) {
      await Achievement.create({
        user: req.user.id,
        type: 'week_streak',
        title: '7-Day Streak! 🔥',
        description: 'Worked out 7 days in a row',
        icon: '🔥'
      });
    }

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ message: 'Error creating workout log', error: error.message });
  }
};

const getUserWorkoutLogs = async (req, res) => {
  try {
    const { startDate, endDate, planId } = req.query;
    
    let query = { user: req.user.id };
    
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    if (planId) {
      query.plan = planId;
    }

    const logs = await WorkoutLog.find(query)
      .populate('plan', 'title')
      .sort({ date: -1 });

    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workout logs', error: error.message });
  }
};

const getWorkoutStats = async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ user: req.user.id });

    const stats = {
      totalWorkouts: logs.length,
      totalDuration: logs.reduce((sum, log) => sum + log.duration, 0),
      totalCalories: logs.reduce((sum, log) => sum + (log.caloriesBurned || 0), 0),
      averageDuration: logs.length > 0 ? logs.reduce((sum, log) => sum + log.duration, 0) / logs.length : 0,
      workoutsThisWeek: logs.filter(log => 
        log.date >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      workoutsThisMonth: logs.filter(log => 
        log.date >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

const deleteWorkoutLog = async (req, res) => {
  try {
    const log = await WorkoutLog.findOne({ _id: req.params.id, user: req.user.id });

    if (!log) {
      return res.status(404).json({ message: 'Workout log not found' });
    }

    await log.deleteOne();
    res.json({ success: true, message: 'Workout log deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workout log', error: error.message });
  }
};

module.exports = {
  createWorkoutLog,
  getUserWorkoutLogs,
  getWorkoutStats,
  deleteWorkoutLog
};
