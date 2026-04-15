// ===== Blog CMS - Public View =====
let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
let currentView = 'grid';
let currentPostId = null;

// ===== Show Category =====
function showCategory(cat) {
  document.getElementById('filterCategory').value = cat;
  renderPosts();
}

// ===== Render Posts Grid =====
function renderPosts() {
  const grid = document.getElementById('postsGrid');
  const single = document.getElementById('singlePost');
  const search = document.getElementById('searchPosts').value.toLowerCase();
  const category = document.getElementById('filterCategory').value;

  grid.classList.remove('hidden');
  single.classList.add('hidden');

  let filtered = posts.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.title.toLowerCase().includes(search) ||
                        p.excerpt.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  // Sort by date (newest first)
  filtered.sort((a, b) => b.id - a.id);

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="empty-msg">📝 No posts found.</p>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="post-card" onclick="viewPost(${p.id})">
      ${p.image ? `<img src="${p.image}" class="post-image" alt="${escapeHTML(p.title)}"/>` : '<div class="post-image"></div>'}
      <div class="post-content">
        <span class="post-category">${p.category}</span>
        <h3 class="post-title">${escapeHTML(p.title)}</h3>
        <p class="post-excerpt">${escapeHTML(p.excerpt)}</p>
        <div class="post-meta">👤 ${escapeHTML(p.author)} · 📅 ${p.date}</div>
      </div>
    </div>
  `).join('');
}

// ===== View Single Post =====
function viewPost(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;

  const grid = document.getElementById('postsGrid');
  const single = document.getElementById('singlePost');

  grid.classList.add('hidden');
  single.classList.remove('hidden');

  single.innerHTML = `
    <button class="back-btn" onclick="renderPosts()">← Back to all posts</button>
    ${post.image ? `<img src="${post.image}" class="post-image" alt="${escapeHTML(post.title)}"/>` : ''}
    <span class="post-category">${post.category}</span>
    <h1 class="post-title">${escapeHTML(post.title)}</h1>
    <div class="post-meta">👤 ${escapeHTML(post.author)} · 📅 ${post.date}</div>
    <div class="post-body">${escapeHTML(post.content)}</div>
  `;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function escapeHTML(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Initial render
renderPosts();
