# Full Stack Blog Website

Simple blog website with separate frontend and backend folders.

## Stack

- Frontend: React + Axios
- Backend: Node.js + Express
- Database: MongoDB
- Auth: JWT + bcrypt password hashing

## Features

- User signup and login
- Create blog posts
- Edit own posts
- Delete own posts
- View all blogs on homepage
- Clean card-based UI

## Folder Structure

```
blog-app/
  backend/
    src/
      middleware/
        authMiddleware.js
      models/
        User.js
        Post.js
      routes/
        authRoutes.js
        postRoutes.js
      server.js
    .env.example
    package.json
  frontend/
    src/
      components/
        PostCard.jsx
      pages/
        HomePage.jsx
        CreatePostPage.jsx
        LoginPage.jsx
      services/
        api.js
      App.jsx
      main.jsx
      styles.css
    .env.example
    package.json
    index.html
  .gitignore
  README.md
```

## Backend Setup

1. Go to backend folder:
   - cd backend
2. Install packages:
   - npm install
3. Create .env file from .env.example and set values:
   - PORT=5003
   - MONGODB_URI=mongodb://127.0.0.1:27017/blog_app
   - JWT_SECRET=your_secret_here
4. Start server:
   - npm run dev

## Frontend Setup

1. Go to frontend folder:
   - cd frontend
2. Install packages:
   - npm install
3. Create .env file from .env.example:
   - VITE_API_BASE=http://localhost:5003/api
4. Start app:
   - npm run dev

## API Endpoints

- POST /api/auth/signup
- POST /api/auth/login
- GET /api/posts
- POST /api/posts (protected)
- PUT /api/posts/:id (protected, owner only)
- DELETE /api/posts/:id (protected, owner only)
