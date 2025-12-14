# FitPlanHub Frontend

Next.js 14 frontend for FitPlanHub platform.

## Features

- User and Trainer registration/login
- Role-based dashboards [web:6][web:9]
- Browse and subscribe to fitness plans
- Follow/unfollow trainers
- Personalized feed from followed trainers
- Conditional rendering based on subscription status

## Tech Stack

- **Framework**: Next.js 14 (App Router) [web:11][web:12]
- **Language**: JavaScript (React)
- **HTTP Client**: Axios
- **State Management**: React Context API

## Installation

1. **Navigate to frontend directory**
cd fitplanhub-frontend

text

2. **Install dependencies**
npm install

text

3. **Configure environment**
Create `.env.local`:
NEXT_PUBLIC_API_URL=http://localhost:5000/api

text

4. **Run the application**
npm run dev

text

Visit `http://localhost:3000`

## Project Structure

app/
├── (auth)/ # Authentication pages
│ ├── login/
│ └── register/
├── dashboard/ # Role-specific dashboards
│ ├── trainer/
│ └── user/
├── plans/ # Plan browsing and details
├── trainers/ # Trainer listing
├── feed/ # Personalized feed
├── layout.js # Root layout
└── page.js # Homepage

components/ # Reusable components
context/ # Auth context
lib/ # API services and utilities

text

## Key Features

### Authentication
- JWT token storage in localStorage
- Automatic token injection in API requests [web:11]
- Protected routes with role checking [web:13]

### Role-Based UI
- Trainers: Create/manage plans
- Users: Browse, subscribe, follow trainers [web:6]

### Access Control
- Preview mode for non-subscribed plans
- Full access after subscription

## API Integration

All API calls go through `lib/api.js` with automatic:
- Token injection
- Error handling
- Redirect on 401 errors [web:13][web:15]

## Running in Production

npm run build
npm start