const Achievement = require('../models/Achievement');

const getUserAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ user: req.user.id })
      .sort({ earnedAt: -1 });

    res.json({ success: true, data: achievements });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching achievements', error: error.message });
  }
};

module.exports = { getUserAchievements };
