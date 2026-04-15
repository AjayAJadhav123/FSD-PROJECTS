import { useEffect, useMemo, useState } from "react";
import NoteEditor from "./components/NoteEditor";
import NoteList from "./components/NoteList";
import { createNote, deleteNote, getNotes, updateNote } from "./services/noteService";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  const totalNotes = useMemo(() => notes.length, [notes]);

  useEffect(() => {
    async function fetchNotes() {
      try {
        setLoading(true);
        const data = await getNotes();
        setNotes(data);
      } catch (err) {
        setError("Could not load notes. Make sure backend is running.");
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, []);

  async function handleSaveNote(payload) {
    try {
      if (editingNote) {
        const updated = await updateNote(editingNote._id, payload);
        setNotes((prev) => prev.map((note) => (note._id === updated._id ? updated : note)));
        setEditingNote(null);
      } else {
        const created = await createNote(payload);
        setNotes((prev) => [created, ...prev]);
      }
      setError("");
    } catch (err) {
      setError("Failed to save note.");
    }
  }

  async function handleDeleteNote(id) {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      if (editingNote && editingNote._id === id) {
        setEditingNote(null);
      }
      setError("");
    } catch (err) {
      setError("Failed to delete note.");
    }
  }

  function handleEditClick(note) {
    setEditingNote(note);
  }

  function handleCancelEdit() {
    setEditingNote(null);
  }

  return (
    <main className="app-shell">
      <section className="notes-container">
        <header className="app-header">
          <h1>Notes</h1>
          <p>{totalNotes} total notes</p>
        </header>

        <NoteEditor
          onSave={handleSaveNote}
          editingNote={editingNote}
          onCancel={handleCancelEdit}
        />

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p className="status-message">Loading notes...</p>
        ) : (
          <NoteList notes={notes} onEdit={handleEditClick} onDelete={handleDeleteNote} />
        )}
      </section>
    </main>
  );
}

export default App;
