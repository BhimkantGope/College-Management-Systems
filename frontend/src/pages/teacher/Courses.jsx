// src/pages/teacher/Courses.jsx
import { useEffect, useState } from "react";
import { ChevronLeft, Check, X as XIcon, Clock, Plus } from "lucide-react";
import { api } from "../../api/client";
import { Card, Button, Input, Select, Pill, EmptyState } from "../../components/ui";
import Seal from "../../components/Seal";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/teacher/courses").then(setCourses);
  }, []);

  if (selected) {
    return <CourseDetail course={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((c) => (
        <button
          key={c.id}
          onClick={() => setSelected(c)}
          className="text-left bg-white rounded-2xl shadow-card border border-ink/5 p-5 hover:border-gold transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <Seal tone="gold" size="md">{c.code.replace(/[^A-Z]/g, "").slice(0, 2)}</Seal>
            <span className="text-xs font-mono text-slate">{c.code}</span>
          </div>
          <p className="text-ink font-display text-lg mb-1">{c.name}</p>
          <p className="text-xs text-slate">{c.student_count} students enrolled · {c.credits} credits</p>
        </button>
      ))}
      {courses.length === 0 && <EmptyState title="No courses assigned" subtitle="Ask your administrator to assign you a course." />}
    </div>
  );
}

const STATUS_TONE = { present: "sage", late: "gold", absent: "clay" };
const STATUS_ICON = { present: Check, late: Clock, absent: XIcon };

function CourseDetail({ course, onBack }) {
  const [tab, setTab] = useState("attendance");

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate hover:text-ink transition-colors">
        <ChevronLeft size={16} /> Back to courses
      </button>

      <div className="flex items-center gap-3">
        <Seal tone="gold" size="lg">{course.code.replace(/[^A-Z]/g, "").slice(0, 2)}</Seal>
        <div>
          <h2 className="font-display text-xl text-ink">{course.name}</h2>
          <p className="text-sm text-slate font-mono">{course.code} · {course.student_count} students</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-ink/10">
        {[
          ["attendance", "Attendance"],
          ["grades", "Grades"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === key ? "border-gold text-ink" : "border-transparent text-slate hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "attendance" && <AttendanceTab courseId={course.id} />}
      {tab === "grades" && <GradesTab courseId={course.id} />}
    </div>
  );
}

function AttendanceTab({ courseId }) {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [statuses, setStatuses] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get(`/teacher/courses/${courseId}/students`).then((rows) => {
      setStudents(rows);
      setStatuses(Object.fromEntries(rows.map((s) => [s.id, "present"])));
    });
  }, [courseId]);

  useEffect(() => {
    api.get(`/teacher/courses/${courseId}/attendance?date=${date}`).then((records) => {
      if (records.length) {
        setStatuses((prev) => {
          const next = { ...prev };
          records.forEach((r) => { next[r.student_id] = r.status; });
          return next;
        });
      }
    });
  }, [courseId, date]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const records = students.map((s) => ({ studentId: s.id, status: statuses[s.id] || "present" }));
    await api.post(`/teacher/courses/${courseId}/attendance`, { date, records });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto" />
        <Button onClick={handleSave} disabled={saving || students.length === 0} variant="gold">
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save attendance"}
        </Button>
      </div>

      <div className="space-y-1">
        {students.map((s) => {
          const status = statuses[s.id] || "present";
          return (
            <div key={s.id} className="flex items-center justify-between py-2.5 border-b border-ink/5 last:border-0">
              <div className="flex items-center gap-3">
                <Seal tone="sage" size="sm">{s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</Seal>
                <div>
                  <p className="text-sm text-ink font-medium">{s.name}</p>
                  <p className="text-xs font-mono text-slate">{s.roll_no}</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {["present", "late", "absent"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setStatuses({ ...statuses, [s.id]: opt })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                      status === opt
                        ? opt === "present"
                          ? "bg-sage text-parchment"
                          : opt === "late"
                          ? "bg-gold text-ink"
                          : "bg-clay text-parchment"
                        : "bg-ink/5 text-slate hover:bg-ink/10"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        {students.length === 0 && <p className="text-sm text-slate py-6 text-center">No students enrolled yet.</p>}
      </div>
    </Card>
  );
}

function GradesTab({ courseId }) {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [form, setForm] = useState({ studentId: "", examType: "Quiz", marks: "", maxMarks: 100 });
  const [saving, setSaving] = useState(false);

  function load() {
    api.get(`/teacher/courses/${courseId}/students`).then(setStudents);
    api.get(`/teacher/courses/${courseId}/grades`).then(setGrades);
  }
  useEffect(load, [courseId]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.studentId) return;
    setSaving(true);
    try {
      await api.post(`/teacher/courses/${courseId}/grades`, form);
      setForm({ ...form, studentId: "", marks: "" });
      load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-5 gap-5">
      <Card className="p-5 lg:col-span-2 h-fit">
        <h4 className="font-display text-base text-ink mb-4 flex items-center gap-2"><Plus size={16} /> Record a grade</h4>
        <form onSubmit={handleAdd} className="space-y-3">
          <Select label="Student" required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
            <option value="">Select student</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>)}
          </Select>
          <Select label="Assessment" value={form.examType} onChange={(e) => setForm({ ...form, examType: e.target.value })}>
            {["Quiz", "Assignment", "Midterm", "Final Exam", "Project"].map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Marks obtained" type="number" required value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} />
            <Input label="Out of" type="number" value={form.maxMarks} onChange={(e) => setForm({ ...form, maxMarks: e.target.value })} />
          </div>
          <Button type="submit" disabled={saving} className="w-full">{saving ? "Saving…" : "Add grade"}</Button>
        </form>
      </Card>

      <Card className="p-5 lg:col-span-3">
        <h4 className="font-display text-base text-ink mb-4">Recorded grades</h4>
        <div className="overflow-x-auto max-h-[420px] overflow-y-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-light border-b border-ink/10">
                <th className="pb-2 font-medium">Student</th>
                <th className="pb-2 font-medium">Assessment</th>
                <th className="pb-2 font-medium">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {grades.map((g) => {
                const pct = Math.round((g.marks / g.max_marks) * 100);
                const tone = pct >= 75 ? "sage" : pct >= 40 ? "gold" : "clay";
                return (
                  <tr key={g.id}>
                    <td className="py-2.5">
                      <p className="text-ink text-sm">{g.name}</p>
                      <p className="text-xs font-mono text-slate">{g.roll_no}</p>
                    </td>
                    <td className="py-2.5 text-slate text-sm">{g.exam_type}</td>
                    <td className="py-2.5"><Pill tone={tone}>{g.marks}/{g.max_marks}</Pill></td>
                  </tr>
                );
              })}
              {grades.length === 0 && (
                <tr><td colSpan={3} className="text-center text-slate py-8">No grades recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
