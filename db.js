// db.js
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.sqlite3');
const INIT_SQL = path.join(__dirname, 'init.sql');

// create DB file if missing
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, '');
}

const db = new Database(DB_FILE);

// init schema
const initSql = fs.readFileSync(INIT_SQL, 'utf8');
db.exec(initSql);

// prepared statements
const insertStudent = db.prepare('INSERT INTO students (name, roll_no, class, created_at) VALUES (?, ?, ?, ?)');
const getStudent = db.prepare('SELECT * FROM students WHERE id = ?');
const updateStudent = db.prepare('UPDATE students SET name = ?, roll_no = ?, class = ? WHERE id = ?');
const deleteStudent = db.prepare('DELETE FROM students WHERE id = ?');
const listStudents = db.prepare('SELECT * FROM students ORDER BY id DESC');

module.exports = {
  createStudent: (name, roll_no, studentClass) => {
    const now = new Date().toISOString();
    const info = insertStudent.run(name, roll_no, studentClass, now);
    return getStudent.get(info.lastInsertRowid);
  },
  getStudent: (id) => getStudent.get(id),
  updateStudent: (id, name, roll_no, studentClass) => {
    const res = updateStudent.run(name, roll_no, studentClass, id);
    return res.changes > 0 ? getStudent.get(id) : null;
  },
  deleteStudent: (id) => {
    const student = getStudent.get(id);
    const res = deleteStudent.run(id);
    return res.changes > 0 ? student : null;
  },
  listStudents: () => listStudents.all()
};
