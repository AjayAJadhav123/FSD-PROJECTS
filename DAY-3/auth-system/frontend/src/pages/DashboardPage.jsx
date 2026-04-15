import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../services/authService";

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const data = await fetchCurrentUser(token);
        setUser(data);
      } catch (err) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    loadUser();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>Dashboard</h1>
        {error && <p className="error-text">{error}</p>}
        {user ? (
          <div className="dashboard-box">
            <p>Welcome, {user.name}</p>
            <p>{user.email}</p>
          </div>
        ) : (
          <p className="muted-text">Loading user details...</p>
        )}
        <button onClick={handleLogout}>Logout</button>
      </section>
    </main>
  );
}

export default DashboardPage;
