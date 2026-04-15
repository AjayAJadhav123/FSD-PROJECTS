import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreatePostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("editPost");
    if (!raw) {
      return;
    }

    const post = JSON.parse(raw);
    setEditingId(post._id);
    setTitle(post.title);
    setContent(post.content);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      if (editingId) {
        await api.put(`/posts/${editingId}`, { title, content });
        localStorage.removeItem("editPost");
      } else {
        await api.post("/posts", { title, content });
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save post.");
    }
  }

  return (
    <main className="page-shell">
      <section className="editor-card">
        <h2>{editingId ? "Edit Post" : "Create Post"}</h2>
        <form onSubmit={handleSubmit} className="editor-form">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Post title"
            required
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows="8"
            placeholder="Write your blog content..."
            required
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit">{editingId ? "Update Post" : "Publish Post"}</button>
        </form>
      </section>
    </main>
  );
}

export default CreatePostPage;
