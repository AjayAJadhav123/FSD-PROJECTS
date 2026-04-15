import NoteCard from "./NoteCard";

function NoteList({ notes, onEdit, onDelete }) {
  if (notes.length === 0) {
    return <p className="status-message">No notes yet. Create your first one.</p>;
  }

  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default NoteList;
