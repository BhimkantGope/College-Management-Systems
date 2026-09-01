// src/pages/teacher/Overview.jsx
import { useEffect, useState } from "react";
import { BookOpen, Users, CalendarDays } from "lucide-react";
import { api } from "../../api/client";
import { Card, StatCard } from "../../components/ui";
import Seal from "../../components/Seal";

export default function Overview({ onNavigate }) {
  const [courses, setCourses] = useState([]);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    api.get("/teacher/courses").then(setCourses);
    api.get("/teacher/timetable").then(setTimetable);
  }, []);

  const totalStudents = courses.reduce((sum, c) => sum + c.student_count, 0);
  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
  const todaysClasses = timetable.filter((t) => t.day_of_week === today);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Courses teaching" value={courses.length} icon={BookOpen} tone="gold" />
        <StatCard label="Total students" value={totalStudents} icon={Users} tone="sage" />
        <StatCard label="Classes today" value={todaysClasses.length} icon={CalendarDays} tone="ink" />
      </div>

      <Card className="p-6">
        <h3 className="font-display text-lg text-ink mb-4">Your courses</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => onNavigate("courses")}
              className="flex items-center gap-3 p-4 rounded-xl border border-ink/10 hover:border-gold hover:bg-gold/5 transition-colors text-left"
            >
              <Seal tone="gold" size="md">{c.code.replace(/[^A-Z]/g, "").slice(0, 2)}</Seal>
              <div className="min-w-0">
                <p className="text-ink font-medium truncate">{c.name}</p>
                <p className="text-xs text-slate">{c.student_count} students · {c.code}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {todaysClasses.length > 0 && (
        <Card className="p-6">
          <h3 className="font-display text-lg text-ink mb-4">Today's schedule</h3>
          <div className="space-y-2">
            {todaysClasses.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-ink/5 last:border-0">
                <div>
                  <p className="text-ink font-medium text-sm">{t.course_name}</p>
                  <p className="text-xs text-slate">{t.room}</p>
                </div>
                <p className="text-sm font-mono text-slate">{t.start_time}–{t.end_time}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
