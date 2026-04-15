import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import PostCard from "../components/PostCard";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const currentUser = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (err) {
        setError("Failed to load blog posts.");
      }
    }

    fetchPosts();
  }, []);

  function handleEdit(post) {
    localStorage.setItem("editPost", JSON.stringify(post));
    window.location.href = "/create";
  }

  async function handleDelete(postId) {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((item) => item._id !== postId));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
    }
  }

  return (
    <main className="page-shell">
      <section className="page-content">
        <h2>All Blogs</h2>
        {error && <p className="error-text">{error}</p>}
        <div className="card-grid">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              canManage={currentUser?.id === post.author?._id}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
