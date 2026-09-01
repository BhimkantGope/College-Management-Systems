// src/pages/student/Timetable.jsx
import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { Card, EmptyState } from "../../components/ui";
import { CalendarDays } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday" };

export default function Timetable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/student/timetable").then(setRows);
  }, []);

  if (rows.length === 0) {
    return <Card><EmptyState title="No classes scheduled" subtitle="Your timetable will appear here once you're enrolled in courses." icon={CalendarDays} /></Card>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {DAYS.map((day) => {
        const dayRows = rows.filter((r) => r.day_of_week === day);
        if (dayRows.length === 0) return null;
        return (
          <Card key={day} className="p-5">
            <h3 className="font-display text-base text-ink mb-3">{DAY_NAMES[day]}</h3>
            <div className="space-y-3">
              {dayRows.map((r) => (
                <div key={r.id} className="pl-3 border-l-2 border-sage">
                  <p className="text-sm font-medium text-ink">{r.course_name}</p>
                  <p className="text-xs text-slate font-mono">{r.start_time}–{r.end_time} · {r.room}</p>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
