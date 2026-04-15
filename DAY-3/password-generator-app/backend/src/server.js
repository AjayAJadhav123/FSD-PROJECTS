const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const passwordRoutes = require("./routes/passwordRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Password Generator API is running" });
});

app.use("/api/password", passwordRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
