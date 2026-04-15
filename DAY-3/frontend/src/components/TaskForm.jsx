import { useState } from "react";

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    onAddTask(trimmedTitle);
    setTitle("");
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="task-input"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        aria-label="Task title"
      />
      <button type="submit" className="add-button">
        Add
      </button>
    </form>
  );
}

export default TaskForm;
