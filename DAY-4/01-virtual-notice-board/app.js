// ===== Virtual Notice Board =====
// Uses localStorage to persist notices across page reloads

const form = document.getElementById('noticeForm');
const container = document.getElementById('noticesContainer');

// Load notices from localStorage or start with empty array
let notices = JSON.parse(localStorage.getItem('notices')) || [];

// Save notices array to localStorage
function saveNotices() {
  localStorage.setItem('notices', JSON.stringify(notices));
}

// Handle form submission
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const notice = {
    id: Date.now(),                              // unique ID using timestamp
    author: document.getElementById('author').value.trim(),
    title: document.getElementById('title').value.trim(),
    message: document.getElementById('message').value.trim(),
    category: document.getElementById('category').value,
    date: new Date().toLocaleDateString()
  };

  notices.unshift(notice); // add to beginning of array
  saveNotices();
  renderNotices();
  form.reset();
});

// Render notices based on selected filter
function renderNotices() {
  const filter = document.getElementById('filterCategory').value;
  const filtered = filter === 'All' ? notices : notices.filter(n => n.category === filter);

  if (filtered.length === 0) {
    container.innerHTML = '<p class="empty-msg">📭 No notices found.</p>';
    return;
  }

  container.innerHTML = filtered.map(n => `
    <div class="notice-card ${n.category}">
      <button class="delete-btn" onclick="deleteNotice(${n.id})" title="Delete">✕</button>
      <span class="badge ${n.category}">${n.category}</span>
      <h3>${escapeHTML(n.title)}</h3>
      <p>${escapeHTML(n.message)}</p>
      <div class="notice-meta">
        <span>👤 ${escapeHTML(n.author)}</span>
        <span>📅 ${n.date}</span>
      </div>
    </div>
  `).join('');
}

// Delete a single notice by ID
function deleteNotice(id) {
  notices = notices.filter(n => n.id !== id);
  saveNotices();
  renderNotices();
}

// Clear all notices
function clearAll() {
  if (confirm('Are you sure you want to clear all notices?')) {
    notices = [];
    saveNotices();
    renderNotices();
  }
}

// Prevent XSS by escaping HTML characters
function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Initial render on page load
renderNotices();


