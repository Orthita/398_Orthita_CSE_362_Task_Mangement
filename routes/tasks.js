const express = require('express');
const router = express.Router();

// In-memory task list
let tasks = [
  { id: 1, title: 'Sample Task', completed: false }
];

// ✅ Task 1 - GET /tasks
router.get('/', (req, res) => {
  res.status(200).json({ success: true, data: tasks });
});

// ✅ Task 2 - POST /tasks
router.post('/', (req, res) => {
  try {
    const { title } = req.body;

    if (!req.body) {
      return res.status(400).json({ success: false, message: 'Invalid JSON format' });
    }

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      completed: false
    };

    tasks.push(newTask);
    res.status(201).json({ success: true, data: newTask });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
