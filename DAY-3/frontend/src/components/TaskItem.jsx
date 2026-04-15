function TaskItem({ task, onToggleComplete, onDeleteTask }) {
  return (
    <li className="task-item">
      <label className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task)}
          aria-label={`Mark ${task.title} as complete`}
        />
        <span className={task.completed ? "task-title done" : "task-title"}>
          {task.title}
        </span>
      </label>
      <button
        className="delete-button"
        onClick={() => onDeleteTask(task._id)}
        aria-label={`Delete ${task.title}`}
      >
        Delete
      </button>
    </li>
  );
}

export default TaskItem;
