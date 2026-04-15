// ===== Online Image Compressor =====
// Uses HTML5 Canvas to compress images client-side (no server needed)

const dropZone    = document.getElementById('dropZone');
const fileInput   = document.getElementById('fileInput');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue  = document.getElementById('qualityValue');
const resultsSection = document.getElementById('resultsSection');
const resultsGrid    = document.getElementById('resultsGrid');

// Update quality label when slider moves
qualitySlider.addEventListener('input', () => {
  qualityValue.textContent = qualitySlider.value;
});

// Click on drop zone opens file picker
dropZone.addEventListener('click', () => fileInput.click());

// File input change
fileInput.addEventListener('change', () => processFiles(fileInput.files));

// Drag & drop events
dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  processFiles(e.dataTransfer.files);
});

// Process each selected file
function processFiles(files) {
  if (!files.length) return;

  resultsSection.classList.remove('hidden');
  resultsGrid.innerHTML = ''; // clear previous results
  resultsGrid.className = 'results-grid';

  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    compressImage(file);
  });
}

// Compress a single image using Canvas
function compressImage(file) {
  const quality = parseInt(qualitySlider.value) / 100;
  const reader  = new FileReader();

  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      // Draw image onto canvas
      const canvas = document.createElement('canvas');
      canvas.width  = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Export as JPEG with chosen quality
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

      // Calculate sizes
      const originalSize   = file.size;
      const compressedSize = Math.round((compressedDataUrl.length * 3) / 4); // base64 estimate
      const savings = originalSize > 0
        ? Math.max(0, Math.round((1 - compressedSize / originalSize) * 100))
        : 0;

      // Build result card
      const card = document.createElement('div');
      card.className = 'result-card';
      card.innerHTML = `
        <img src="${compressedDataUrl}" alt="Compressed preview"/>
        <div class="result-info">
          <div class="filename">${escapeHTML(file.name)}</div>
          <div class="size-row">
            <span>Original: ${formatSize(originalSize)}</span>
            <span>Compressed: ${formatSize(compressedSize)}</span>
          </div>
          <div class="savings">💾 ~${savings}% smaller</div>
          <a class="download-btn" href="${compressedDataUrl}" download="compressed_${file.name.replace(/\.[^.]+$/, '')}.jpg">
            ⬇ Download
          </a>
        </div>
      `;
      resultsGrid.appendChild(card);
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

// Format bytes to KB/MB
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
