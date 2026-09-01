// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { JWT_SECRET, authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase().trim());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Attach role-specific profile id
  let profile = null;
  if (user.role === "teacher") {
    profile = db.prepare("SELECT * FROM teachers WHERE user_id = ?").get(user.id);
  } else if (user.role === "student") {
    profile = db.prepare("SELECT * FROM students WHERE user_id = ?").get(user.id);
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name, profileId: profile ? profile.id : null },
    JWT_SECRET,
    { expiresIn: "12h" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarColor: user.avatar_color,
      profileId: profile ? profile.id : null,
    },
  });
});

router.get("/me", authenticate, (req, res) => {
  const user = db.prepare("SELECT id, name, email, role, avatar_color FROM users WHERE id = ?").get(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user });
});

module.exports = router;
