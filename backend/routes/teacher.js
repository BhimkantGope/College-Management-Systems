// routes/teacher.js
const express = require("express");
const db = require("../db");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate, authorize("teacher"));

function myTeacherId(req) {
  return req.user.profileId;
}

// ---- My courses ----
router.get("/courses", (req, res) => {
  const rows = db
    .prepare(
      `SELECT c.id, c.name, c.code, c.credits, c.semester, d.name as department,
              (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as student_count
       FROM courses c LEFT JOIN departments d ON d.id = c.department_id
       WHERE c.teacher_id = ? ORDER BY c.code`
    )
    .all(myTeacherId(req));
  res.json(rows);
});

// ---- Students enrolled in one of my courses ----
router.get("/courses/:courseId/students", (req, res) => {
  const course = db.prepare("SELECT * FROM courses WHERE id = ? AND teacher_id = ?").get(req.params.courseId, myTeacherId(req));
  if (!course) return res.status(404).json({ error: "Course not found or not yours" });
  const rows = db
    .prepare(
      `SELECT s.id, u.name, s.roll_no
       FROM enrollments e JOIN students s ON s.id = e.student_id
       JOIN users u ON u.id = s.user_id
       WHERE e.course_id = ? ORDER BY s.roll_no`
    )
    .all(req.params.courseId);
  res.json(rows);
});

// ---- Attendance ----
router.get("/courses/:courseId/attendance", (req, res) => {
  const { date } = req.query;
  const course = db.prepare("SELECT * FROM courses WHERE id = ? AND teacher_id = ?").get(req.params.courseId, myTeacherId(req));
  if (!course) return res.status(404).json({ error: "Course not found or not yours" });

  let sql = `SELECT a.*, u.name, s.roll_no FROM attendance a
             JOIN students s ON s.id = a.student_id JOIN users u ON u.id = s.user_id
             WHERE a.course_id = ?`;
  const params = [req.params.courseId];
  if (date) { sql += " AND a.date = ?"; params.push(date); }
  sql += " ORDER BY a.date DESC, s.roll_no";
  res.json(db.prepare(sql).all(...params));
});

router.post("/courses/:courseId/attendance", (req, res) => {
  const { date, records } = req.body; // records: [{studentId, status}]
  const course = db.prepare("SELECT * FROM courses WHERE id = ? AND teacher_id = ?").get(req.params.courseId, myTeacherId(req));
  if (!course) return res.status(404).json({ error: "Course not found or not yours" });
  if (!date || !Array.isArray(records)) return res.status(400).json({ error: "date and records[] required" });

  const upsert = db.prepare(
    `INSERT INTO attendance (course_id, student_id, date, status, marked_by)
     VALUES (?,?,?,?,?)
     ON CONFLICT(course_id, student_id, date) DO UPDATE SET status = excluded.status, marked_by = excluded.marked_by`
  );
  const tx = db.transaction((recs) => {
    for (const r of recs) upsert.run(req.params.courseId, r.studentId, date, r.status, myTeacherId(req));
  });
  tx(records);
  res.json({ ok: true, saved: records.length });
});

// ---- Grades ----
router.get("/courses/:courseId/grades", (req, res) => {
  const course = db.prepare("SELECT * FROM courses WHERE id = ? AND teacher_id = ?").get(req.params.courseId, myTeacherId(req));
  if (!course) return res.status(404).json({ error: "Course not found or not yours" });
  const rows = db
    .prepare(
      `SELECT g.*, u.name, s.roll_no FROM grades g
       JOIN students s ON s.id = g.student_id JOIN users u ON u.id = s.user_id
       WHERE g.course_id = ? ORDER BY s.roll_no, g.created_at DESC`
    )
    .all(req.params.courseId);
  res.json(rows);
});

router.post("/courses/:courseId/grades", (req, res) => {
  const { studentId, examType, marks, maxMarks } = req.body;
  const course = db.prepare("SELECT * FROM courses WHERE id = ? AND teacher_id = ?").get(req.params.courseId, myTeacherId(req));
  if (!course) return res.status(404).json({ error: "Course not found or not yours" });
  if (!studentId || !examType || marks == null) return res.status(400).json({ error: "studentId, examType, marks required" });

  const info = db
    .prepare("INSERT INTO grades (course_id, student_id, exam_type, marks, max_marks, graded_by) VALUES (?,?,?,?,?,?)")
    .run(req.params.courseId, studentId, examType, marks, maxMarks || 100, myTeacherId(req));
  res.status(201).json({ id: info.lastInsertRowid });
});

// ---- My timetable ----
router.get("/timetable", (req, res) => {
  const rows = db
    .prepare(
      `SELECT t.*, c.name as course_name, c.code FROM timetable t
       JOIN courses c ON c.id = t.course_id WHERE c.teacher_id = ?
       ORDER BY CASE day_of_week WHEN 'Mon' THEN 1 WHEN 'Tue' THEN 2 WHEN 'Wed' THEN 3
       WHEN 'Thu' THEN 4 WHEN 'Fri' THEN 5 WHEN 'Sat' THEN 6 END, t.start_time`
    )
    .all(myTeacherId(req));
  res.json(rows);
});

// ---- Announcements visible to teacher ----
router.get("/announcements", (req, res) => {
  res.json(
    db.prepare("SELECT * FROM announcements WHERE target_role IN ('all','teacher') ORDER BY created_at DESC").all()
  );
});

module.exports = router;
