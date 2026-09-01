// src/pages/student/Grades.jsx
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { api } from "../../api/client";
import { Card, Pill, EmptyState } from "../../components/ui";

export default function Grades() {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    api.get("/student/grades").then(setGrades);
  }, []);

  if (grades.length === 0) {
    return <Card><EmptyState title="No grades yet" subtitle="Your scores will appear here once faculty record them." icon={GraduationCap} /></Card>;
  }

  const byCourse = grades.reduce((acc, g) => {
    (acc[g.code] ??= { name: g.course_name, code: g.code, items: [] }).items.push(g);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {Object.values(byCourse).map((course) => {
        const avg = Math.round(
          course.items.reduce((s, g) => s + (g.marks / g.max_marks) * 100, 0) / course.items.length
        );
        const tone = avg >= 75 ? "sage" : avg >= 40 ? "gold" : "clay";
        return (
          <Card key={course.code} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-display text-base text-ink">{course.name}</h4>
                <p className="text-xs font-mono text-slate">{course.code}</p>
              </div>
              <Pill tone={tone}>{avg}% average</Pill>
            </div>
            <div className="divide-y divide-ink/5">
              {course.items.map((g, i) => {
                const pct = Math.round((g.marks / g.max_marks) * 100);
                const itemTone = pct >= 75 ? "sage" : pct >= 40 ? "gold" : "clay";
                return (
                  <div key={i} className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-slate">{g.exam_type}</span>
                    <Pill tone={itemTone}>{g.marks}/{g.max_marks}</Pill>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
