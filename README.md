

```markdown
# FitPlanHub 🏋️‍♂️

A full-stack fitness management platform connecting trainers with users through personalized workout plans, progress tracking, and subscription management.

## 🌐 Live Demo

**Frontend:** [https://fit-plan-hub-lovat.vercel.app/](https://fit-plan-hub-lovat.vercel.app/)

**Backend API:** [Your Render URL]/api

## 📋 Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Demo Credentials](#demo-credentials)
- [Deployment](#deployment)
- [Contributing](#contributing)

## ✨ Features

### For Users
- 👤 User registration and authentication
- 🔍 Browse and search fitness plans
- 💰 Subscribe to workout plans
- 📊 Track workout progress and logs
- ⭐ Follow favorite trainers
- 💬 Review and rate plans
- 🔔 Real-time notifications
- 📈 View personal dashboard and statistics

### For Trainers
- 🎓 Trainer profile with certifications
- 📝 Create and manage fitness plans
- 👥 View subscriber statistics
- 📊 Track plan performance
- 💡 Manage plan pricing and duration

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15
- **Language:** JavaScript
- **Styling:** Inline CSS (custom)
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **CORS:** cors middleware
- **Deployment:** Render

## 📁 Project Structure

```
fitplanhub/
├── app/                          # Next.js frontend
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── plans/                    # Plans listing
│   ├── trainers/                 # Trainers listing
│   ├── my-trainers/              # Followed trainers
│   ├── dashboard/                # User/Trainer dashboard
│   ├── layout.js                 # Root layout
│   └── page.js                   # Homepage
├── components/                   # React components
│   ├── Navbar.js                 # Navigation bar
│   ├── PlanCard.js               # Plan display card
│   ├── TrainerCard.js            # Trainer display card
│   └── Footer.js                 # Footer component
├── context/                      # React Context
│   └── AuthContext.js            # Authentication context
├── lib/                          # Utilities
│   ├── api.js                    # Axios instance
│   └── auth.js                   # API service functions
├── public/                       # Static assets
├── backend/                      # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js             # MongoDB connection
│   │   ├── controllers/          # Route controllers
│   │   ├── middleware/           # Auth & Role middleware
│   │   ├── models/               # MongoDB models
│   │   ├── routes/               # API routes
│   │   └── server.js             # Express app entry
│   ├── seed.js                   # Database seeder
│   ├── package.json
│   └── .env
├── .env.local                    # Frontend environment variables
├── package.json                  # Frontend dependencies
└── README.md
```

## 📦 Prerequisites

- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **MongoDB** (Local or Atlas)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```
git clone https://github.com/RaviGauta1121/fitPlanHub.git
cd fitplanhub
```

### 2. Install Frontend Dependencies

```
npm install
```

### 3. Install Backend Dependencies

```
cd backend
npm install
cd ..
```

## 🔐 Environment Variables

### Frontend (.env.local)

Create `.env.local` in the root directory:

```
# For local development
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# For production (Vercel)
# NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

### Backend (backend/.env)

Create `.env` in the backend directory:

```
# Database
MONGODB_URI=mongodb://localhost:27017/fitplanhub
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitplanhub

# JWT Secret (use a long random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

## 🏃‍♂️ Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```
cd backend
npm start
```

**Terminal 2 - Frontend:**
```
npm run dev
```

### Option 2: Using npm scripts

Add to root `package.json`:
```
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "backend": "cd backend && npm start",
    "seed": "cd backend && node seed.js"
  }
}
```

Then run:
```
# Frontend
npm run dev

# Backend (in another terminal)
npm run backend
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Live Demo:** https://fit-plan-hub-lovat.vercel.app/

## 📊 Database Seeding

Populate the database with sample data:

```
cd backend
node seed.js
```

This creates:
- ✅ 5 Users
- ✅ 4 Trainers
- ✅ 10 Fitness Plans
- ✅ Multiple Subscriptions
- ✅ Reviews and Ratings
- ✅ Workout Logs
- ✅ Notifications

## 🔑 Demo Credentials

### Users
```
📧 Email: john@example.com
🔒 Password: password123

📧 Email: sarah@example.com
🔒 Password: password123

📧 Email: mike@example.com
🔒 Password: password123
```

### Trainers
```
📧 Email: alex@trainer.com
🔒 Password: trainer123

📧 Email: jessica@trainer.com
🔒 Password: trainer123

📧 Email: marcus@trainer.com
🔒 Password: trainer123
```

## 📚 API Documentation

### Base URL
- **Local:** `http://localhost:5000/api`
- **Production:** `[Your Backend URL]/api`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

### Plan Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/plans` | Get all plans | No |
| GET | `/api/plans/search` | Search plans | No |
| GET | `/api/plans/:id` | Get plan by ID | No |
| POST | `/api/plans` | Create plan | Trainer |
| PUT | `/api/plans/:id` | Update plan | Trainer |
| DELETE | `/api/plans/:id` | Delete plan | Trainer |
| GET | `/api/plans/my-plans` | Get trainer's plans | Trainer |

### Trainer Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/trainers` | Get all trainers | No |
| GET | `/api/trainers/:id` | Get trainer by ID | No |
| POST | `/api/trainers/:id/follow` | Follow trainer | User |
| DELETE | `/api/trainers/:id/unfollow` | Unfollow trainer | User |
| GET | `/api/trainers/followed` | Get followed trainers | User |
| GET | `/api/trainers/feed` | Get trainer feed | User |

### Subscription Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/subscriptions` | Subscribe to plan | User |
| GET | `/api/subscriptions` | Get user subscriptions | User |

### Review Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reviews` | Create review | User |
| GET | `/api/reviews/plan/:planId` | Get plan reviews | No |
| PUT | `/api/reviews/:id` | Update review | User |
| DELETE | `/api/reviews/:id` | Delete review | User |

### Workout Log Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/workout-logs` | Create workout log | User |
| GET | `/api/workout-logs` | Get user logs | User |
| GET | `/api/workout-logs/stats` | Get workout stats | User |
| DELETE | `/api/workout-logs/:id` | Delete log | User |

### Notification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | Get notifications | Yes |
| PUT | `/api/notifications/:id/read` | Mark as read | Yes |
| PUT | `/api/notifications/read-all` | Mark all as read | Yes |
| DELETE | `/api/notifications/:id` | Delete notification | Yes |

## 🚀 Deployment

### Frontend (Vercel) ✅ Deployed

**Live URL:** https://fit-plan-hub-lovat.vercel.app/

1. Connect GitHub repository to Vercel
2. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   ```
3. Deploy automatically on push to main

### Backend (Render)

1. Connect GitHub repository to Render
2. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   PORT=5000
   NODE_ENV=production
   ```
4. Deploy

### Database (MongoDB Atlas)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Whitelist all IPs (0.0.0.0/0) for Render access
5. Update `MONGODB_URI` in environment variables

## 🐛 Troubleshooting

### Frontend can't connect to backend

```
# Check if backend is running
curl http://localhost:5000/api

# Verify .env.local exists and is correct
cat .env.local

# Restart frontend after changing .env.local
npm run dev
```

### MongoDB connection error

```
# Check MongoDB is running (if local)
mongod

# Or verify MongoDB Atlas connection string
# Make sure IP is whitelisted in Atlas
```

### JWT authentication errors

```
// Clear browser localStorage in console:
localStorage.clear()
// Then login again
```

### CORS errors

Make sure backend `server.js` includes:
```
app.use(cors({
  origin: ['http://localhost:3000', 'https://fit-plan-hub-lovat.vercel.app'],
  credentials: true
}));
```

## 📱 Screenshots

### Homepage
Modern and responsive landing page with features overview

### Plans Page
Browse all available fitness plans with filtering options

### Dashboard
User dashboard with workout logs, subscriptions, and statistics

### Trainer Dashboard
Manage plans, view subscribers, and track performance

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Ravi Gauta**
- GitHub: [@RaviGauta1121](https://github.com/RaviGauta1121)
- Project Link: [https://github.com/RaviGauta1121/fitPlanHub](https://github.com/RaviGauta1121/fitPlanHub)
- Live Demo: [https://fit-plan-hub-lovat.vercel.app/](https://fit-plan-hub-lovat.vercel.app/)

**Made with ❤️ and 💪 for the fitness community**

⭐ Star this repository if you find it helpful!
```

This updated README includes your live Vercel link and provides a complete overview of your deployed application! 🚀
