// server.js — CMS API entrypoint
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const teacherRoutes = require("./routes/teacher");
const studentRoutes = require("./routes/student");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ ok: true, service: "cms-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✅ College Management System API running at http://localhost:${PORT}`);
});
