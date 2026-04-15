function formatTimestamp(value) {
  return new Date(value).toLocaleString();
}

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className="note-card">
      <h3>{note.title}</h3>
      <p className="note-content">{note.content}</p>
      <p className="note-time">Updated: {formatTimestamp(note.updatedAt)}</p>
      <div className="card-actions">
        <button className="edit-button" onClick={() => onEdit(note)}>
          Edit
        </button>
        <button className="delete-button" onClick={() => onDelete(note._id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default NoteCard;
