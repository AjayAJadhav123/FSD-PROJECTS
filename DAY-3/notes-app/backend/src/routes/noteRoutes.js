const express = require("express");
const Note = require("../models/Note");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch notes" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await Note.create({
      title: title.trim(),
      content: content.trim()
    });

    return res.status(201).json(note);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create note" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        content: content.trim()
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json(updatedNote);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update note" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete note" });
  }
});

module.exports = router;
