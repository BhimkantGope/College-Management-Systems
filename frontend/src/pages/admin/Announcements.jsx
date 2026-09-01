// src/pages/admin/Announcements.jsx
import { useEffect, useState } from "react";
import { Plus, X, Megaphone } from "lucide-react";
import { api } from "../../api/client";
import { Card, Button, Input, Select, Pill, EmptyState } from "../../components/ui";

const TARGET_TONE = { all: "gold", teacher: "slate", student: "sage" };

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", content: "", targetRole: "all" });

  function load() {
    api.get("/admin/announcements").then(setItems);
  }
  useEffect(load, []);

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/admin/announcements", form);
      setShowForm(false);
      setForm({ title: "", content: "", targetRole: "all" });
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
          {showForm ? "Cancel" : "New announcement"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="font-display text-lg text-ink mb-4">Post an announcement</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <label className="block">
              <span className="block text-xs font-medium text-slate mb-1.5">Message</span>
              <textarea
                required
                rows={4}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-ink/15 bg-white text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              />
            </label>
            <Select label="Audience" value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })}>
              <option value="all">Everyone</option>
              <option value="teacher">Faculty only</option>
              <option value="student">Students only</option>
            </Select>
            {error && <p className="text-sm text-clay-dark">{error}</p>}
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>{saving ? "Posting…" : "Post announcement"}</Button>
            </div>
          </form>
        </Card>
      )}

      {items.length === 0 ? (
        <Card><EmptyState title="No announcements yet" subtitle="Post your first campus-wide notice." icon={Megaphone} /></Card>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <Card key={a.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-display text-base text-ink mb-1">{a.title}</h4>
                  <p className="text-sm text-slate leading-relaxed">{a.content}</p>
                </div>
                <Pill tone={TARGET_TONE[a.target_role]}>{a.target_role === "all" ? "Everyone" : a.target_role}</Pill>
              </div>
              <p className="text-xs text-slate-light mt-3">{new Date(a.created_at).toLocaleString()}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
