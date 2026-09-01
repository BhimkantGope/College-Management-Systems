// src/pages/student/Announcements.jsx
import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { api } from "../../api/client";
import { Card, Pill, EmptyState } from "../../components/ui";

const TARGET_TONE = { all: "gold", teacher: "slate", student: "sage" };

export default function Announcements() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/student/announcements").then(setItems);
  }, []);

  if (items.length === 0) {
    return (
      <Card>
        <EmptyState title="No announcements yet" subtitle="Notices from the administration will show up here." icon={Megaphone} />
      </Card>
    );
  }

  return (
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
  );
}
