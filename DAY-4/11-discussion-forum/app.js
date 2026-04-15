// ===== Discussion Forum =====
// Topics and replies stored in localStorage

let topics = JSON.parse(localStorage.getItem('forumTopics')) || [];
let currentTopicId = null;

function save() { localStorage.setItem('forumTopics', JSON.stringify(topics)); }

// ===== Navigation =====
function showTopicList() {
  document.getElementById('topicListView').classList.remove('hidden');
  document.getElementById('newTopicView').classList.add('hidden');
  document.getElementById('topicDetailView').classList.add('hidden');
  renderTopics();
}

function showNewTopicForm() {
  document.getElementById('topicListView').classList.add('hidden');
  document.getElementById('newTopicView').classList.remove('hidden');
  document.getElementById('topicDetailView').classList.add('hidden');
}

function showTopicDetail(id) {
  currentTopicId = id;
  document.getElementById('topicListView').classList.add('hidden');
  document.getElementById('newTopicView').classList.add('hidden');
  document.getElementById('topicDetailView').classList.remove('hidden');
  renderTopicDetail();
}

// ===== Create Topic =====
document.getElementById('topicForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const topic = {
    id:       Date.now(),
    author:   document.getElementById('topicAuthor').value.trim(),
    title:    document.getElementById('topicTitle').value.trim(),
    category: document.getElementById('topicCategory').value,
    body:     document.getElementById('topicBody').value.trim(),
    date:     new Date().toLocaleString(),
    replies:  []
  };
  topics.unshift(topic);
  save();
  this.reset();
  showTopicList();
});

// ===== Add Reply =====
document.getElementById('replyForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const topic = topics.find(t => t.id === currentTopicId);
  if (!topic) return;

  const reply = {
    id:     Date.now(),
    author: document.getElementById('replyAuthor').value.trim(),
    body:   document.getElementById('replyBody').value.trim(),
    date:   new Date().toLocaleString()
  };
  topic.replies.push(reply);
  save();
  this.reset();
  renderTopicDetail();
});

// ===== Render Topics List =====
function renderTopics() {
  const list   = document.getElementById('topicsList');
  const search = document.getElementById('searchTopics').value.toLowerCase();
  const cat    = document.getElementById('filterTopicCat').value;

  let filtered = topics.filter(t => {
    const matchCat    = cat === 'All' || t.category === cat;
    const matchSearch = t.title.toLowerCase().includes(search) ||
                        t.body.toLowerCase().includes(search) ||
                        t.author.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    list.innerHTML = '<p class="empty-msg">💬 No topics yet. Start a new discussion!</p>';
    return;
  }

  list.innerHTML = filtered.map(t => {
    const preview = t.body.length > 120 ? t.body.substring(0, 120) + '...' : t.body;
    return `
      <div class="topic-card" onclick="showTopicDetail(${t.id})">
        <span class="cat-badge">${t.category}</span>
        <h3>${escapeHTML(t.title)}</h3>
        <p class="preview">${escapeHTML(preview)}</p>
        <div class="topic-meta">
          <span>👤 ${escapeHTML(t.author)} · 📅 ${t.date}</span>
          <span class="reply-count">💬 ${t.replies.length} ${t.replies.length === 1 ? 'reply' : 'replies'}</span>
        </div>
      </div>
    `;
  }).join('');
}

// ===== Render Topic Detail =====
function renderTopicDetail() {
  const topic = topics.find(t => t.id === currentTopicId);
  if (!topic) { showTopicList(); return; }

  document.getElementById('topicDetail').innerHTML = `
    <div class="topic-detail-card">
      <span class="cat-badge">${topic.category}</span>
      <h2>${escapeHTML(topic.title)}</h2>
      <p class="body">${escapeHTML(topic.body)}</p>
      <p class="meta">👤 ${escapeHTML(topic.author)} · 📅 ${topic.date}</p>
    </div>
  `;

  const repliesList = document.getElementById('repliesList');
  if (topic.replies.length === 0) {
    repliesList.innerHTML = '<p class="empty-msg">No replies yet. Be the first to reply!</p>';
    return;
  }

  repliesList.innerHTML = `
    <p class="replies-header">💬 ${topic.replies.length} ${topic.replies.length === 1 ? 'Reply' : 'Replies'}</p>
    ${topic.replies.map(r => `
      <div class="reply-card">
        <div class="reply-author">👤 ${escapeHTML(r.author)}</div>
        <div class="reply-body">${escapeHTML(r.body)}</div>
        <div class="reply-date">📅 ${r.date}</div>
      </div>
    `).join('')}
  `;
}

function escapeHTML(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Initial render
renderTopics();
