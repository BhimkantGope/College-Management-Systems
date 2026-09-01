// src/pages/student/Attendance.jsx
import { useEffect, useState } from "react";
import { Check, Clock, X as XIcon, CalendarCheck } from "lucide-react";
import { api } from "../../api/client";
import { Card, Pill, EmptyState } from "../../components/ui";

const STATUS_META = {
  present: { icon: Check, tone: "sage" },
  late: { icon: Clock, tone: "gold" },
  absent: { icon: XIcon, tone: "clay" },
};

export default function Attendance() {
  const [data, setData] = useState({ records: [], summary: [] });

  useEffect(() => {
    api.get("/student/attendance").then(setData);
  }, []);

  if (data.summary.length === 0) {
    return <Card><EmptyState title="No attendance records" subtitle="Your attendance will appear here once classes begin marking it." icon={CalendarCheck} /></Card>;
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.summary.map((c) => {
          const pct = c.total ? Math.round(((c.present + c.late) / c.total) * 100) : 0;
          return (
            <Card key={c.course_id} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-ink font-medium text-sm">{c.name}</p>
                <span className={`text-lg font-display font-semibold ${pct >= 75 ? "text-sage-dark" : "text-clay-dark"}`}>{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-ink/5 overflow-hidden mb-3">
                <div className={`h-full rounded-full ${pct >= 75 ? "bg-sage" : "bg-clay"}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex gap-2 text-xs">
                <Pill tone="sage">{c.present} present</Pill>
                <Pill tone="gold">{c.late} late</Pill>
                <Pill tone="clay">{c.absent} absent</Pill>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h3 className="font-display text-lg text-ink mb-4">Recent history</h3>
        <div className="space-y-1 max-h-96 overflow-y-auto scrollbar-thin">
          {data.records.map((r, i) => {
            const meta = STATUS_META[r.status];
            const Icon = meta.icon;
            return (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-ink/5 last:border-0">
                <div>
                  <p className="text-sm text-ink font-medium">{r.course_name}</p>
                  <p className="text-xs text-slate">{new Date(r.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</p>
                </div>
                <Pill tone={meta.tone}>
                  <Icon size={12} className="mr-1 inline" /> {r.status}
                </Pill>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
