const express = require('express');
const taskRouter = require('./routes/tasks');

const app = express();

// Middleware: JSON parser
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Task Manager API');
});

// Use the /tasks routes
app.use('/tasks', taskRouter);

// Error handler for invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, message: 'Invalid JSON format' });
  }
  next(err);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
