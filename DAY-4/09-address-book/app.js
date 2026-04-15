// ===== Online Address Book =====
// Contacts stored in localStorage with full CRUD

let contacts = JSON.parse(localStorage.getItem('addressBook')) || [];

function save() { localStorage.setItem('addressBook', JSON.stringify(contacts)); }

// ===== Form Submit (Add or Edit) =====
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const id    = document.getElementById('editId').value;
  const name  = document.getElementById('cName').value.trim();
  const phone = document.getElementById('cPhone').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const addr  = document.getElementById('cAddr').value.trim();
  const group = document.getElementById('cGroup').value;

  // Basic phone validation
  if (!/^\+?[\d\s\-()]{7,15}$/.test(phone)) {
    alert('Please enter a valid phone number.');
    return;
  }

  if (id) {
    // Edit existing contact
    const contact = contacts.find(c => c.id === parseInt(id));
    if (contact) Object.assign(contact, { name, phone, email, addr, group });
  } else {
    // Add new contact
    contacts.push({ id: Date.now(), name, phone, email, addr, group });
  }

  save();
  renderContacts();
  cancelEdit();
});

// ===== Edit Contact =====
function editContact(id) {
  const c = contacts.find(c => c.id === id);
  if (!c) return;
  document.getElementById('editId').value  = c.id;
  document.getElementById('cName').value   = c.name;
  document.getElementById('cPhone').value  = c.phone;
  document.getElementById('cEmail').value  = c.email;
  document.getElementById('cAddr').value   = c.addr;
  document.getElementById('cGroup').value  = c.group;
  document.getElementById('formTitle').textContent = 'Edit Contact';
  document.getElementById('submitBtn').textContent = '💾 Save Changes';
  document.getElementById('cancelBtn').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Cancel Edit =====
function cancelEdit() {
  document.getElementById('contactForm').reset();
  document.getElementById('editId').value = '';
  document.getElementById('formTitle').textContent = 'Add Contact';
  document.getElementById('submitBtn').textContent = '➕ Add Contact';
  document.getElementById('cancelBtn').style.display = 'none';
}

// ===== Delete Contact =====
function deleteContact(id) {
  if (!confirm('Delete this contact?')) return;
  contacts = contacts.filter(c => c.id !== id);
  save();
  renderContacts();
}

// ===== View Contact Modal =====
function viewContact(id) {
  const c = contacts.find(c => c.id === id);
  if (!c) return;
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-name">${escapeHTML(c.name)}</div>
    <div class="modal-row"><span class="label">📞 Phone</span><span class="value">${escapeHTML(c.phone)}</span></div>
    <div class="modal-row"><span class="label">📧 Email</span><span class="value">${c.email ? escapeHTML(c.email) : '—'}</span></div>
    <div class="modal-row"><span class="label">🏠 Address</span><span class="value">${c.addr ? escapeHTML(c.addr) : '—'}</span></div>
    <div class="modal-row"><span class="label">👥 Group</span><span class="value">${c.group}</span></div>
  `;
  document.getElementById('viewModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('viewModal').classList.add('hidden');
}

// Close modal on backdrop click
document.getElementById('viewModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// ===== Render Contacts =====
function renderContacts() {
  const list   = document.getElementById('contactsList');
  const search = document.getElementById('searchInput').value.toLowerCase();
  const group  = document.getElementById('filterGroup').value;

  let filtered = contacts.filter(c => {
    const matchGroup  = group === 'All' || c.group === group;
    const matchSearch = c.name.toLowerCase().includes(search) ||
                        c.phone.includes(search) ||
                        (c.email && c.email.toLowerCase().includes(search));
    return matchGroup && matchSearch;
  });

  // Sort alphabetically by name
  filtered.sort((a, b) => a.name.localeCompare(b.name));

  document.getElementById('contactCount').textContent =
    `${filtered.length} contact${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    list.innerHTML = '<p class="empty-msg">📭 No contacts found.</p>';
    return;
  }

  list.innerHTML = filtered.map(c => `
    <div class="contact-card">
      <div class="avatar">${c.name.charAt(0).toUpperCase()}</div>
      <div class="contact-info">
        <div class="name">${escapeHTML(c.name)}</div>
        <div class="phone">${escapeHTML(c.phone)}</div>
        <span class="group-badge">${c.group}</span>
      </div>
      <div class="card-actions">
        <button class="view-btn" onclick="viewContact(${c.id})">👁</button>
        <button class="edit-btn" onclick="editContact(${c.id})">✏️</button>
        <button class="del-btn"  onclick="deleteContact(${c.id})">🗑</button>
      </div>
    </div>
  `).join('');
}

function escapeHTML(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

renderContacts();
