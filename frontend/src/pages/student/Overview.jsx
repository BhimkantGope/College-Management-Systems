// src/pages/student/Overview.jsx
import { useEffect, useState } from "react";
import { BookOpen, CalendarCheck, GraduationCap } from "lucide-react";
import { api } from "../../api/client";
import { Card, StatCard, Pill } from "../../components/ui";
import Seal from "../../components/Seal";

export default function Overview({ onNavigate }) {
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState({ summary: [] });
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    api.get("/student/courses").then(setCourses);
    api.get("/student/attendance").then(setAttendance);
    api.get("/student/grades").then(setGrades);
  }, []);

  const totalPresent = attendance.summary.reduce((s, c) => s + c.present + c.late, 0);
  const totalClasses = attendance.summary.reduce((s, c) => s + c.total, 0);
  const overallPct = totalClasses ? Math.round((totalPresent / totalClasses) * 100) : 0;
  const avgScore = grades.length
    ? Math.round(grades.reduce((s, g) => s + (g.marks / g.max_marks) * 100, 0) / grades.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Enrolled courses" value={courses.length} icon={BookOpen} tone="sage" />
        <StatCard label="Overall attendance" value={`${overallPct}%`} icon={CalendarCheck} tone={overallPct >= 75 ? "sage" : "clay"} />
        <StatCard label="Average score" value={`${avgScore}%`} icon={GraduationCap} tone="gold" />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-ink">Attendance by course</h3>
          <button onClick={() => onNavigate("attendance")} className="text-xs text-sage-dark font-medium hover:underline">
            View details
          </button>
        </div>
        <div className="space-y-4">
          {attendance.summary.map((c) => {
            const pct = c.total ? Math.round(((c.present + c.late) / c.total) * 100) : 0;
            return (
              <div key={c.course_id}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-ink font-medium">{c.name}</span>
                  <span className={`font-mono text-xs ${pct >= 75 ? "text-sage-dark" : "text-clay-dark"}`}>{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-ink/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct >= 75 ? "bg-sage" : "bg-clay"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
          {attendance.summary.length === 0 && <p className="text-sm text-slate">No attendance recorded yet.</p>}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-display text-lg text-ink mb-4">Enrolled courses</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {courses.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-4 rounded-xl border border-ink/10">
              <Seal tone="sage" size="md">{c.code.replace(/[^A-Z]/g, "").slice(0, 2)}</Seal>
              <div className="min-w-0">
                <p className="text-ink font-medium truncate">{c.name}</p>
                <p className="text-xs text-slate">{c.teacher_name || "TBA"}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
