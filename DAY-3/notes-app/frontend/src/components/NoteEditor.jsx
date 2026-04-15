import { useEffect, useState } from "react";

function NoteEditor({ onSave, editingNote, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editingNote]);

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      return;
    }

    onSave({ title: trimmedTitle, content: trimmedContent });

    if (!editingNote) {
      setTitle("");
      setContent("");
    }
  }

  return (
    <form className="note-editor" onSubmit={handleSubmit}>
      <input
        type="text"
        className="note-input"
        placeholder="Note title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <textarea
        className="note-textarea"
        placeholder="Write your note here..."
        rows="5"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <div className="editor-actions">
        <button type="submit" className="save-button">
          {editingNote ? "Update Note" : "Create Note"}
        </button>
        {editingNote && (
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default NoteEditor;
