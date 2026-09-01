// src/pages/admin/Teachers.jsx
import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { api } from "../../api/client";
import { Card, Button, Input, Select, EmptyState } from "../../components/ui";
import Seal from "../../components/Seal";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", departmentId: "", designation: "Assistant Professor", employeeCode: "" });

  function load() {
    Promise.all([api.get("/admin/teachers"), api.get("/admin/departments")]).then(([t, d]) => {
      setTeachers(t);
      setDepartments(d);
    });
  }
  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/admin/teachers", form);
      setShowForm(false);
      setForm({ name: "", email: "", password: "", departmentId: "", designation: "Assistant Professor", employeeCode: "" });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Remove this faculty record? This cannot be undone.")) return;
    await api.del(`/admin/teachers/${id}`);
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button variant="gold" onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add faculty"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="font-display text-lg text-ink mb-4">New faculty member</h3>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
            <Input label="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Temporary password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Input label="Employee code" value={form.employeeCode} onChange={(e) => setForm({ ...form, employeeCode: e.target.value })} />
            <Select label="Department" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
              <option value="">Select department</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
            <Select label="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })}>
              {["Assistant Professor", "Associate Professor", "Professor", "Lecturer"].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
            {error && <p className="text-sm text-clay-dark sm:col-span-2">{error}</p>}
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Create faculty account"}</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        {teachers.length === 0 ? (
          <EmptyState title="No faculty yet" subtitle="Add your first faculty member to get started." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-light border-b border-ink/10">
                  <th className="p-4 font-medium">Faculty</th>
                  <th className="p-4 font-medium">Designation</th>
                  <th className="p-4 font-medium">Department</th>
                  <th className="p-4 font-medium">Employee code</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {teachers.map((t) => (
                  <tr key={t.id}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Seal tone="gold" size="sm">{t.name.split(" ").filter(w=>w!=='Prof.'&&w!=='Dr.').map((n) => n[0]).slice(0, 2).join("")}</Seal>
                        <div>
                          <p className="text-ink font-medium">{t.name}</p>
                          <p className="text-xs text-slate">{t.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate">{t.designation}</td>
                    <td className="p-4 text-slate">{t.department || "—"}</td>
                    <td className="p-4 font-mono text-xs text-slate">{t.employee_code || "—"}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(t.id)} className="text-slate-light hover:text-clay-dark transition-colors">
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
