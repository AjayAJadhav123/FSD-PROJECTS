// ===== Digital Certificate Generator =====
// Generate and download certificates using HTML2Canvas approach

let certificates = JSON.parse(localStorage.getItem('certificates')) || [];
let currentCert = null;

function save() { localStorage.setItem('certificates', JSON.stringify(certificates)); }

// Set today's date as default
document.getElementById('certDate').valueAsDate = new Date();

// ===== Generate Certificate =====
document.getElementById('certForm').addEventListener('submit', function (e) {
  e.preventDefault();

  currentCert = {
    id:         Date.now(),
    recipient:  document.getElementById('recipientName').value.trim(),
    course:     document.getElementById('courseName').value.trim(),
    date:       document.getElementById('certDate').value,
    template:   document.getElementById('certTemplate').value,
    instructor: document.getElementById('instructorName').value.trim(),
    generated:  new Date().toLocaleString()
  };

  renderCertificate();
  document.getElementById('previewSection').classList.remove('hidden');
  document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth' });
});

// ===== Render Certificate =====
function renderCertificate() {
  const canvas = document.getElementById('certificateCanvas');
  const { recipient, course, date, template, instructor } = currentCert;
  const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  let html = '';

  if (template === 'modern') {
    html = `
      <div class="cert-modern">
        <div class="cert-title">CERTIFICATE</div>
        <div class="cert-subtitle">of Achievement</div>
        <div style="font-size: 1rem; opacity: 0.8;">This is to certify that</div>
        <div class="cert-name">${escapeHTML(recipient)}</div>
        <div style="font-size: 1rem; opacity: 0.8;">has successfully completed</div>
        <div class="cert-course">${escapeHTML(course)}</div>
        <div class="cert-footer">
          <div><div style="border-top: 2px solid white; padding-top: 8px; margin-top: 20px;">${escapeHTML(instructor)}<br/><small>Instructor</small></div></div>
          <div><div style="border-top: 2px solid white; padding-top: 8px; margin-top: 20px;">${formattedDate}<br/><small>Date</small></div></div>
        </div>
      </div>
    `;
  } else if (template === 'classic') {
    html = `
      <div class="cert-classic">
        <div class="cert-title">Certificate of Completion</div>
        <div class="cert-subtitle">This certifies that</div>
        <div class="cert-name">${escapeHTML(recipient)}</div>
        <div style="font-size: 1rem; margin: 15px 0;">has successfully completed the course</div>
        <div class="cert-course">${escapeHTML(course)}</div>
        <div class="cert-footer">
          <div><div style="border-top: 2px solid #8b4513; padding-top: 8px; margin-top: 20px;">${escapeHTML(instructor)}<br/><small>Instructor</small></div></div>
          <div><div style="border-top: 2px solid #8b4513; padding-top: 8px; margin-top: 20px;">${formattedDate}<br/><small>Date</small></div></div>
        </div>
      </div>
    `;
  } else { // elegant
    html = `
      <div class="cert-elegant">
        <div class="cert-title">Certificate</div>
        <div class="cert-subtitle">of Excellence</div>
        <div style="font-size: 0.95rem; margin: 15px 0;">Presented to</div>
        <div class="cert-name">${escapeHTML(recipient)}</div>
        <div style="font-size: 0.95rem; margin: 15px 0;">For outstanding achievement in</div>
        <div class="cert-course">${escapeHTML(course)}</div>
        <div class="cert-footer">
          <div><div style="border-top: 2px solid #212529; padding-top: 8px; margin-top: 20px;">${escapeHTML(instructor)}<br/><small>Authorized Signature</small></div></div>
          <div><div style="border-top: 2px solid #212529; padding-top: 8px; margin-top: 20px;">${formattedDate}<br/><small>Issue Date</small></div></div>
        </div>
      </div>
    `;
  }

  canvas.innerHTML = html;
}

// ===== Download Certificate =====
function downloadCertificate() {
  // Save to history first
  certificates.unshift(currentCert);
  if (certificates.length > 10) certificates = certificates.slice(0, 10); // Keep last 10
  save();
  renderHistory();

  // Simple download using canvas
  const canvas = document.getElementById('certificateCanvas');
  
  // Create a temporary canvas
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 1200;
  tempCanvas.height = Math.round(1200 / 1.414); // A4 ratio
  const ctx = tempCanvas.getContext('2d');

  // Fill background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Draw text (simplified version)
  ctx.fillStyle = '#333';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE', tempCanvas.width / 2, 150);
  
  ctx.font = '36px Arial';
  ctx.fillText(currentCert.recipient, tempCanvas.width / 2, 300);
  
  ctx.font = '24px Arial';
  ctx.fillText(currentCert.course, tempCanvas.width / 2, 400);
  
  ctx.font = '18px Arial';
  ctx.fillText(new Date(currentCert.date).toLocaleDateString(), tempCanvas.width / 2, 500);

  // Download
  const link = document.createElement('a');
  link.download = `certificate_${currentCert.recipient.replace(/\s+/g, '_')}.png`;
  link.href = tempCanvas.toDataURL('image/png');
  link.click();

  alert('✅ Certificate downloaded! Check your downloads folder.');
}

// ===== Reset Form =====
function resetForm() {
  document.getElementById('certForm').reset();
  document.getElementById('certDate').valueAsDate = new Date();
  document.getElementById('previewSection').classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Regenerate from History =====
function regenerateCert(id) {
  const cert = certificates.find(c => c.id === id);
  if (!cert) return;

  document.getElementById('recipientName').value = cert.recipient;
  document.getElementById('courseName').value = cert.course;
  document.getElementById('certDate').value = cert.date;
  document.getElementById('certTemplate').value = cert.template;
  document.getElementById('instructorName').value = cert.instructor;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Render History =====
function renderHistory() {
  const list = document.getElementById('historyList');

  if (certificates.length === 0) {
    list.innerHTML = '<p class="empty-msg">📜 No certificates generated yet.</p>';
    return;
  }

  list.innerHTML = certificates.map(c => `
    <div class="history-item">
      <div class="history-info">
        <div class="history-name">🎓 ${escapeHTML(c.recipient)} - ${escapeHTML(c.course)}</div>
        <div class="history-meta">${new Date(c.date).toLocaleDateString()} · ${c.template} template · Generated: ${c.generated}</div>
      </div>
      <div class="history-actions">
        <button onclick="regenerateCert(${c.id})">🔄 Regenerate</button>
      </div>
    </div>
  `).join('');
}

function escapeHTML(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Initial render
renderHistory();
