const express = require('express');
const router = express.Router();

// Predefined tasks
let tasks = [
  { id: 1, title: 'Task One', completed: false, priority: 'low', createdAt: new Date() },
  { id: 2, title: 'Task Two', completed: true, priority: 'medium', createdAt: new Date() },
  { id: 3, title: 'Task Three', completed: false, priority: 'high', createdAt: new Date() },
  { id: 4, title: 'Task Four', completed: true, priority: 'low', createdAt: new Date() },
  { id: 5, title: 'Task Five', completed: false, priority: 'medium', createdAt: new Date() }
];

// GET all tasks
router.get('/', (req, res) => {
  res.status(200).json({ success: true, data: tasks });
});

// GET task by ID
router.get('/:id', (req, res) => {
  const taskId = parseInt(req.params.id); // convert ID from string to number
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json({ success: true, data: task });
});

// POST a new task
router.post('/', (req, res) => {
  try {
    const { title, priority } = req.body;

    if (!req.body) {
      return res.status(400).json({ success: false, message: 'Invalid JSON format' });
    }

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
      priority: priority || 'low',
      createdAt: new Date()
    };

    tasks.push(newTask);
    res.status(201).json({ success: true, data: newTask });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
