import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
      const payload = mode === "login" ? { email, password } : { name, email, password };

      const response = await api.post(endpoint, payload);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed.");
    }
  }

  return (
    <main className="page-shell">
      <section className="auth-card">
        <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit} className="editor-form">
          {mode === "signup" && (
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            required
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit">{mode === "login" ? "Login" : "Create Account"}</button>
        </form>

        <button
          className="switch-mode"
          onClick={() => setMode((prev) => (prev === "login" ? "signup" : "login"))}
        >
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>
      </section>
    </main>
  );
}

export default LoginPage;
