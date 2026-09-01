// src/pages/student/Courses.jsx
import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { Card, EmptyState } from "../../components/ui";
import Seal from "../../components/Seal";
import { BookOpen } from "lucide-react";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/student/courses").then(setCourses);
  }, []);

  if (courses.length === 0) {
    return <Card><EmptyState title="No courses yet" subtitle="You haven't been enrolled in any courses this term." icon={BookOpen} /></Card>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((c) => (
        <Card key={c.id} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <Seal tone="sage" size="md">{c.code.replace(/[^A-Z]/g, "").slice(0, 2)}</Seal>
            <span className="text-xs font-mono text-slate">{c.code}</span>
          </div>
          <p className="text-ink font-display text-lg mb-1">{c.name}</p>
          <p className="text-xs text-slate">{c.teacher_name || "Faculty TBA"} · {c.credits} credits</p>
        </Card>
      ))}
    </div>
  );
}
