// ===== Personal Finance Tracker =====
// Track income and expenses with charts

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function save() { localStorage.setItem('transactions', JSON.stringify(transactions)); }

// Set today's date as default
document.getElementById('txnDate').valueAsDate = new Date();

// ===== Add Transaction =====
document.getElementById('transactionForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const txn = {
    id:       Date.now(),
    desc:     document.getElementById('txnDesc').value.trim(),
    amount:   parseFloat(document.getElementById('txnAmount').value),
    type:     document.getElementById('txnType').value,
    category: document.getElementById('txnCategory').value,
    date:     document.getElementById('txnDate').value
  };

  transactions.unshift(txn);
  save();
  renderAll();
  this.reset();
  document.getElementById('txnDate').valueAsDate = new Date();
});

// ===== Delete Transaction =====
function deleteTxn(id) {
  if (!confirm('Delete this transaction?')) return;
  transactions = transactions.filter(t => t.id !== id);
  save();
  renderAll();
}

// ===== Clear All =====
function clearAll() {
  if (!confirm('Delete all transactions? This cannot be undone.')) return;
  transactions = [];
  save();
  renderAll();
}

// ===== Render All =====
function renderAll() {
  updateBalance();
  updateCharts();
  renderTransactions();
}

// ===== Update Balance =====
function updateBalance() {
  const income  = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  document.getElementById('totalBalance').textContent = '$' + balance.toFixed(2);
  document.getElementById('totalIncome').textContent  = '$' + income.toFixed(2);
  document.getElementById('totalExpense').textContent = '$' + expense.toFixed(2);
}

// ===== Charts =====
let incomeExpenseChart, categoryChart;

function updateCharts() {
  const income  = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);

  // Income vs Expense Chart
  const ctx1 = document.getElementById('incomeExpenseChart').getContext('2d');
  if (incomeExpenseChart) incomeExpenseChart.destroy();
  incomeExpenseChart = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: ['Income', 'Expenses'],
      datasets: [{
        label: 'Amount ($)',
        data: [income, expense],
        backgroundColor: ['#2ecc71', '#e74c3c']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: { y: { beginAtZero: true } }
    }
  });

  // Category Chart (Expenses only)
  const categories = {};
  transactions.filter(t => t.type === 'Expense').forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + t.amount;
  });

  const ctx2 = document.getElementById('categoryChart').getContext('2d');
  if (categoryChart) categoryChart.destroy();
  categoryChart = new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ['#e74c3c', '#f39c12', '#3498db', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#95a5a6']
      }]
    },
    options: { responsive: true, maintainAspectRatio: true }
  });
}

// ===== Render Transactions =====
function renderTransactions() {
  const list = document.getElementById('transactionList');
  const filter = document.getElementById('filterType').value;

  let filtered = filter === 'All' ? transactions : transactions.filter(t => t.type === filter);

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    list.innerHTML = '<p class="empty-msg">📭 No transactions yet.</p>';
    return;
  }

  list.innerHTML = filtered.map(t => `
    <div class="txn-item ${t.type}">
      <div class="txn-info">
        <div class="txn-desc">${escapeHTML(t.desc)}</div>
        <div class="txn-meta">${t.category} · ${new Date(t.date).toLocaleDateString()}</div>
      </div>
      <div class="txn-amount">${t.type === 'Income' ? '+' : '-'}$${t.amount.toFixed(2)}</div>
      <button class="txn-del" onclick="deleteTxn(${t.id})">🗑</button>
    </div>
  `).join('');
}

function escapeHTML(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Initial render
renderAll();
