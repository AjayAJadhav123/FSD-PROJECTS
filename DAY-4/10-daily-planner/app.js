// ===== Daily Planner App =====
// Tasks stored in localStorage; filtered by status

let tasks  = JSON.parse(localStorage.getItem('dailyTasks')) || [];
let filter = 'all';

function save() { localStorage.setItem('dailyTasks', JSON.stringify(tasks)); }

// Show today's date in header
document.getElementById('todayLabel').textContent =
  new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// ===== Add Task =====
document.getElementById('taskForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const task = {
    id:       Date.now(),
    title:    document.getElementById('taskTitle').value.trim(),
    time:     document.getElementById('taskTime').value,
    priority: document.getElementById('taskPriority').value,
    note:     document.getElementById('taskNote').value.trim(),
    done:     false
  };
  tasks.push(task);
  // Sort by time after adding
  tasks.sort((a, b) => a.time.localeCompare(b.time));
  save();
  renderTasks();
  this.reset();
});

// ===== Toggle Done =====
function toggleDone(id) {
  const task = tasks.find(t => t.id === id);
  if (task) { task.done = !task.done; save(); renderTasks(); }
}

// ===== Delete Task =====
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  renderTasks();
}

// ===== Filter =====
function setFilter(f, btn) {
  filter = f;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderTasks();
}

// ===== Render =====
function renderTasks() {
  const list = document.getElementById('taskList');

  // Update progress bar
  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = `${done} / ${total} done`;

  // Apply filter
  let filtered = tasks;
  if (filter === 'pending') filtered = tasks.filter(t => !t.done);
  if (filter === 'done')    filtered = tasks.filter(t => t.done);

  if (filtered.length === 0) {
    list.innerHTML = '<p class="empty-msg">📋 No tasks here.</p>';
    return;
  }

  // Format time to 12-hour
  function fmt(t) {
    const [h, m] = t.split(':');
    const h12 = parseInt(h) % 12 || 12;
    return `${h12}:${m} ${parseInt(h) >= 12 ? 'PM' : 'AM'}`;
  }

  list.innerHTML = filtered.map(task => `
    <div class="task-item ${task.priority} ${task.done ? 'done' : ''}">
      <div class="task-checkbox ${task.done ? 'checked' : ''}" onclick="toggleDone(${task.id})">
        ${task.done ? '✓' : ''}
      </div>
      <div class="task-body">
        <div class="task-title ${task.done ? 'done-text' : ''}">${escapeHTML(task.title)}</div>
        <div class="task-meta">⏰ ${fmt(task.time)} · ${task.priority} Priority</div>
        ${task.note ? `<div class="task-note">📝 ${escapeHTML(task.note)}</div>` : ''}
      </div>
      <button class="task-del" onclick="deleteTask(${task.id})">🗑</button>
    </div>
  `).join('');
}

function escapeHTML(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

renderTasks();
