// routes/admin.js
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate, authorize("admin"));

// ---- Overview stats ----
router.get("/stats", (req, res) => {
  const students = db.prepare("SELECT COUNT(*) c FROM students").get().c;
  const teachers = db.prepare("SELECT COUNT(*) c FROM teachers").get().c;
  const courses = db.prepare("SELECT COUNT(*) c FROM courses").get().c;
  const departments = db.prepare("SELECT COUNT(*) c FROM departments").get().c;
  const attendanceToday = db
    .prepare("SELECT COUNT(*) c FROM attendance WHERE date = date('now') AND status='present'")
    .get().c;
  res.json({ students, teachers, courses, departments, attendanceToday });
});

// ---- Departments ----
router.get("/departments", (req, res) => {
  res.json(db.prepare("SELECT * FROM departments ORDER BY name").all());
});
router.post("/departments", (req, res) => {
  const { name, code } = req.body;
  if (!name || !code) return res.status(400).json({ error: "name and code required" });
  const info = db.prepare("INSERT INTO departments (name, code) VALUES (?,?)").run(name, code.toUpperCase());
  res.status(201).json({ id: info.lastInsertRowid, name, code });
});

// ---- Teachers ----
router.get("/teachers", (req, res) => {
  const rows = db
    .prepare(
      `SELECT t.id, u.name, u.email, t.designation, t.employee_code, d.name as department
       FROM teachers t JOIN users u ON u.id = t.user_id
       LEFT JOIN departments d ON d.id = t.department_id
       ORDER BY u.name`
    )
    .all();
  res.json(rows);
});
router.post("/teachers", (req, res) => {
  const { name, email, password, departmentId, designation, employeeCode } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "name, email, password required" });
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return res.status(409).json({ error: "Email already in use" });
  const tx = db.transaction(() => {
    const uid = db
      .prepare("INSERT INTO users (name,email,password_hash,role,avatar_color) VALUES (?,?,?,?,?)")
      .run(name, email, bcrypt.hashSync(password, 10), "teacher", "#C9A227").lastInsertRowid;
    const tid = db
      .prepare("INSERT INTO teachers (user_id, department_id, designation, employee_code) VALUES (?,?,?,?)")
      .run(uid, departmentId || null, designation || "Assistant Professor", employeeCode || null).lastInsertRowid;
    return tid;
  });
  const id = tx();
  res.status(201).json({ id });
});
router.delete("/teachers/:id", (req, res) => {
  const t = db.prepare("SELECT user_id FROM teachers WHERE id = ?").get(req.params.id);
  if (!t) return res.status(404).json({ error: "Not found" });
  db.prepare("DELETE FROM users WHERE id = ?").run(t.user_id); // cascades
  res.json({ ok: true });
});

// ---- Students ----
router.get("/students", (req, res) => {
  const rows = db
    .prepare(
      `SELECT s.id, u.name, u.email, s.roll_no, s.semester, s.batch_year, d.name as department
       FROM students s JOIN users u ON u.id = s.user_id
       LEFT JOIN departments d ON d.id = s.department_id
       ORDER BY s.roll_no`
    )
    .all();
  res.json(rows);
});
router.post("/students", (req, res) => {
  const { name, email, password, departmentId, rollNo, semester, batchYear } = req.body;
  if (!name || !email || !password || !rollNo) return res.status(400).json({ error: "name, email, password, rollNo required" });
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return res.status(409).json({ error: "Email already in use" });
  const tx = db.transaction(() => {
    const uid = db
      .prepare("INSERT INTO users (name,email,password_hash,role,avatar_color) VALUES (?,?,?,?,?)")
      .run(name, email, bcrypt.hashSync(password, 10), "student", "#4C7A6B").lastInsertRowid;
    const sid = db
      .prepare("INSERT INTO students (user_id, department_id, roll_no, semester, batch_year) VALUES (?,?,?,?,?)")
      .run(uid, departmentId || null, rollNo, semester || 1, batchYear || new Date().getFullYear()).lastInsertRowid;
    return sid;
  });
  const id = tx();
  res.status(201).json({ id });
});
router.delete("/students/:id", (req, res) => {
  const s = db.prepare("SELECT user_id FROM students WHERE id = ?").get(req.params.id);
  if (!s) return res.status(404).json({ error: "Not found" });
  db.prepare("DELETE FROM users WHERE id = ?").run(s.user_id);
  res.json({ ok: true });
});

// ---- Courses ----
router.get("/courses", (req, res) => {
  const rows = db
    .prepare(
      `SELECT c.id, c.name, c.code, c.credits, c.semester, d.name as department,
              u.name as teacher_name, t.id as teacher_id
       FROM courses c
       LEFT JOIN departments d ON d.id = c.department_id
       LEFT JOIN teachers t ON t.id = c.teacher_id
       LEFT JOIN users u ON u.id = t.user_id
       ORDER BY c.code`
    )
    .all();
  res.json(rows);
});
router.post("/courses", (req, res) => {
  const { name, code, departmentId, teacherId, credits, semester } = req.body;
  if (!name || !code) return res.status(400).json({ error: "name and code required" });
  const info = db
    .prepare("INSERT INTO courses (name, code, department_id, teacher_id, credits, semester) VALUES (?,?,?,?,?,?)")
    .run(name, code, departmentId || null, teacherId || null, credits || 3, semester || 1);
  res.status(201).json({ id: info.lastInsertRowid });
});
router.delete("/courses/:id", (req, res) => {
  db.prepare("DELETE FROM courses WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// ---- Announcements ----
router.get("/announcements", (req, res) => {
  res.json(db.prepare("SELECT * FROM announcements ORDER BY created_at DESC").all());
});
router.post("/announcements", (req, res) => {
  const { title, content, targetRole } = req.body;
  if (!title || !content) return res.status(400).json({ error: "title and content required" });
  const info = db
    .prepare("INSERT INTO announcements (title, content, posted_by, target_role) VALUES (?,?,?,?)")
    .run(title, content, req.user.id, targetRole || "all");
  res.status(201).json({ id: info.lastInsertRowid });
});

module.exports = router;
