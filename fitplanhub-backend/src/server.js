const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDatabase = require('./config/database');

// Route imports
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

// Connect database
connectDatabase();

// 🔥 FIX 1 — Handle preflight BEFORE everything
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://fit-plan-hub-lovat.vercel.app",
    "http://localhost:3000"
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // 👈 Required for preflight
  }

  next();
});

// 🔥 FIX 2 — Now use cors() normally
app.use(
  cors({
    origin: [
      "https://fit-plan-hub-lovat.vercel.app",
      "http://localhost:3000"
    ],
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root
app.get('/', (req, res) => {
  res.json({ message: "FitPlanHub API is running" });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/workout-logs', workoutLogRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/achievements', achievementRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
