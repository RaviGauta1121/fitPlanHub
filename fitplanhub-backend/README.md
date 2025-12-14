# FitPlanHub Backend

Backend API for FitPlanHub - A platform connecting fitness trainers with users through subscription-based fitness plans.

## Features

- **Authentication**: JWT-based authentication with bcrypt password hashing [web:1][web:16]
- **Role-Based Access**: Separate functionality for trainers and regular users [web:2]
- **Fitness Plans**: CRUD operations for trainers to manage their fitness plans
- **Subscriptions**: Users can subscribe to fitness plans
- **Access Control**: Conditional content visibility based on subscription status
- **Trainer Following**: Users can follow/unfollow trainers
- **Personalized Feed**: View plans from followed trainers

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM [web:7][web:10]
- **Authentication**: JWT (jsonwebtoken) + bcryptjs [web:1][web:8]
- **Validation**: express-validator

## Installation

1. **Clone the repository**
git clone <your-repo-url>
cd fitplanhub-backend

text

2. **Install dependencies**
npm install

text

3. **Configure environment variables**
Create a `.env` file in the root directory:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitplanhub
JWT_SECRET=your_super_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development

text

4. **Start MongoDB**
Ensure MongoDB is running on your system.

5. **Run the application**
Development mode with auto-reload
npm run dev

Production mode
npm start

text

The server will start on `http://localhost:5000`

## Database Schema

### User Model
- name, email, password (hashed)
- role: 'user' | 'trainer'
- followedTrainers: Array of User IDs
- certifications (for trainers)

### Plan Model
- title, description, price, duration
- trainer: Reference to User
- exercises: Array of exercise objects
- isActive: Boolean

### Subscription Model
- user: Reference to User
- plan: Reference to Plan
- startDate, endDate
- paymentStatus: 'pending' | 'completed' | 'failed'
- amount: Number

## API Endpoints

### Authentication
POST /api/auth/register - Register new user/trainer
POST /api/auth/login - Login and get token
GET /api/auth/profile - Get user profile (protected)

text

### Plans
POST /api/plans - Create plan (trainer only)
GET /api/plans - Get all plans with access control
GET /api/plans/my-plans - Get trainer's own plans
GET /api/plans/:id - Get plan by ID
PUT /api/plans/:id - Update plan (trainer only)
DELETE /api/plans/:id - Delete plan (trainer only)

text

### Subscriptions
POST /api/subscriptions - Subscribe to a plan (user only)
GET /api/subscriptions - Get user's subscriptions

text

### Trainers
GET /api/trainers - Get all trainers
GET /api/trainers/followed - Get followed trainers (user only)
GET /api/trainers/feed - Get personalized feed (user only)
GET /api/trainers/:id - Get trainer details
POST /api/trainers/:id/follow - Follow trainer (user only)
DELETE /api/trainers/:id/unfollow - Unfollow trainer (user only)

text

## Authentication Flow

All protected routes require a Bearer token in the Authorization header [web:2][web:8]:
Authorization: Bearer <your_jwt_token>

text

## Testing with Postman

1. Register a user and a trainer
2. Login to get JWT tokens
3. Use tokens in Authorization headers for protected routes
4. Test CRUD operations on plans
5. Test subscription flow
6. Test follow/unfollow functionality

## Project Structure

src/
├── config/ # Database configuration
├── controllers/ # Route handlers and business logic
├── middleware/ # Authentication and role checking
├── models/ # Mongoose schemas
├── routes/ # API route definitions
├── utils/ # Helper functions and validators
└── server.js # Application entry point

text

## Security Features

- Password hashing with bcrypt (10 salt rounds) [web:16][web:19]
- JWT token-based authentication with expiration [web:1][web:8]
- Role-based access control middleware [web:2]
- Input validation using express-validator
- Protected routes requiring authentication

## Error Handling

The API returns consistent error responses:
{
"success": false,
"message": "Error description"
}

text

## Development Notes

- Use nodemon for development auto-reload
- JWT tokens expire after 7 days (configurable)
- Database indexes on frequently queried fields
- Proper error handling and validation throughout

## License

MIT