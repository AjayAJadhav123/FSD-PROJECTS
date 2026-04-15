const express = require("express");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch posts" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      author: req.user.id
    });

    const populated = await post.populate("author", "name email");
    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create post" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed to edit this post" });
    }

    post.title = title.trim();
    post.content = content.trim();
    await post.save();

    const updated = await post.populate("author", "name email");
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update post" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete post" });
  }
});

module.exports = router;
