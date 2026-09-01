// routes/student.js
const express = require("express");
const db = require("../db");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate, authorize("student"));

function myStudentId(req) {
  return req.user.profileId;
}

router.get("/courses", (req, res) => {
  const rows = db
    .prepare(
      `SELECT c.id, c.name, c.code, c.credits, c.semester, u.name as teacher_name
       FROM enrollments e JOIN courses c ON c.id = e.course_id
       LEFT JOIN teachers t ON t.id = c.teacher_id LEFT JOIN users u ON u.id = t.user_id
       WHERE e.student_id = ? ORDER BY c.code`
    )
    .all(myStudentId(req));
  res.json(rows);
});

router.get("/attendance", (req, res) => {
  const rows = db
    .prepare(
      `SELECT a.date, a.status, c.name as course_name, c.code
       FROM attendance a JOIN courses c ON c.id = a.course_id
       WHERE a.student_id = ? ORDER BY a.date DESC`
    )
    .all(myStudentId(req));

  // Summary per course
  const summary = db
    .prepare(
      `SELECT c.id as course_id, c.name, c.code,
              SUM(CASE WHEN a.status='present' THEN 1 ELSE 0 END) as present,
              SUM(CASE WHEN a.status='late' THEN 1 ELSE 0 END) as late,
              SUM(CASE WHEN a.status='absent' THEN 1 ELSE 0 END) as absent,
              COUNT(*) as total
       FROM attendance a JOIN courses c ON c.id = a.course_id
       WHERE a.student_id = ? GROUP BY c.id`
    )
    .all(myStudentId(req));

  res.json({ records: rows, summary });
});

router.get("/grades", (req, res) => {
  const rows = db
    .prepare(
      `SELECT g.exam_type, g.marks, g.max_marks, g.created_at, c.name as course_name, c.code
       FROM grades g JOIN courses c ON c.id = g.course_id
       WHERE g.student_id = ? ORDER BY g.created_at DESC`
    )
    .all(myStudentId(req));
  res.json(rows);
});

router.get("/timetable", (req, res) => {
  const rows = db
    .prepare(
      `SELECT t.*, c.name as course_name, c.code FROM timetable t
       JOIN courses c ON c.id = t.course_id
       JOIN enrollments e ON e.course_id = c.id
       WHERE e.student_id = ?
       ORDER BY CASE day_of_week WHEN 'Mon' THEN 1 WHEN 'Tue' THEN 2 WHEN 'Wed' THEN 3
       WHEN 'Thu' THEN 4 WHEN 'Fri' THEN 5 WHEN 'Sat' THEN 6 END, t.start_time`
    )
    .all(myStudentId(req));
  res.json(rows);
});

router.get("/announcements", (req, res) => {
  res.json(
    db.prepare("SELECT * FROM announcements WHERE target_role IN ('all','student') ORDER BY created_at DESC").all()
  );
});

module.exports = router;
