const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// GET all tasks with pagination
router.get('/', async (req, res) => {
  try {
    // Read query parameters
    let page = parseInt(req.query.page) || 1;   // default page = 1
    let limit = parseInt(req.query.limit) || 10; // default limit = 10

    if (limit > 50) limit = 50; // maximum limit = 50
    if (page < 1) page = 1;

    const offset = (page - 1) * limit;

    // Count total tasks
    const [countRows] = await db.query('SELECT COUNT(*) AS total FROM tasks');
    const totalTasks = countRows[0].total;
    const totalPages = Math.ceil(totalTasks / limit);

    // Fetch tasks with limit and offset
    const [rows] = await db.query(
      'SELECT * FROM tasks ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    // Response with metadata
    res.json({
      totalTasks,
      totalPages,
      currentPage: page,
      limit,
      data: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST create new task
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    const [result] = await db.query(
      'INSERT INTO tasks (title, description) VALUES (?, ?)',
      [title, description || null]
    );
    const [newTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(newTask[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const updates = [];
    const values = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (status !== undefined) { updates.push('status = ?'); values.push(status); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const [updated] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
