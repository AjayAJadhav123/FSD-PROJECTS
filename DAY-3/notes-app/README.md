# Full Stack Notes Application

Simple full stack Notes app with:
- React frontend note editor
- Node.js + Express backend
- MongoDB database
- Axios API calls
- Card UI
- Timestamps for notes

## Folder Structure

```
notes-app/
  backend/
    src/
      models/
        Note.js
      routes/
        noteRoutes.js
      server.js
    .env.example
    package.json
  frontend/
    src/
      components/
        NoteEditor.jsx
        NoteList.jsx
        NoteCard.jsx
      services/
        noteService.js
      App.jsx
      main.jsx
      styles.css
    .env.example
    index.html
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
   - PORT=5002
   - MONGODB_URI=mongodb://127.0.0.1:27017/notes_app
4. Run backend:
   - npm run dev

## Frontend Setup

1. Go to frontend folder:
   - cd frontend
2. Install dependencies:
   - npm install
3. Create .env from .env.example:
   - VITE_API_URL=http://localhost:5002/api/notes
4. Run frontend:
   - npm run dev

## API Endpoints

- GET /api/notes
- POST /api/notes
- PUT /api/notes/:id
- DELETE /api/notes/:id

## Features

- Create notes
- Edit notes
- Delete notes
- View all notes
- Axios integration
- Timestamp display (updatedAt)
- Responsive card-based UI
