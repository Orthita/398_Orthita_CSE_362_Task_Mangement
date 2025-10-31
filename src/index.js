const express = require('express');
const app = express();
const port = 3000;

const tasks = [
  { id: 1, title: 'Learn Node.js', completed: false, priority: 'high', createdAt: new Date() },
  { id: 2, title: 'Build REST API', completed: false, priority: 'medium', createdAt: new Date() },
  { id: 3, title: 'Test with Postman', completed: false, priority: 'low', createdAt: new Date() },
  { id: 4, title: 'Write Documentation', completed: false, priority: 'medium', createdAt: new Date() },
  { id: 5, title: 'Push to GitHub', completed: false, priority: 'high', createdAt: new Date() }
];

app.get('/', (req, res) => {
  res.send('Task Management API is running!');
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.get('/task/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID format' });
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
