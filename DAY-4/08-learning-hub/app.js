// ===== Learning Resource Hub =====
// Resources stored in localStorage

let resources = JSON.parse(localStorage.getItem('learningResources')) || [];

function save() { localStorage.setItem('learningResources', JSON.stringify(resources)); }

document.getElementById('uploadForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const res = {
    id:       Date.now(),
    title:    document.getElementById('resTitle').value.trim(),
    author:   document.getElementById('resAuthor').value.trim(),
    category: document.getElementById('resCategory').value,
    link:     document.getElementById('resLink').value.trim(),
    desc:     document.getElementById('resDesc').value.trim(),
    date:     new Date().toLocaleDateString()
  };
  resources.unshift(res);
  save();
  renderResources();
  this.reset();
});

function deleteResource(id) {
  resources = resources.filter(r => r.id !== id);
  save();
  renderResources();
}

function renderResources() {
  const grid   = document.getElementById('resourcesGrid');
  const search = document.getElementById('searchInput').value.toLowerCase();
  const cat    = document.getElementById('filterCat').value;

  let filtered = resources.filter(r => {
    const matchCat    = cat === 'All' || r.category === cat;
    const matchSearch = r.title.toLowerCase().includes(search) ||
                        r.author.toLowerCase().includes(search) ||
                        r.desc.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="empty-msg">📭 No resources found.</p>';
    return;
  }

  grid.innerHTML = filtered.map(r => `
    <div class="resource-card">
      <span class="cat-badge">${r.category}</span>
      <h3>${escapeHTML(r.title)}</h3>
      <p class="desc">${escapeHTML(r.desc || 'No description provided.')}</p>
      <p class="meta">👤 ${escapeHTML(r.author)} · 📅 ${r.date}</p>
      <div class="card-footer">
        <a class="open-btn" href="${escapeHTML(r.link)}" target="_blank" rel="noopener">🔗 Open</a>
        <button class="del-btn" onclick="deleteResource(${r.id})">🗑</button>
      </div>
    </div>
  `).join('');
}

function escapeHTML(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

renderResources();
