// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@college.edu", password: "admin123" },
  { role: "Teacher", email: "anjali.mehta@college.edu", password: "teacher123" },
  { role: "Student", email: "aarav.sharma@college.edu", password: "student123" },
];

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(acc) {
    setEmail(acc.email);
    setPassword(acc.password);
    setError("");
  }

  return (
    <div className="min-h-screen bg-ink flex">
      {/* Left: brand panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #C9A227 0, transparent 45%), radial-gradient(circle at 80% 80%, #4C7A6B 0, transparent 45%)",
          }}
        />
        <div className="relative flex items-center gap-3">
          <svg viewBox="0 0 64 64" className="w-10 h-10">
            <circle cx="32" cy="32" r="30" fill="#1B2340" stroke="#C9A227" strokeWidth="1.5" />
            <path d="M32 16 L46 23 L32 30 L18 23 Z" fill="#C9A227" />
            <path d="M22 26 V36 Q32 42 42 36 V26" fill="none" stroke="#FAF7F0" strokeWidth="2" />
          </svg>
          <span className="text-parchment font-display text-xl">Aetheria College</span>
        </div>

        <div className="relative">
          <p className="text-gold text-sm uppercase tracking-[0.2em] mb-4">Campus Portal</p>
          <h1 className="font-display text-5xl text-parchment leading-[1.1] mb-6">
            One record,<br />every classroom.
          </h1>
          <p className="text-white/60 max-w-md leading-relaxed">
            Attendance, grades, timetables and announcements — kept in one place for every
            department, faculty member, and student on campus.
          </p>
        </div>

        <div className="relative flex gap-8 text-white/40 text-xs uppercase tracking-wider">
          <span>Departments</span>
          <span>Faculty</span>
          <span>Students</span>
          <span>Records</span>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-parchment">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <svg viewBox="0 0 64 64" className="w-9 h-9">
              <circle cx="32" cy="32" r="30" fill="#1B2340" stroke="#C9A227" strokeWidth="1.5" />
              <path d="M32 16 L46 23 L32 30 L18 23 Z" fill="#C9A227" />
              <path d="M22 26 V36 Q32 42 42 36 V26" fill="none" stroke="#FAF7F0" strokeWidth="2" />
            </svg>
            <span className="font-display text-lg text-ink">Aetheria College</span>
          </div>

          <h2 className="font-display text-2xl text-ink mb-1">Welcome back</h2>
          <p className="text-sm text-slate mb-8">Sign in with your college email to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full px-3 py-2.5 rounded-lg border border-ink/15 bg-white text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg border border-ink/15 bg-white text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              />
            </div>

            {error && (
              <p className="text-sm text-clay-dark bg-clay/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-ink text-parchment text-sm font-medium hover:bg-ink-light transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-ink/10">
            <p className="text-xs uppercase tracking-wide text-slate-light mb-3">Try a demo account</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => fillDemo(acc)}
                  className="text-xs px-2 py-2 rounded-lg border border-ink/10 hover:border-gold hover:text-gold-dark transition-colors text-slate"
                >
                  {acc.role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
