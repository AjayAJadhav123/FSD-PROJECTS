// ===== Admin Panel Logic =====
// Simple password-based login; content saved to localStorage

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

// ===== Login =====
function adminLogin(e) {
  e.preventDefault();
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').classList.remove('hidden');
    loadAdminValues();
  } else {
    alert('Invalid credentials. Try admin / admin123');
  }
}

function adminLogout() {
  document.getElementById('adminDashboard').classList.add('hidden');
  document.getElementById('loginScreen').style.display = 'flex';
}

// ===== Tab Switching =====
function showTab(name) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  event.target.classList.add('active');
}

// ===== Load current values into admin fields =====
function loadAdminValues() {
  document.getElementById('editHeroTitle').value    = get('heroTitle');
  document.getElementById('editHeroSubtitle').value = get('heroSubtitle');
  document.getElementById('editAboutText').value    = get('aboutText');
  document.getElementById('editStat1').value        = get('stat1');
  document.getElementById('editStat2').value        = get('stat2');
  document.getElementById('editStat3').value        = get('stat3');
  document.getElementById('editFooterText').value   = get('footerText');
  renderAdminServices();
}

function get(key) {
  const defaults = {
    heroTitle:    'Building the Future, Today',
    heroSubtitle: 'We craft innovative digital solutions that help businesses grow and thrive in the modern world.',
    aboutText:    'We are a passionate team of developers, designers, and strategists.',
    stat1: '200+', stat2: '500+', stat3: '10+',
    footerText: '© 2024 TechCorp. All rights reserved.'
  };
  const val = localStorage.getItem('company_' + key);
  return val !== null ? val : defaults[key];
}

function set(key, val) {
  localStorage.setItem('company_' + key, val);
}

function getServices() {
  const raw = localStorage.getItem('company_services');
  return raw ? JSON.parse(raw) : [
    { icon: '💻', title: 'Web Development', desc: 'Modern, fast, and responsive websites.' },
    { icon: '📱', title: 'Mobile Apps',     desc: 'Cross-platform mobile applications.' },
    { icon: '🎨', title: 'UI/UX Design',    desc: 'Beautiful and intuitive interfaces.' },
    { icon: '☁️', title: 'Cloud Solutions', desc: 'Scalable cloud infrastructure.' }
  ];
}

// ===== Save Hero =====
function saveHero() {
  set('heroTitle',    document.getElementById('editHeroTitle').value.trim());
  set('heroSubtitle', document.getElementById('editHeroSubtitle').value.trim());
  alert('✅ Hero section saved!');
}

// ===== Save About =====
function saveAbout() {
  set('aboutText', document.getElementById('editAboutText').value.trim());
  set('stat1',     document.getElementById('editStat1').value.trim());
  set('stat2',     document.getElementById('editStat2').value.trim());
  set('stat3',     document.getElementById('editStat3').value.trim());
  alert('✅ About section saved!');
}

// ===== Save Footer =====
function saveFooter() {
  set('footerText', document.getElementById('editFooterText').value.trim());
  alert('✅ Footer saved!');
}

// ===== Services =====
function renderAdminServices() {
  const services = getServices();
  const list = document.getElementById('servicesList');
  list.innerHTML = services.map((s, i) => `
    <div class="admin-service-item">
      <span class="svc-icon">${s.icon}</span>
      <span class="svc-name">${escapeHTML(s.title)}</span>
      <button onclick="editService(${i})">✏️ Edit</button>
      <button class="del-btn" onclick="deleteService(${i})">🗑</button>
    </div>
  `).join('') || '<p style="color:#aaa">No services yet.</p>';
}

function editService(index) {
  const services = getServices();
  const s = services[index];
  document.getElementById('editServiceIndex').value = index;
  document.getElementById('svcIcon').value  = s.icon;
  document.getElementById('svcTitle').value = s.title;
  document.getElementById('svcDesc').value  = s.desc;
}

function saveService() {
  const services = getServices();
  const index = parseInt(document.getElementById('editServiceIndex').value);
  const svc = {
    icon:  document.getElementById('svcIcon').value.trim() || '⭐',
    title: document.getElementById('svcTitle').value.trim(),
    desc:  document.getElementById('svcDesc').value.trim()
  };
  if (!svc.title) { alert('Please enter a service title.'); return; }

  if (index === -1) {
    services.push(svc); // new service
  } else {
    services[index] = svc; // update existing
  }

  localStorage.setItem('company_services', JSON.stringify(services));
  document.getElementById('editServiceIndex').value = -1;
  document.getElementById('svcIcon').value  = '';
  document.getElementById('svcTitle').value = '';
  document.getElementById('svcDesc').value  = '';
  renderAdminServices();
  alert('✅ Service saved!');
}

function deleteService(index) {
  if (!confirm('Delete this service?')) return;
  const services = getServices();
  services.splice(index, 1);
  localStorage.setItem('company_services', JSON.stringify(services));
  renderAdminServices();
}

function escapeHTML(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
