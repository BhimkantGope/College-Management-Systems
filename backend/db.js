// db.js — SQLite database connection + schema definition
// Uses Node's built-in `node:sqlite` module (stable in Node 22.5+, no native
// build step required — no python/build-tools headaches for anyone cloning
// this project).
const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const DB_PATH = path.join(__dirname, "college.db");
const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

// Small transaction helper to mirror the better-sqlite3 ergonomics used
// throughout the route handlers: db.transaction(fn)(args)
db.transaction = function (fn) {
  return function (...args) {
    db.exec("BEGIN");
    try {
      const result = fn(...args);
      db.exec("COMMIT");
      return result;
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
  };
};

// ---------------------------------------------------------------------
// SCHEMA
// ---------------------------------------------------------------------
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK(role IN ('admin','teacher','student')),
  avatar_color  TEXT DEFAULT '#C9A227',
  created_at    TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS departments (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL UNIQUE,
  code  TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS teachers (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  department_id  INTEGER REFERENCES departments(id),
  designation    TEXT DEFAULT 'Assistant Professor',
  employee_code  TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS students (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  department_id  INTEGER REFERENCES departments(id),
  roll_no        TEXT UNIQUE,
  semester       INTEGER DEFAULT 1,
  batch_year     INTEGER
);

CREATE TABLE IF NOT EXISTS courses (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  name           TEXT NOT NULL,
  code           TEXT NOT NULL UNIQUE,
  department_id  INTEGER REFERENCES departments(id),
  teacher_id     INTEGER REFERENCES teachers(id),
  credits        INTEGER DEFAULT 3,
  semester       INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS enrollments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id  INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id   INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE(student_id, course_id)
);

CREATE TABLE IF NOT EXISTS attendance (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id   INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id  INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date        TEXT NOT NULL,
  status      TEXT NOT NULL CHECK(status IN ('present','absent','late')),
  marked_by   INTEGER REFERENCES teachers(id),
  UNIQUE(course_id, student_id, date)
);

CREATE TABLE IF NOT EXISTS grades (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id   INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id  INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_type   TEXT NOT NULL,
  marks       REAL NOT NULL,
  max_marks   REAL NOT NULL DEFAULT 100,
  graded_by   INTEGER REFERENCES teachers(id),
  created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS timetable (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id    INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  day_of_week  TEXT NOT NULL CHECK(day_of_week IN ('Mon','Tue','Wed','Thu','Fri','Sat')),
  start_time   TEXT NOT NULL,
  end_time     TEXT NOT NULL,
  room         TEXT
);

CREATE TABLE IF NOT EXISTS announcements (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  posted_by   INTEGER REFERENCES users(id),
  target_role TEXT NOT NULL DEFAULT 'all' CHECK(target_role IN ('all','teacher','student')),
  created_at  TEXT DEFAULT (datetime('now'))
);
`);

module.exports = db;
