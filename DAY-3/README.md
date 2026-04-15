# Full Stack To-Do List App

A simple full stack To-Do List application with:
- React frontend
- Node.js + Express backend
- MongoDB database
- Axios for API calls

## Folder Structure

```
DAY-3/
  backend/
    src/
      models/
      routes/
      server.js
    .env.example
    package.json
  frontend/
    src/
      components/
      services/
      App.jsx
      App.css
      main.jsx
    .env.example
    index.html
    package.json
  .gitignore
  README.md
```

## Backend Setup

1. Open terminal in `backend` folder:
   - `cd backend`
2. Install dependencies:
   - `npm install`
3. Create `.env` from `.env.example` and set your MongoDB URL:
   - `PORT=5000`
   - `MONGODB_URI=mongodb://127.0.0.1:27017/todo_app`
4. Run backend:
   - `npm run dev`

Backend runs on `http://localhost:5000`.

## Frontend Setup

1. Open terminal in `frontend` folder:
   - `cd frontend`
2. Install dependencies:
   - `npm install`
3. Create `.env` from `.env.example`:
   - `VITE_API_URL=http://localhost:5000/api/tasks`
4. Run frontend:
   - `npm run dev`

Frontend runs on Vite dev server (usually `http://localhost:5173`).

## REST API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update task (title/completed)
- `DELETE /api/tasks/:id` - Delete task

## Features Implemented

- Add new tasks
- Mark tasks as completed
- Delete tasks
- Show all tasks
- Responsive UI
- Axios API integration
