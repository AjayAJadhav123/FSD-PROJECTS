function HistoryList({ history, onClear }) {
  if (history.length === 0) {
    return <p className="muted-text">No saved passwords yet.</p>;
  }

  return (
    <section className="history-card">
      <div className="history-header">
        <h3>Saved Passwords</h3>
        <button onClick={onClear} className="ghost-btn">
          Clear
        </button>
      </div>
      <ul>
        {history.map((item, index) => (
          <li key={`${item.createdAt}-${index}`}>
            <code>{item.password}</code>
            <small>{new Date(item.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default HistoryList;
