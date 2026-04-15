// ===== PDF Merger =====
// Uses pdf-lib (loaded via CDN) to merge PDFs client-side

const dropZone  = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
let pdfFiles    = []; // array of File objects

// Click drop zone to open file picker
dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => addFiles(fileInput.files));

// Drag & drop
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  addFiles(e.dataTransfer.files);
});

// Add files to the list
function addFiles(files) {
  Array.from(files).forEach(f => {
    if (f.type === 'application/pdf') pdfFiles.push(f);
  });
  renderFileList();
}

// Remove a file by index
function removeFile(index) {
  pdfFiles.splice(index, 1);
  renderFileList();
}

// Clear all files
function clearFiles() {
  pdfFiles = [];
  renderFileList();
}

// Render the sortable file list
function renderFileList() {
  const section = document.getElementById('fileListSection');
  const list    = document.getElementById('fileList');
  const count   = document.getElementById('fileCount');

  if (pdfFiles.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  count.textContent = `(${pdfFiles.length} file${pdfFiles.length > 1 ? 's' : ''})`;

  list.innerHTML = pdfFiles.map((f, i) => `
    <li class="file-item" draggable="true" data-index="${i}">
      <span class="icon">📄</span>
      <span class="name">${escapeHTML(f.name)}</span>
      <span class="size">${formatSize(f.size)}</span>
      <button class="remove-btn" onclick="removeFile(${i})">✕</button>
    </li>
  `).join('');

  // Drag-to-reorder logic
  setupDragSort();
}

// Simple drag-to-reorder for list items
function setupDragSort() {
  const items = document.querySelectorAll('.file-item');
  let dragSrc = null;

  items.forEach(item => {
    item.addEventListener('dragstart', function () {
      dragSrc = this;
      this.classList.add('dragging');
    });
    item.addEventListener('dragend', function () {
      this.classList.remove('dragging');
    });
    item.addEventListener('dragover', e => e.preventDefault());
    item.addEventListener('drop', function () {
      if (dragSrc === this) return;
      const fromIdx = parseInt(dragSrc.dataset.index);
      const toIdx   = parseInt(this.dataset.index);
      // Swap files in array
      [pdfFiles[fromIdx], pdfFiles[toIdx]] = [pdfFiles[toIdx], pdfFiles[fromIdx]];
      renderFileList();
    });
  });
}

// Merge all PDFs using pdf-lib
async function mergePDFs() {
  if (pdfFiles.length < 2) {
    alert('Please add at least 2 PDF files to merge.');
    return;
  }

  document.getElementById('fileListSection').style.display = 'none';
  document.getElementById('progressSection').style.display = 'block';

  const progressBar  = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');

  try {
    const { PDFDocument } = PDFLib; // from CDN
    const mergedPdf = await PDFDocument.create();

    for (let i = 0; i < pdfFiles.length; i++) {
      progressText.textContent = `Processing file ${i + 1} of ${pdfFiles.length}...`;
      progressBar.style.width = `${Math.round(((i) / pdfFiles.length) * 90)}%`;

      // Read file as ArrayBuffer
      const arrayBuffer = await pdfFiles[i].arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }

    progressBar.style.width = '100%';
    progressText.textContent = 'Finalizing...';

    // Save merged PDF as bytes
    const mergedBytes = await mergedPdf.save();
    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    const url  = URL.createObjectURL(blob);

    // Show download link
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('downloadSection').style.display = 'block';
    const link = document.getElementById('downloadLink');
    link.href = url;
    link.download = 'merged.pdf';

  } catch (err) {
    alert('Error merging PDFs: ' + err.message);
    document.getElementById('progressSection').style.display = 'none';
    document.getElementById('fileListSection').style.display = 'block';
  }
}

// Reset tool to initial state
function resetTool() {
  pdfFiles = [];
  document.getElementById('downloadSection').style.display = 'none';
  document.getElementById('fileListSection').style.display = 'none';
  document.getElementById('progressBar').style.width = '0%';
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
