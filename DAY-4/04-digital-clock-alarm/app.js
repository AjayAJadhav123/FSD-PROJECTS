// ===== Digital Clock & Alarm System =====
// Live clock updates every second; alarms checked against current time

let alarms = JSON.parse(localStorage.getItem('alarms')) || [];
let ringingAlarmId = null;

function saveAlarms() {
  localStorage.setItem('alarms', JSON.stringify(alarms));
}

// ===== Clock =====
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12; // convert to 12-hour format

  document.getElementById('clock').textContent = `${String(h).padStart(2,'0')}:${m}:${s}`;
  document.getElementById('ampm').textContent = ampm;
  document.getElementById('date-display').textContent =
    now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  checkAlarms(now);
}

// ===== Alarm Checking =====
function checkAlarms(now) {
  const currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  alarms.forEach(alarm => {
    // Trigger alarm if time matches, it's enabled, and not already ringing
    if (alarm.enabled && alarm.time === currentTime && now.getSeconds() === 0 && ringingAlarmId !== alarm.id) {
      triggerAlarm(alarm);
    }
  });
}

function triggerAlarm(alarm) {
  ringingAlarmId = alarm.id;
  document.getElementById('modalLabel').textContent = alarm.label || 'Time to wake up!';
  document.getElementById('alarmModal').classList.remove('hidden');

  // Highlight the ringing alarm card
  const card = document.getElementById(`alarm-${alarm.id}`);
  if (card) card.classList.add('ringing');

  // Play a beep sound using Web Audio API
  playBeep();
}

function dismissAlarm() {
  document.getElementById('alarmModal').classList.add('hidden');
  if (ringingAlarmId) {
    const card = document.getElementById(`alarm-${ringingAlarmId}`);
    if (card) card.classList.remove('ringing');
  }
  ringingAlarmId = null;
}

// ===== Web Audio Beep =====
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 1.5);
  } catch (err) {
    console.log('Audio not available');
  }
}

// ===== Add Alarm =====
document.getElementById('alarmForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const time  = document.getElementById('alarmTime').value;
  const label = document.getElementById('alarmLabel').value.trim();

  alarms.push({ id: Date.now(), time, label, enabled: true });
  saveAlarms();
  renderAlarms();
  this.reset();
});

// ===== Toggle Alarm =====
function toggleAlarm(id) {
  const alarm = alarms.find(a => a.id === id);
  if (alarm) {
    alarm.enabled = !alarm.enabled;
    saveAlarms();
    renderAlarms();
  }
}

// ===== Delete Alarm =====
function deleteAlarm(id) {
  alarms = alarms.filter(a => a.id !== id);
  saveAlarms();
  renderAlarms();
}

// ===== Render Alarms =====
function renderAlarms() {
  const list = document.getElementById('alarmList');

  if (alarms.length === 0) {
    list.innerHTML = '<p class="empty-msg">No alarms set.</p>';
    return;
  }

  list.innerHTML = alarms.map(alarm => {
    // Format time to 12-hour display
    const [hh, mm] = alarm.time.split(':');
    const h12 = parseInt(hh) % 12 || 12;
    const ap  = parseInt(hh) >= 12 ? 'PM' : 'AM';
    return `
      <div class="alarm-item" id="alarm-${alarm.id}">
        <div class="alarm-info">
          <div class="time">${String(h12).padStart(2,'0')}:${mm} ${ap}</div>
          <div class="label">${alarm.label || 'No label'}</div>
        </div>
        <div class="alarm-controls">
          <label class="toggle">
            <input type="checkbox" ${alarm.enabled ? 'checked' : ''} onchange="toggleAlarm(${alarm.id})"/>
            <span class="slider"></span>
          </label>
          <button class="del-btn" onclick="deleteAlarm(${alarm.id})">🗑</button>
        </div>
      </div>
    `;
  }).join('');
}

// Start clock and render alarms
renderAlarms();
updateClock();
setInterval(updateClock, 1000);
