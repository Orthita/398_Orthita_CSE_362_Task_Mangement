const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// GET all tasks (exclude soft-deleted) with pagination and search
router.get('/', async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    if (limit > 50) limit = 50;
    if (page < 1) page = 1;
    const offset = (page - 1) * limit;

    const searchTerm = req.query.q ? `%${req.query.q}%` : '%';

    const [countRows] = await db.query(
      'SELECT COUNT(*) AS total FROM tasks WHERE title LIKE ? AND deleted_at IS NULL',
      [searchTerm]
    );
    const totalTasks = countRows[0].total;
    const totalPages = Math.ceil(totalTasks / limit);

    const [rows] = await db.query(
      'SELECT * FROM tasks WHERE title LIKE ? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [searchTerm, limit, offset]
    );

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

// GET soft-deleted tasks
router.get('/deleted', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM tasks WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC'
    );
    res.json(rows);
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

// DELETE task (Soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      'UPDATE tasks SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found or already deleted' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Restore soft-deleted task
router.put('/:id/restore', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      'UPDATE tasks SET deleted_at = NULL WHERE id = ? AND deleted_at IS NOT NULL',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found or not deleted' });
    }
    const [restored] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(restored[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to restore task' });
  }
});

module.exports = router;
