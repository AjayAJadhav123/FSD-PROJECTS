import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreatePostPage from "./pages/CreatePostPage";
import LoginPage from "./pages/LoginPage";

function NavBar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <header className="nav-header">
      <h1>Blog Site</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/create">Create Post</Link>
        <Link to="/login">Login</Link>
        {isLoggedIn && (
          <button className="link-like" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
