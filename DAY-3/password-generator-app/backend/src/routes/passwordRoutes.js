const express = require("express");
const { generatePassword } = require("../services/passwordService");

const router = express.Router();

const passwordHistory = [];
const MAX_HISTORY = 20;

router.post("/generate", (req, res) => {
  try {
    const {
      length,
      includeSymbols,
      includeNumbers,
      includeUppercase,
      includeLowercase,
      saveToHistory
    } = req.body;

    const parsedLength = Number(length);

    if (!Number.isInteger(parsedLength) || parsedLength < 4 || parsedLength > 64) {
      return res.status(400).json({ message: "Length must be an integer between 4 and 64" });
    }

    const password = generatePassword({
      length: parsedLength,
      includeSymbols: Boolean(includeSymbols),
      includeNumbers: Boolean(includeNumbers),
      includeUppercase: Boolean(includeUppercase),
      includeLowercase: Boolean(includeLowercase)
    });

    if (saveToHistory) {
      passwordHistory.unshift({
        password,
        createdAt: new Date().toISOString(),
        options: {
          length: parsedLength,
          includeSymbols: Boolean(includeSymbols),
          includeNumbers: Boolean(includeNumbers),
          includeUppercase: Boolean(includeUppercase),
          includeLowercase: Boolean(includeLowercase)
        }
      });

      if (passwordHistory.length > MAX_HISTORY) {
        passwordHistory.pop();
      }
    }

    return res.status(200).json({ password });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Failed to generate password" });
  }
});

router.get("/history", (_req, res) => {
  return res.status(200).json(passwordHistory);
});

router.delete("/history", (_req, res) => {
  passwordHistory.length = 0;
  return res.status(200).json({ message: "History cleared" });
});

module.exports = router;
