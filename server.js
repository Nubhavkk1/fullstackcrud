// server.js
// add this route in server.js
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- API routes ---

// Get all students
app.get('/api/students', (req, res) => {
  try {
    const rows = db.listStudents();
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// Get a student
app.get('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const student = db.getStudent(id);
  if (!student) return res.status(404).json({ ok: false, error: 'Not found' });
  res.json({ ok: true, data: student });
});

// Create student
app.post('/api/students', (req, res) => {
  const { name, roll_no, class: studentClass } = req.body || {};
  if (!name || !roll_no || !studentClass) {
    return res.status(400).json({ ok: false, error: 'All fields required' });
  }
  try {
    const student = db.createStudent(name, roll_no, studentClass);
    res.status(201).json({ ok: true, data: student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Insert failed' });
  }
});

// Update
app.put('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const { name, roll_no, class: studentClass } = req.body || {};
  if (!name || !roll_no || !studentClass) {
    return res.status(400).json({ ok: false, error: 'All fields required' });
  }
  try {
    const updated = db.updateStudent(id, name, roll_no, studentClass);
    if (!updated) return res.status(404).json({ ok: false, error: 'Not found' });
    res.json({ ok: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Update failed' });
  }
});

// Delete
app.delete('/api/students/:id', (req, res) => {
  const id = Number(req.params.id);
  try {
    const deleted = db.deleteStudent(id);
    if (!deleted) return res.status(404).json({ ok: false, error: 'Not found' });
    res.json({ ok: true, data: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Delete failed' });
  }
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});

