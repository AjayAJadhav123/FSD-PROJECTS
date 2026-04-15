// ===== Voting Poll Dashboard =====
// Polls and votes stored in localStorage

let polls = JSON.parse(localStorage.getItem('polls')) || [];

function savePolls() {
  localStorage.setItem('polls', JSON.stringify(polls));
}

// Add an extra option input field
function addOption() {
  const container = document.getElementById('optionsContainer');
  const count = container.querySelectorAll('.option-input').length + 1;
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'option-input';
  input.placeholder = `Option ${count}`;
  container.appendChild(input);
}

// Handle poll creation
document.getElementById('pollForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const question = document.getElementById('pollQuestion').value.trim();
  const optionInputs = document.querySelectorAll('.option-input');
  const options = Array.from(optionInputs)
    .map(i => i.value.trim())
    .filter(v => v !== '');

  if (options.length < 2) {
    alert('Please provide at least 2 options.');
    return;
  }

  const poll = {
    id: Date.now(),
    question,
    options: options.map(text => ({ text, votes: 0 })),
    voted: false   // track if current user voted
  };

  polls.unshift(poll);
  savePolls();
  renderPolls();
  this.reset();
  // Reset options container to 2 blank inputs
  document.getElementById('optionsContainer').innerHTML = `
    <input type="text" class="option-input" placeholder="Option 1" required/>
    <input type="text" class="option-input" placeholder="Option 2" required/>
  `;
});

// Cast a vote on a specific option
function vote(pollId, optionIndex) {
  const poll = polls.find(p => p.id === pollId);
  if (!poll || poll.voted) return;
  poll.options[optionIndex].votes++;
  poll.voted = true;
  savePolls();
  renderPolls();
}

// Delete a poll
function deletePoll(pollId) {
  polls = polls.filter(p => p.id !== pollId);
  savePolls();
  renderPolls();
}

// Render all polls
function renderPolls() {
  const container = document.getElementById('pollsContainer');

  if (polls.length === 0) {
    container.innerHTML = '<p class="empty-msg">📊 No polls yet. Create one above!</p>';
    return;
  }

  container.innerHTML = polls.map(poll => {
    const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

    const optionsHTML = poll.options.map((opt, i) => {
      const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
      return `
        <div class="option-row">
          <div class="option-label">
            <span>${escapeHTML(opt.text)}</span>
            <span>${opt.votes} vote${opt.votes !== 1 ? 's' : ''} (${pct}%)</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar" style="width:${pct}%"></div>
          </div>
          ${!poll.voted
            ? `<button class="vote-btn" onclick="vote(${poll.id}, ${i})">Vote</button>`
            : `<button class="vote-btn voted" disabled>Voted ✓</button>`
          }
        </div>
      `;
    }).join('');

    return `
      <div class="poll-card">
        <h3>❓ ${escapeHTML(poll.question)}</h3>
        ${optionsHTML}
        <div class="poll-footer">
          <span>Total votes: ${totalVotes}</span>
          <button class="delete-poll-btn" onclick="deletePoll(${poll.id})">🗑 Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Initial render
renderPolls();
