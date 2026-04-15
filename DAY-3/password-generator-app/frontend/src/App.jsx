import { useEffect, useState } from "react";
import PasswordOptions from "./components/PasswordOptions";
import HistoryList from "./components/HistoryList";
import { clearHistory, generatePassword, getHistory } from "./services/passwordApi";

function App() {
  const [options, setOptions] = useState({
    length: 14,
    includeSymbols: true,
    includeNumbers: true,
    includeUppercase: true,
    includeLowercase: true,
    saveToHistory: true
  });
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (_err) {
        setHistory([]);
      }
    }

    loadHistory();
  }, []);

  function handleOptionChange(key, value) {
    setOptions((prev) => ({ ...prev, [key]: value }));
  }

  async function handleGenerate() {
    setError("");
    setCopied(false);
    try {
      const data = await generatePassword(options);
      setPassword(data.password);
      if (options.saveToHistory) {
        const updatedHistory = await getHistory();
        setHistory(updatedHistory);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate password.");
    }
  }

  async function handleCopy() {
    if (!password) {
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (_err) {
      setError("Failed to copy password.");
    }
  }

  async function handleClearHistory() {
    try {
      await clearHistory();
      setHistory([]);
    } catch (_err) {
      setError("Failed to clear history.");
    }
  }

  return (
    <main className="app-shell">
      <section className="generator-card">
        <h1>Password Generator</h1>

        <PasswordOptions options={options} onChange={handleOptionChange} />

        <div className="actions">
          <button onClick={handleGenerate} className="primary-btn">
            Generate Password
          </button>
          <button onClick={handleCopy} className="secondary-btn" disabled={!password}>
            Copy
          </button>
        </div>

        {password && (
          <div className="password-box">
            <code>{password}</code>
            {copied && <span className="copied-tag">Copied</span>}
          </div>
        )}

        {error && <p className="error-text">{error}</p>}

        <HistoryList history={history} onClear={handleClearHistory} />
      </section>
    </main>
  );
}

export default App;
