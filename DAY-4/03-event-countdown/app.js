// ===== Event Countdown App =====
// Events stored in localStorage; countdowns update every second

let events = JSON.parse(localStorage.getItem('countdownEvents')) || [];

function saveEvents() {
  localStorage.setItem('countdownEvents', JSON.stringify(events));
}

// Handle form submission
document.getElementById('eventForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('eventName').value.trim();
  const date = document.getElementById('eventDate').value;
  const desc = document.getElementById('eventDesc').value.trim();

  if (!name || !date) return;

  // Validate that the date is in the future
  if (new Date(date) <= new Date()) {
    alert('Please select a future date and time.');
    return;
  }

  events.push({ id: Date.now(), name, date, desc });
  saveEvents();
  renderEvents();
  this.reset();
});

// Delete an event
function deleteEvent(id) {
  events = events.filter(e => e.id !== id);
  saveEvents();
  renderEvents();
}

// Calculate time remaining
function getTimeLeft(dateStr) {
  const diff = new Date(dateStr) - new Date();
  if (diff <= 0) return null;

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

// Render all event cards
function renderEvents() {
  const container = document.getElementById('eventsContainer');

  if (events.length === 0) {
    container.innerHTML = '<p class="empty-msg">📅 No events added yet.</p>';
    return;
  }

  container.innerHTML = events.map(ev => {
    const t = getTimeLeft(ev.date);
    const expired = !t;
    const countdownHTML = expired
      ? '<span class="expired-label">🎉 Event has passed!</span>'
      : `<div class="countdown">
          <div class="time-box"><span class="num" id="d-${ev.id}">${t.days}</span><span class="label">Days</span></div>
          <div class="time-box"><span class="num" id="h-${ev.id}">${t.hours}</span><span class="label">Hours</span></div>
          <div class="time-box"><span class="num" id="m-${ev.id}">${t.minutes}</span><span class="label">Mins</span></div>
          <div class="time-box"><span class="num" id="s-${ev.id}">${t.seconds}</span><span class="label">Secs</span></div>
        </div>`;

    return `
      <div class="event-card ${expired ? 'expired' : ''}">
        <h3>🎯 ${escapeHTML(ev.name)}</h3>
        ${ev.desc ? `<p class="desc">${escapeHTML(ev.desc)}</p>` : ''}
        ${countdownHTML}
        <div class="event-footer">
          <span>📅 ${new Date(ev.date).toLocaleString()}</span>
          <button class="delete-btn" onclick="deleteEvent(${ev.id})">🗑 Remove</button>
        </div>
      </div>
    `;
  }).join('');
}

// Update countdown numbers every second without full re-render
function tickCountdowns() {
  events.forEach(ev => {
    const t = getTimeLeft(ev.date);
    if (!t) return;
    const d = document.getElementById(`d-${ev.id}`);
    const h = document.getElementById(`h-${ev.id}`);
    const m = document.getElementById(`m-${ev.id}`);
    const s = document.getElementById(`s-${ev.id}`);
    if (d) d.textContent = t.days;
    if (h) h.textContent = t.hours;
    if (m) m.textContent = t.minutes;
    if (s) s.textContent = t.seconds;
  });
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Initial render then tick every second
renderEvents();
setInterval(tickCountdowns, 1000);
