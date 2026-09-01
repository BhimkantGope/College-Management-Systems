// src/pages/admin/Courses.jsx
import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { api } from "../../api/client";
import { Card, Button, Input, Select, EmptyState } from "../../components/ui";
import Seal from "../../components/Seal";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", code: "", departmentId: "", teacherId: "", credits: 3, semester: 1 });

  function load() {
    Promise.all([api.get("/admin/courses"), api.get("/admin/departments"), api.get("/admin/teachers")]).then(
      ([c, d, t]) => {
        setCourses(c);
        setDepartments(d);
        setTeachers(t);
      }
    );
  }
  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/admin/courses", form);
      setShowForm(false);
      setForm({ name: "", code: "", departmentId: "", teacherId: "", credits: 3, semester: 1 });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this course? Enrollments and grades tied to it will also be removed.")) return;
    await api.del(`/admin/courses/${id}`);
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button variant="gold" onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add course"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="font-display text-lg text-ink mb-4">New course</h3>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
            <Input label="Course name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Course code" required placeholder="e.g. CS304" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
            <Select label="Department" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
              <option value="">Select department</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
            <Select label="Faculty" value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}>
              <option value="">Unassigned</option>
              {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
            <Input label="Credits" type="number" min="1" max="6" value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })} />
            <Input label="Semester" type="number" min="1" max="8" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} />
            {error && <p className="text-sm text-clay-dark sm:col-span-2">{error}</p>}
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Create course"}</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        {courses.length === 0 ? (
          <EmptyState title="No courses yet" subtitle="Create your first course to get started." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-light border-b border-ink/10">
                  <th className="p-4 font-medium">Course</th>
                  <th className="p-4 font-medium">Department</th>
                  <th className="p-4 font-medium">Faculty</th>
                  <th className="p-4 font-medium">Credits</th>
                  <th className="p-4 font-medium">Sem</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {courses.map((c) => (
                  <tr key={c.id}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Seal tone="ink" size="sm">{c.code.replace(/[^A-Z]/g, "").slice(0, 2)}</Seal>
                        <div>
                          <p className="text-ink font-medium">{c.name}</p>
                          <p className="text-xs font-mono text-slate">{c.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate">{c.department || "—"}</td>
                    <td className="p-4 text-slate">{c.teacher_name || "Unassigned"}</td>
                    <td className="p-4 text-slate">{c.credits}</td>
                    <td className="p-4 text-slate">{c.semester}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(c.id)} className="text-slate-light hover:text-clay-dark transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
