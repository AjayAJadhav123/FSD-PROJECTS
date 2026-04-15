# Full Stack Password Generator App

A simple full stack password generator application.

## Stack

- Frontend: React + Axios
- Backend: Node.js + Express

## Features

- Generate strong passwords
- Options for:
  - length
  - symbols
  - numbers
  - uppercase
  - lowercase
- Copy generated password to clipboard
- Optional saved password history (in-memory backend storage)
- Simple card-based UI

## Folder Structure

```
password-generator-app/
  backend/
    src/
      routes/
        passwordRoutes.js
      services/
        passwordService.js
      server.js
    .env.example
    package.json
  frontend/
    src/
      components/
        PasswordOptions.jsx
        HistoryList.jsx
      services/
        passwordApi.js
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
2. Install dependencies:
   - npm install
3. Create .env from .env.example:
   - PORT=5004
4. Run backend:
   - npm run dev

## Frontend Setup

1. Go to frontend folder:
   - cd frontend
2. Install dependencies:
   - npm install
3. Create .env from .env.example:
   - VITE_API_URL=http://localhost:5004/api/password
4. Run frontend:
   - npm run dev

## API Endpoints

- POST /api/password/generate
- GET /api/password/history
- DELETE /api/password/history
