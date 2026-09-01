// src/pages/admin/Overview.jsx
import { useEffect, useState } from "react";
import { GraduationCap, Users, BookOpen, Building2, CalendarCheck } from "lucide-react";
import { api } from "../../api/client";
import { Card, StatCard } from "../../components/ui";
import Seal from "../../components/Seal";

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/admin/stats"), api.get("/admin/courses")])
      .then(([s, c]) => {
        setStats(s);
        setCourses(c);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-clay-dark">{error}</p>;
  if (!stats) return <p className="text-slate">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Students" value={stats.students} icon={GraduationCap} tone="sage" />
        <StatCard label="Faculty" value={stats.teachers} icon={Users} tone="gold" />
        <StatCard label="Courses" value={stats.courses} icon={BookOpen} tone="ink" />
        <StatCard label="Departments" value={stats.departments} icon={Building2} tone="ink" />
        <StatCard label="Present Today" value={stats.attendanceToday} icon={CalendarCheck} tone="sage" />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-ink">Courses at a glance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-light border-b border-ink/10">
                <th className="pb-3 font-medium">Course</th>
                <th className="pb-3 font-medium">Code</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium">Faculty</th>
                <th className="pb-3 font-medium">Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {courses.map((c) => (
                <tr key={c.id}>
                  <td className="py-3 text-ink font-medium">{c.name}</td>
                  <td className="py-3">
                    <Seal tone="gold" size="sm">{c.code.slice(0, 2)}</Seal>
                    <span className="ml-2 font-mono text-xs text-slate">{c.code}</span>
                  </td>
                  <td className="py-3 text-slate">{c.department || "—"}</td>
                  <td className="py-3 text-slate">{c.teacher_name || "Unassigned"}</td>
                  <td className="py-3 text-slate">{c.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
