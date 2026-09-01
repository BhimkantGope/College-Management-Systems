# Aetheria — College Management System

A full-stack College Management System with a SQLite-backed API and a
role-based React frontend. Three dashboards — **Admin**, **Faculty**, and
**Student** — each built around what that role actually needs day-to-day,
not one dashboard with permissions bolted on.

```
cms/
├── backend/     Node.js + Express API, SQLite database (node:sqlite, no native build step)
└── frontend/    React + Vite + Tailwind, role-based dashboards
```

## What's included

**Database (SQLite):** departments, teachers, students, courses,
enrollments, attendance, grades, timetable, announcements — with foreign
keys and unique constraints (e.g. one attendance entry per student per
course per day).

**Backend API:** JWT authentication, bcrypt password hashing, and three
role-scoped route groups (`/api/admin`, `/api/teacher`, `/api/student`) so a
student's token can never reach a teacher's endpoints, and vice versa.

**Frontend:**
- **Admin dashboard** — manage departments, faculty, students, courses, and
  post announcements. Live stats overview.
- **Faculty dashboard** — see assigned courses, take daily attendance
  (present/late/absent), record grades per assessment, view weekly
  timetable.
- **Student dashboard** — enrolled courses, attendance breakdown per
  course with history, grades grouped by course, weekly timetable,
  announcements.

## Requirements

- **Node.js 22.5 or newer** (the backend uses Node's built-in `node:sqlite`
  module, so there's nothing to compile — no Python, no build tools, no
  `node-gyp` errors, works the same on Windows/Mac/Linux).

Check your version with `node -v`. If you're on an older version, install
the latest LTS from [nodejs.org](https://nodejs.org).

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env      # optional: edit JWT_SECRET for real deployments
npm run seed               # creates college.db and fills it with demo data
npm start                  # runs on http://localhost:4000
```

You should see:
```
✅ College Management System API running at http://localhost:4000
```

Demo accounts created by the seed script:

| Role    | Email                        | Password    |
|---------|-------------------------------|-------------|
| Admin   | admin@college.edu             | admin123    |
| Faculty | anjali.mehta@college.edu      | teacher123  |
| Student | aarav.sharma@college.edu      | student123  |

To start over with a clean database, delete `backend/college.db` and run
`npm run seed` again.

## 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env       # points the frontend at the backend API
npm run dev                 # runs on http://localhost:5173
```

Open the printed URL, sign in with one of the demo accounts (or use the
one-click demo buttons on the login screen), and you'll land in the
matching dashboard.

## How the pieces fit together

- Every login returns a JWT carrying the user's **role** and, for
  teachers/students, their **profile id** (their row in the `teachers` or
  `students` table). Every subsequent request sends that token in the
  `Authorization: Bearer …` header.
- Each route file (`routes/admin.js`, `routes/teacher.js`,
  `routes/student.js`) is wrapped in `authenticate` + `authorize(role)`
  middleware, so the API itself enforces who can see what — not just the
  UI.
- The frontend has no shared "God dashboard" component; `AdminDashboard`,
  `TeacherDashboard`, and `StudentDashboard` are separate trees under
  `src/pages/`, each with their own navigation and views, sharing only the
  visual shell (`DashboardShell`) and UI primitives (`components/ui.jsx`).

## Extending it

Some natural next steps if you want to keep building on this:
- Add a "class teacher" / homeroom concept for attendance oversight across
  a whole batch.
- Add file uploads (assignment submissions) — the `pdf` handling patterns
  in this environment's skills can help if you're doing that inside Claude.
- Swap the JWT secret and put the backend behind HTTPS before deploying
  anywhere outside your own machine — as shipped, this is a local
  development setup, not a hardened production deployment.
- Add password reset / email verification flows before using this with
  real student data.

## Design notes

The visual identity leans into the "college" part of college management
system — a navy-and-parchment palette with a gold accent, a serif display
face (Fraunces) paired with Inter for UI text, and a recurring circular
**seal** motif (in the sidebar logo, and as status/initial badges
throughout) instead of generic dashboard iconography.
