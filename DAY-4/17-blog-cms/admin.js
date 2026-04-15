// ===== Blog CMS - Admin Panel =====
const ADMIN_PASS = 'admin123';

function login(e) {
  e.preventDefault();
  if (document.getElementById('adminPass').value === ADMIN_PASS) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').classList.remove('hidden');
    renderAdminPosts();
  } else {
    alert('Invalid password');
  }
}

function logout() {
  document.getElementById('adminDashboard').classList.add('hidden');
  document.getElementById('loginScreen').style.display = 'flex';
}

function showTab(name) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  event.target.classList.add('active');
}

// ===== Add/Edit Post =====
document.getElementById('postForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const id = document.getElementById('editId').value;
  const post = {
    id:      id ? parseInt(id) : Date.now(),
    title:   document.getElementById('postTitle').value.trim(),
    category: document.getElementById('postCategory').value,
    excerpt: document.getElementById('postExcerpt').value.trim(),
    content: document.getElementById('postContent').value.trim(),
    author:  document.getElementById('postAuthor').value.trim(),
    image:   document.getElementById('postImage').value.trim(),
    date:    new Date().toLocaleDateString()
  };

  if (id) {
    const index = posts.findIndex(p => p.id === parseInt(id));
    if (index !== -1) posts[index] = post;
  } else {
    posts.unshift(post);
  }

  localStorage.setItem('blogPosts', JSON.stringify(posts));
  this.reset();
  cancelEdit();
  renderAdminPosts();
  alert('✅ Post published!');
});

function editPost(id) {
  const post = posts.find(p => p.id === id);
  if (!post) return;
  document.getElementById('editId').value = post.id;
  document.getElementById('postTitle').value = post.title;
  document.getElementById('postCategory').value = post.category;
  document.getElementById('postExcerpt').value = post.excerpt;
  document.getElementById('postContent').value = post.content;
  document.getElementById('postAuthor').value = post.author;
  document.getElementById('postImage').value = post.image;
  document.getElementById('formTitle').textContent = 'Edit Post';
  showTab('new');
}

function cancelEdit() {
  document.getElementById('postForm').reset();
  document.getElementById('editId').value = '';
  document.getElementById('formTitle').textContent = 'Create New Post';
}

function deletePost(id) {
  if (!confirm('Delete this post?')) return;
  posts = posts.filter(p => p.id !== id);
  localStorage.setItem('blogPosts', JSON.stringify(posts));
  renderAdminPosts();
}

function renderAdminPosts() {
  const list = document.getElementById('adminPostsList');
  if (posts.length === 0) {
    list.innerHTML = '<p class="empty-msg">No posts yet.</p>';
    return;
  }
  list.innerHTML = posts.map(p => `
    <div class="admin-post-item">
      <div class="admin-post-content">
        <div class="admin-post-title">${p.title}</div>
        <div class="admin-post-meta">${p.category} · ${p.date}</div>
      </div>
      <div class="admin-post-actions">
        <button onclick="editPost(${p.id})">✏️ Edit</button>
        <button onclick="deletePost(${p.id})">🗑 Delete</button>
      </div>
    </div>
  `).join('');
}
