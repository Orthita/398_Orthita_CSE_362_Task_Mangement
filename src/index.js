const express = require("express");
const app = express();

const tasksRouter = require("./routes/tasks");

app.use("/tasks", tasksRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Task API!");
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", uptime: process.uptime() });
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
