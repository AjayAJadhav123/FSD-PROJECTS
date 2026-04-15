# Simple Full Stack Authentication System

This project contains a simple authentication system with:
- React frontend (Login + Signup)
- Node.js + Express backend
- MongoDB database
- bcrypt password hashing
- JWT authentication
- Protected route
- Token storage in localStorage

## Folder Structure

```
auth-system/
  backend/
    src/
      middleware/
        authMiddleware.js
      models/
        User.js
      routes/
        authRoutes.js
      server.js
    .env.example
    package.json
  frontend/
    src/
      components/
        ProtectedRoute.jsx
      pages/
        LoginPage.jsx
        SignupPage.jsx
        DashboardPage.jsx
      services/
        authService.js
      App.jsx
      main.jsx
      styles.css
    .env.example
    package.json
  .gitignore
  README.md
```

## Backend Setup

1. Go to backend folder:
   - cd backend
2. Install dependencies:
   - npm install
3. Create .env from .env.example:
   - PORT=5001
   - MONGODB_URI=mongodb://127.0.0.1:27017/auth_system
   - JWT_SECRET=your_secret_key
4. Start backend:
   - npm run dev

## Frontend Setup

1. Go to frontend folder:
   - cd frontend
2. Install dependencies:
   - npm install
3. Create .env from .env.example:
   - VITE_API_URL=http://localhost:5001/api/auth
4. Start frontend:
   - npm run dev

## API Endpoints

- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me (protected)

## Features

- User registration
- Login system
- bcrypt password hashing
- JWT token generation and validation
- Protected dashboard route
- Error messages on UI
- Token stored in localStorage
