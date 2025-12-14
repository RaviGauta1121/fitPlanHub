const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDatabase = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const workoutLogRoutes = require('./routes/workoutLogRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const achievementRoutes = require('./routes/achievementRoutes');

dotenv.config();

const app = express();

// Connect to database
connectDatabase();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ FitPlanHub API is running - Enhanced Version',
    version: '2.0',
    endpoints: {
      auth: '/api/auth',
      plans: '/api/plans',
      subscriptions: '/api/subscriptions',
      trainers: '/api/trainers',
      reviews: '/api/reviews',
      workoutLogs: '/api/workout-logs',
      notifications: '/api/notifications',
      achievements: '/api/achievements'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/workout-logs', workoutLogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/achievements', achievementRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    requestedUrl: req.originalUrl 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: err.message 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n✅ FitPlanHub Enhanced Server running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:5000/api`);
  console.log(`📊 View all endpoints: http://localhost:5000/\n`);
});
