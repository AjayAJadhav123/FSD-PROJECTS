// ===== Company Website — Public Page =====
// Reads content from localStorage (set by admin panel) and renders it

// Default content shown if admin hasn't changed anything
const defaults = {
  heroTitle:    'Building the Future, Today',
  heroSubtitle: 'We craft innovative digital solutions that help businesses grow and thrive in the modern world.',
  aboutText:    'We are a passionate team of developers, designers, and strategists dedicated to delivering world-class digital experiences. Founded in 2015, we have helped over 200 companies transform their digital presence.',
  stat1: '200+', stat2: '500+', stat3: '10+',
  footerText: '© 2024 TechCorp. All rights reserved.',
  services: [
    { icon: '💻', title: 'Web Development', desc: 'Modern, fast, and responsive websites built with the latest technologies.' },
    { icon: '📱', title: 'Mobile Apps',     desc: 'Cross-platform mobile applications for iOS and Android.' },
    { icon: '🎨', title: 'UI/UX Design',    desc: 'Beautiful and intuitive interfaces that users love.' },
    { icon: '☁️', title: 'Cloud Solutions', desc: 'Scalable cloud infrastructure and DevOps services.' }
  ]
};

function get(key) {
  const val = localStorage.getItem('company_' + key);
  return val !== null ? val : defaults[key];
}

function getServices() {
  const raw = localStorage.getItem('company_services');
  return raw ? JSON.parse(raw) : defaults.services;
}

// Apply content to the page
function applyContent() {
  document.getElementById('heroTitle').textContent    = get('heroTitle');
  document.getElementById('heroSubtitle').textContent = get('heroSubtitle');
  document.getElementById('aboutText').textContent    = get('aboutText');
  document.getElementById('stat1').textContent        = get('stat1');
  document.getElementById('stat2').textContent        = get('stat2');
  document.getElementById('stat3').textContent        = get('stat3');
  document.getElementById('footerText').textContent   = get('footerText');

  // Render services
  const grid = document.getElementById('servicesGrid');
  if (grid) {
    grid.innerHTML = getServices().map(s => `
      <div class="service-card">
        <span class="icon">${s.icon}</span>
        <h3>${escapeHTML(s.title)}</h3>
        <p>${escapeHTML(s.desc)}</p>
      </div>
    `).join('');
  }
}

// Mobile nav toggle
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

// Contact form submission (simulated)
function submitContact(e) {
  e.preventDefault();
  const msg = document.getElementById('contactMsg');
  msg.textContent = '✅ Message sent! We\'ll get back to you soon.';
  msg.classList.remove('hidden');
  e.target.reset();
  setTimeout(() => msg.classList.add('hidden'), 4000);
}

function escapeHTML(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

applyContent();
