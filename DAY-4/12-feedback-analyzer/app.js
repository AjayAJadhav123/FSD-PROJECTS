// ===== Feedback Analyzer =====
// Collects feedback and performs basic sentiment analysis

let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
let selectedRating = 0;

function save() { localStorage.setItem('feedbacks', JSON.stringify(feedbacks)); }

// ===== Star Rating System =====
const stars = document.querySelectorAll('.star');
stars.forEach(star => {
  star.addEventListener('click', function () {
    selectedRating = parseInt(this.dataset.value);
    document.getElementById('rating').value = selectedRating;
    updateStars();
  });
  star.addEventListener('mouseenter', function () {
    const value = parseInt(this.dataset.value);
    stars.forEach((s, i) => {
      s.classList.toggle('active', i < value);
    });
  });
});
document.getElementById('starRating').addEventListener('mouseleave', updateStars);

function updateStars() {
  stars.forEach((s, i) => {
    s.classList.toggle('active', i < selectedRating);
  });
}

// ===== Submit Feedback =====
document.getElementById('feedbackForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const text = document.getElementById('feedbackText').value.trim();
  const rating = parseInt(document.getElementById('rating').value);

  if (rating === 0) {
    alert('Please select a rating.');
    return;
  }

  const feedback = {
    id:        Date.now(),
    name:      document.getElementById('userName').value.trim(),
    email:     document.getElementById('userEmail').value.trim(),
    type:      document.getElementById('feedbackType').value,
    text:      text,
    rating:    rating,
    sentiment: analyzeSentiment(text, rating),
    date:      new Date().toLocaleString()
  };

  feedbacks.unshift(feedback);
  save();
  this.reset();
  selectedRating = 0;
  updateStars();
  renderAll();
  alert('✅ Thank you for your feedback!');
});

// ===== Simple Sentiment Analysis =====
// Based on keywords and rating
function analyzeSentiment(text, rating) {
  const lower = text.toLowerCase();
  
  // Positive keywords
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'best', 'awesome', 'fantastic', 'wonderful', 'perfect', 'happy', 'satisfied', 'impressed'];
  // Negative keywords
  const negativeWords = ['bad', 'poor', 'terrible', 'worst', 'hate', 'awful', 'horrible', 'disappointing', 'useless', 'waste', 'angry', 'frustrated', 'disappointed'];

  let score = 0;
  positiveWords.forEach(word => { if (lower.includes(word)) score++; });
  negativeWords.forEach(word => { if (lower.includes(word)) score--; });

  // Combine keyword score with rating
  if (rating >= 4) score += 2;
  else if (rating === 3) score += 0;
  else score -= 2;

  if (score > 0) return 'Positive';
  if (score < 0) return 'Negative';
  return 'Neutral';
}

// ===== Render All =====
function renderAll() {
  updateStats();
  updateCharts();
  renderFeedback();
}

// ===== Update Stats =====
function updateStats() {
  const total = feedbacks.length;
  const positive = feedbacks.filter(f => f.sentiment === 'Positive').length;
  const neutral  = feedbacks.filter(f => f.sentiment === 'Neutral').length;
  const negative = feedbacks.filter(f => f.sentiment === 'Negative').length;

  document.getElementById('totalCount').textContent = total;
  document.getElementById('positiveCount').textContent = positive;
  document.getElementById('neutralCount').textContent = neutral;
  document.getElementById('negativeCount').textContent = negative;
}

// ===== Charts =====
let sentimentChart, typeChart;

function updateCharts() {
  const positive = feedbacks.filter(f => f.sentiment === 'Positive').length;
  const neutral  = feedbacks.filter(f => f.sentiment === 'Neutral').length;
  const negative = feedbacks.filter(f => f.sentiment === 'Negative').length;

  // Sentiment Chart
  const sentimentCtx = document.getElementById('sentimentChart').getContext('2d');
  if (sentimentChart) sentimentChart.destroy();
  sentimentChart = new Chart(sentimentCtx, {
    type: 'doughnut',
    data: {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [{
        data: [positive, neutral, negative],
        backgroundColor: ['#2ecc71', '#f39c12', '#e74c3c']
      }]
    },
    options: { responsive: true, maintainAspectRatio: true }
  });

  // Type Chart
  const types = {};
  feedbacks.forEach(f => {
    types[f.type] = (types[f.type] || 0) + 1;
  });
  const typeCtx = document.getElementById('typeChart').getContext('2d');
  if (typeChart) typeChart.destroy();
  typeChart = new Chart(typeCtx, {
    type: 'bar',
    data: {
      labels: Object.keys(types),
      datasets: [{
        label: 'Count',
        data: Object.values(types),
        backgroundColor: '#667eea'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });
}

// ===== Render Feedback List =====
function renderFeedback() {
  const list = document.getElementById('feedbackList');
  const filter = document.getElementById('filterSentiment').value;

  let filtered = filter === 'All' ? feedbacks : feedbacks.filter(f => f.sentiment === filter);

  if (filtered.length === 0) {
    list.innerHTML = '<p class="empty-msg">📭 No feedback yet.</p>';
    return;
  }

  list.innerHTML = filtered.map(f => `
    <div class="feedback-item ${f.sentiment}">
      <div class="feedback-header">
        <div class="feedback-user">👤 ${escapeHTML(f.name)}</div>
        <div class="feedback-badges">
          <span class="badge ${f.sentiment}">${f.sentiment}</span>
          <span class="badge type">${f.type}</span>
        </div>
      </div>
      <p class="feedback-text">${escapeHTML(f.text)}</p>
      <div class="feedback-meta">
        <span class="stars-display">${'★'.repeat(f.rating)}${'☆'.repeat(5 - f.rating)}</span>
        · 📧 ${escapeHTML(f.email)} · 📅 ${f.date}
      </div>
    </div>
  `).join('');
}

function escapeHTML(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Initial render
renderAll();
