// src/pages/admin/Students.jsx
import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { api } from "../../api/client";
import { Card, Button, Input, Select, EmptyState } from "../../components/ui";
import Seal from "../../components/Seal";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", rollNo: "", departmentId: "", semester: 1, batchYear: new Date().getFullYear() });

  function load() {
    Promise.all([api.get("/admin/students"), api.get("/admin/departments")]).then(([s, d]) => {
      setStudents(s);
      setDepartments(d);
    });
  }

  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/admin/students", form);
      setShowForm(false);
      setForm({ name: "", email: "", password: "", rollNo: "", departmentId: "", semester: 1, batchYear: new Date().getFullYear() });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Remove this student record? This cannot be undone.")) return;
    await api.del(`/admin/students/${id}`);
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button variant="gold" onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add student"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="font-display text-lg text-ink mb-4">New student</h3>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
            <Input label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Temporary password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Input label="Roll number" required value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} />
            <Select label="Department" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
              <option value="">Select department</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
            <Input label="Semester" type="number" min="1" max="8" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} />
            {error && <p className="text-sm text-clay-dark sm:col-span-2">{error}</p>}
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Create student"}</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        {students.length === 0 ? (
          <EmptyState title="No students yet" subtitle="Add your first student to get started." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-light border-b border-ink/10">
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium">Roll No.</th>
                  <th className="p-4 font-medium">Department</th>
                  <th className="p-4 font-medium">Semester</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Seal tone="sage" size="sm">{s.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</Seal>
                        <div>
                          <p className="text-ink font-medium">{s.name}</p>
                          <p className="text-xs text-slate">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate">{s.roll_no}</td>
                    <td className="p-4 text-slate">{s.department || "—"}</td>
                    <td className="p-4 text-slate">{s.semester}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(s.id)} className="text-slate-light hover:text-clay-dark transition-colors">
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
