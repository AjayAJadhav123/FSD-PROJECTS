import { useEffect, useMemo, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { createTask, deleteTask, getTasks, updateTask } from "./services/taskService";

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  useEffect(() => {
    async function fetchTasks() {
      try {
        setIsLoading(true);
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError("Could not load tasks. Please check if backend is running.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, []);

  async function handleAddTask(title) {
    try {
      const newTask = await createTask(title);
      setTasks((prev) => [newTask, ...prev]);
      setError("");
    } catch (err) {
      setError("Failed to add task.");
    }
  }

  async function handleToggleComplete(task) {
    try {
      const updatedTask = await updateTask(task._id, {
        completed: !task.completed
      });

      setTasks((prev) =>
        prev.map((item) => (item._id === updatedTask._id ? updatedTask : item))
      );
      setError("");
    } catch (err) {
      setError("Failed to update task.");
    }
  }

  async function handleDeleteTask(id) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete task.");
    }
  }

  return (
    <main className="app-shell">
      <section className="card">
        <header className="header">
          <h1>To-Do List</h1>
          <p>
            {completedCount} of {tasks.length} completed
          </p>
        </header>

        <TaskForm onAddTask={handleAddTask} />

        {error && <p className="error-message">{error}</p>}

        {isLoading ? (
          <p className="status-message">Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </section>
    </main>
  );
}

export default App;
