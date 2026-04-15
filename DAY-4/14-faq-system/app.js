// ===== FAQ System =====
// Manage and display FAQs with search and categories

let faqs = JSON.parse(localStorage.getItem('faqs')) || [];

function save() { localStorage.setItem('faqs', JSON.stringify(faqs)); }

// ===== Navigation =====
function showView(view) {
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  event.target.classList.add('active');
  
  if (view === 'public') {
    document.getElementById('publicView').classList.remove('hidden');
    document.getElementById('adminView').classList.add('hidden');
    renderFAQs();
  } else {
    document.getElementById('publicView').classList.add('hidden');
    document.getElementById('adminView').classList.remove('hidden');
    renderAdminFAQs();
  }
}

// ===== Add/Edit FAQ =====
document.getElementById('faqForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const id = document.getElementById('editId').value;
  const faq = {
    id:       id ? parseInt(id) : Date.now(),
    question: document.getElementById('faqQuestion').value.trim(),
    answer:   document.getElementById('faqAnswer').value.trim(),
    category: document.getElementById('faqCategory').value
  };

  if (id) {
    // Edit existing
    const index = faqs.findIndex(f => f.id === parseInt(id));
    if (index !== -1) faqs[index] = faq;
  } else {
    // Add new
    faqs.unshift(faq);
  }

  save();
  this.reset();
  cancelEdit();
  renderAdminFAQs();
  alert('✅ FAQ saved successfully!');
});

// ===== Edit FAQ =====
function editFAQ(id) {
  const faq = faqs.find(f => f.id === id);
  if (!faq) return;

  document.getElementById('editId').value = faq.id;
  document.getElementById('faqQuestion').value = faq.question;
  document.getElementById('faqAnswer').value = faq.answer;
  document.getElementById('faqCategory').value = faq.category;
  document.getElementById('formTitle').textContent = 'Edit FAQ';
  document.getElementById('submitBtn').textContent = '💾 Save Changes';
  document.getElementById('cancelBtn').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Cancel Edit =====
function cancelEdit() {
  document.getElementById('faqForm').reset();
  document.getElementById('editId').value = '';
  document.getElementById('formTitle').textContent = 'Add New FAQ';
  document.getElementById('submitBtn').textContent = '➕ Add FAQ';
  document.getElementById('cancelBtn').style.display = 'none';
}

// ===== Delete FAQ =====
function deleteFAQ(id) {
  if (!confirm('Delete this FAQ?')) return;
  faqs = faqs.filter(f => f.id !== id);
  save();
  renderAdminFAQs();
  renderFAQs();
}

// ===== Toggle FAQ (Public View) =====
function toggleFAQ(id) {
  const item = document.getElementById('faq-' + id);
  if (item) item.classList.toggle('open');
}

// ===== Render Public FAQs =====
function renderFAQs() {
  const list = document.getElementById('faqList');
  const search = document.getElementById('searchFAQ').value.toLowerCase();
  const category = document.getElementById('filterCategory').value;

  let filtered = faqs.filter(f => {
    const matchCat = category === 'All' || f.category === category;
    const matchSearch = f.question.toLowerCase().includes(search) ||
                        f.answer.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    list.innerHTML = '<p class="empty-msg">❓ No FAQs found.</p>';
    return;
  }

  list.innerHTML = filtered.map(f => `
    <div class="faq-item" id="faq-${f.id}">
      <div class="faq-header" onclick="toggleFAQ(${f.id})">
        <div class="faq-question">${escapeHTML(f.question)}</div>
        <span class="faq-category">${f.category}</span>
        <span class="faq-toggle">▼</span>
      </div>
      <div class="faq-answer">
        <div class="faq-answer-content">${escapeHTML(f.answer)}</div>
      </div>
    </div>
  `).join('');
}

// ===== Render Admin FAQs =====
function renderAdminFAQs() {
  const list = document.getElementById('adminFAQList');

  if (faqs.length === 0) {
    list.innerHTML = '<p class="empty-msg">No FAQs yet. Add one above!</p>';
    return;
  }

  list.innerHTML = faqs.map(f => `
    <div class="admin-faq-item">
      <div class="admin-faq-content">
        <div class="admin-faq-question">❓ ${escapeHTML(f.question)}</div>
        <div class="admin-faq-answer">${escapeHTML(f.answer.substring(0, 100))}${f.answer.length > 100 ? '...' : ''}</div>
        <span class="faq-category">${f.category}</span>
      </div>
      <div class="admin-faq-actions">
        <button class="edit-btn" onclick="editFAQ(${f.id})">✏️ Edit</button>
        <button class="del-btn" onclick="deleteFAQ(${f.id})">🗑 Delete</button>
      </div>
    </div>
  `).join('');
}

function escapeHTML(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Initial render
renderFAQs();
