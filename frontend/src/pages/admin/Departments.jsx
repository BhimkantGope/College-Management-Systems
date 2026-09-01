// src/pages/admin/Departments.jsx
import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { api } from "../../api/client";
import { Card, Button, Input, EmptyState } from "../../components/ui";
import Seal from "../../components/Seal";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", code: "" });

  function load() {
    api.get("/admin/departments").then(setDepartments);
  }
  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/admin/departments", form);
      setShowForm(false);
      setForm({ name: "", code: "" });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button variant="gold" onClick={() => setShowForm((v) => !v)} className="flex items-center gap-2">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add department"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="font-display text-lg text-ink mb-4">New department</h3>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
            <Input label="Department name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Short code" required placeholder="e.g. CS" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
            {error && <p className="text-sm text-clay-dark sm:col-span-2">{error}</p>}
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Create department"}</Button>
            </div>
          </form>
        </Card>
      )}

      {departments.length === 0 ? (
        <Card><EmptyState title="No departments yet" subtitle="Create your first department to get started." /></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((d) => (
            <Card key={d.id} className="p-5 flex items-center gap-4">
              <Seal tone="gold" size="lg">{d.code}</Seal>
              <div>
                <p className="text-ink font-medium">{d.name}</p>
                <p className="text-xs text-slate font-mono">{d.code}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
