function formatDate(dateValue) {
  return new Date(dateValue).toLocaleString();
}

function PostCard({ post, canManage, onEdit, onDelete }) {
  return (
    <article className="post-card">
      <h3>{post.title}</h3>
      <p className="meta-text">
        By {post.author?.name || "Unknown"} | {formatDate(post.createdAt)}
      </p>
      <p>{post.content}</p>
      {canManage && (
        <div className="card-actions">
          <button className="edit-btn" onClick={() => onEdit(post)}>
            Edit
          </button>
          <button className="delete-btn" onClick={() => onDelete(post._id)}>
            Delete
          </button>
        </div>
      )}
    </article>
  );
}

export default PostCard;
