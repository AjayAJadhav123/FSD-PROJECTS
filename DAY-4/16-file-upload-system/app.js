// ===== File Upload System =====
// Simulates file upload using FileReader and stores metadata in localStorage

let files = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit

function save() { localStorage.setItem('uploadedFiles', JSON.stringify(files)); }

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');

// Click to browse
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => handleFiles(fileInput.files));

// Drag & drop
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});

// ===== Handle File Upload =====
function handleFiles(fileList) {
  const progressSection = document.getElementById('uploadProgress');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');

  progressSection.classList.remove('hidden');
  let uploaded = 0;

  Array.from(fileList).forEach((file, index) => {
    if (file.size > MAX_SIZE) {
      alert(`${file.name} exceeds 5MB limit and was skipped.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const fileData = {
        id:       Date.now() + index,
        name:     file.name,
        size:     file.size,
        type:     file.type || 'unknown',
        data:     e.target.result, // base64 data
        uploaded: new Date().toLocaleString()
      };

      files.unshift(fileData);
      uploaded++;

      // Update progress
      const percent = Math.round((uploaded / fileList.length) * 100);
      progressBar.style.width = percent + '%';
      progressText.textContent = `Uploading... ${uploaded}/${fileList.length}`;

      if (uploaded === fileList.length) {
        save();
        renderAll();
        setTimeout(() => {
          progressSection.classList.add('hidden');
          progressBar.style.width = '0%';
        }, 1000);
      }
    };
    reader.readAsDataURL(file);
  });
}

// ===== Download File =====
function downloadFile(id) {
  const file = files.find(f => f.id === id);
  if (!file) return;

  const link = document.createElement('a');
  link.href = file.data;
  link.download = file.name;
  link.click();
}

// ===== Delete File =====
function deleteFile(id) {
  if (!confirm('Delete this file?')) return;
  files = files.filter(f => f.id !== id);
  save();
  renderAll();
}

// ===== Clear All =====
function clearAll() {
  if (!confirm('Delete all files? This cannot be undone.')) return;
  files = [];
  save();
  renderAll();
}

// ===== Render All =====
function renderAll() {
  updateStats();
  renderFiles();
}

// ===== Update Stats =====
function updateStats() {
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const storageLimit = 50 * 1024 * 1024; // 50MB simulated limit
  const percent = Math.min(100, Math.round((totalSize / storageLimit) * 100));

  document.getElementById('totalFiles').textContent = files.length;
  document.getElementById('totalSize').textContent = formatSize(totalSize);
  document.getElementById('storagePercent').textContent = percent + '%';
}

// ===== Render Files =====
function renderFiles() {
  const list = document.getElementById('filesList');
  const search = document.getElementById('searchFiles').value.toLowerCase();
  const sortBy = document.getElementById('sortBy').value;

  let filtered = files.filter(f => f.name.toLowerCase().includes(search));

  // Sort
  if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'size') filtered.sort((a, b) => b.size - a.size);
  else filtered.sort((a, b) => b.id - a.id); // date (newest first)

  if (filtered.length === 0) {
    list.innerHTML = '<p class="empty-msg">📁 No files uploaded yet.</p>';
    return;
  }

  list.innerHTML = filtered.map(f => `
    <div class="file-item">
      <div class="file-icon">${getFileIcon(f.type)}</div>
      <div class="file-info">
        <div class="file-name">${escapeHTML(f.name)}</div>
        <div class="file-meta">${formatSize(f.size)} · ${f.uploaded}</div>
      </div>
      <div class="file-actions">
        <button class="download-btn" onclick="downloadFile(${f.id})">⬇️ Download</button>
        <button class="del-btn" onclick="deleteFile(${f.id})">🗑</button>
      </div>
    </div>
  `).join('');
}

// ===== Get File Icon =====
function getFileIcon(type) {
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('video/')) return '🎥';
  if (type.startsWith('audio/')) return '🎵';
  if (type.includes('pdf')) return '📄';
  if (type.includes('word') || type.includes('document')) return '📝';
  if (type.includes('sheet') || type.includes('excel')) return '📊';
  if (type.includes('zip') || type.includes('rar')) return '📦';
  return '📄';
}

// ===== Format File Size =====
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function escapeHTML(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Initial render
renderAll();
