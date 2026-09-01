// seed.js — populates the database with realistic demo data
const bcrypt = require("bcryptjs");
const db = require("./db");

const hash = (pw) => bcrypt.hashSync(pw, 10);

const already = db.prepare("SELECT COUNT(*) c FROM users").get().c;
if (already > 0) {
  console.log("Database already seeded. Delete college.db to reseed.");
  process.exit(0);
}

const insertUser = db.prepare(
  `INSERT INTO users (name, email, password_hash, role, avatar_color) VALUES (?,?,?,?,?)`
);
const insertDept = db.prepare(`INSERT INTO departments (name, code) VALUES (?,?)`);
const insertTeacher = db.prepare(
  `INSERT INTO teachers (user_id, department_id, designation, employee_code) VALUES (?,?,?,?)`
);
const insertStudent = db.prepare(
  `INSERT INTO students (user_id, department_id, roll_no, semester, batch_year) VALUES (?,?,?,?,?)`
);
const insertCourse = db.prepare(
  `INSERT INTO courses (name, code, department_id, teacher_id, credits, semester) VALUES (?,?,?,?,?,?)`
);
const insertEnroll = db.prepare(
  `INSERT INTO enrollments (student_id, course_id) VALUES (?,?)`
);
const insertAttendance = db.prepare(
  `INSERT INTO attendance (course_id, student_id, date, status, marked_by) VALUES (?,?,?,?,?)`
);
const insertGrade = db.prepare(
  `INSERT INTO grades (course_id, student_id, exam_type, marks, max_marks, graded_by) VALUES (?,?,?,?,?,?)`
);
const insertTT = db.prepare(
  `INSERT INTO timetable (course_id, day_of_week, start_time, end_time, room) VALUES (?,?,?,?,?)`
);
const insertAnn = db.prepare(
  `INSERT INTO announcements (title, content, posted_by, target_role) VALUES (?,?,?,?)`
);

const tx = db.transaction(() => {
  // Departments
  const deptCS = insertDept.run("Computer Science", "CS").lastInsertRowid;
  const deptEC = insertDept.run("Electronics & Communication", "EC").lastInsertRowid;
  const deptME = insertDept.run("Mechanical Engineering", "ME").lastInsertRowid;

  // Admin
  const adminUser = insertUser.run(
    "Dr. Rakesh Sharma",
    "admin@college.edu",
    hash("admin123"),
    "admin",
    "#1B2340"
  ).lastInsertRowid;

  // Teachers
  const teacherDefs = [
    ["Prof. Anjali Mehta", "anjali.mehta@college.edu", deptCS, "Associate Professor", "EMP-101"],
    ["Prof. Vikram Rao", "vikram.rao@college.edu", deptCS, "Assistant Professor", "EMP-102"],
    ["Prof. Sunita Iyer", "sunita.iyer@college.edu", deptEC, "Professor", "EMP-103"],
  ];
  const teacherIds = teacherDefs.map(([name, email, dept, desig, code]) => {
    const uid = insertUser.run(name, email, hash("teacher123"), "teacher", "#C9A227").lastInsertRowid;
    return insertTeacher.run(uid, dept, desig, code).lastInsertRowid;
  });

  // Courses
  const courseDefs = [
    ["Data Structures & Algorithms", "CS201", deptCS, teacherIds[0], 4, 3],
    ["Database Management Systems", "CS301", deptCS, teacherIds[0], 4, 3],
    ["Operating Systems", "CS302", deptCS, teacherIds[1], 3, 3],
    ["Web Technologies", "CS303", deptCS, teacherIds[1], 3, 3],
    ["Digital Signal Processing", "EC301", deptEC, teacherIds[2], 4, 3],
  ];
  const courseIds = courseDefs.map((c) => insertCourse.run(...c).lastInsertRowid);

  // Timetable
  insertTT.run(courseIds[0], "Mon", "09:00", "10:00", "CS-101");
  insertTT.run(courseIds[0], "Wed", "09:00", "10:00", "CS-101");
  insertTT.run(courseIds[1], "Mon", "10:15", "11:15", "CS-102");
  insertTT.run(courseIds[1], "Thu", "10:15", "11:15", "CS-102");
  insertTT.run(courseIds[2], "Tue", "11:30", "12:30", "CS-103");
  insertTT.run(courseIds[3], "Fri", "09:00", "10:00", "CS-Lab-1");
  insertTT.run(courseIds[4], "Tue", "09:00", "10:00", "EC-201");

  // Students
  const studentDefs = [
    ["Aarav Sharma", "aarav.sharma@college.edu", "CS21001", 3, 2023],
    ["Isha Patel", "isha.patel@college.edu", "CS21002", 3, 2023],
    ["Rohan Gupta", "rohan.gupta@college.edu", "CS21003", 3, 2023],
    ["Diya Verma", "diya.verma@college.edu", "CS21004", 3, 2023],
    ["Kabir Singh", "kabir.singh@college.edu", "CS21005", 3, 2023],
    ["Meera Nair", "meera.nair@college.edu", "CS21006", 3, 2023],
  ];
  const studentIds = studentDefs.map(([name, email, roll, sem, batch]) => {
    const uid = insertUser.run(name, email, hash("student123"), "student", "#4C7A6B").lastInsertRowid;
    return insertStudent.run(uid, deptCS, roll, sem, batch).lastInsertRowid;
  });

  // Enroll every student into first 4 CS courses
  studentIds.forEach((sid) => {
    [0, 1, 2, 3].forEach((ci) => insertEnroll.run(sid, courseIds[ci]));
  });

  // Attendance for the last 10 days on course 0 and 1
  const today = new Date();
  for (let d = 9; d >= 0; d--) {
    const dt = new Date(today);
    dt.setDate(dt.getDate() - d);
    const iso = dt.toISOString().slice(0, 10);
    studentIds.forEach((sid, idx) => {
      const status = Math.random() > 0.15 ? "present" : idx % 3 === 0 ? "late" : "absent";
      insertAttendance.run(courseIds[0], sid, iso, status, teacherIds[0]);
      insertAttendance.run(courseIds[1], sid, iso, Math.random() > 0.2 ? "present" : "absent", teacherIds[0]);
    });
  }

  // Grades
  studentIds.forEach((sid) => {
    [0, 1, 2, 3].forEach((ci) => {
      const teacherFor = ci < 2 ? teacherIds[0] : teacherIds[1];
      insertGrade.run(courseIds[ci], sid, "Midterm", Math.round(50 + Math.random() * 45), 100, teacherFor);
      insertGrade.run(courseIds[ci], sid, "Assignment", Math.round(60 + Math.random() * 40), 100, teacherFor);
    });
  });

  // Announcements
  insertAnn.run(
    "Mid-Semester Exams Schedule Released",
    "Mid-semester examinations will begin from the 15th of next month. Check the timetable section for your slot.",
    adminUser,
    "student"
  );
  insertAnn.run(
    "Faculty Meeting - Friday 4 PM",
    "All department faculty are requested to attend the curriculum review meeting in the seminar hall.",
    adminUser,
    "teacher"
  );
  insertAnn.run(
    "College Annual Fest - Registrations Open",
    "Registrations for the annual cultural and technical fest are now open. Visit the student council office to register.",
    adminUser,
    "all"
  );
});

tx();

console.log("✅ Database seeded successfully!");
console.log("\nDemo Logins:");
console.log("  Admin:   admin@college.edu / admin123");
console.log("  Teacher: anjali.mehta@college.edu / teacher123");
console.log("  Student: aarav.sharma@college.edu / student123");
