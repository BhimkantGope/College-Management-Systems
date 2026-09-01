// src/pages/teacher/TeacherDashboard.jsx
import { useState } from "react";
import { LayoutGrid, BookOpen, CalendarDays, Megaphone } from "lucide-react";
import DashboardShell from "../../components/DashboardShell";
import Overview from "./Overview";
import Courses from "./Courses";
import Timetable from "./Timetable";
import Announcements from "./Announcements";

const NAV = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "courses", label: "My courses", icon: BookOpen },
  { key: "timetable", label: "Timetable", icon: CalendarDays },
  { key: "announcements", label: "Announcements", icon: Megaphone },
];

const TITLES = {
  overview: ["Overview", "Your teaching load this term."],
  courses: ["My courses", "Take attendance and record grades."],
  timetable: ["Timetable", "Your weekly teaching schedule."],
  announcements: ["Announcements", "Notices from the college administration."],
};

export default function TeacherDashboard() {
  const [tab, setTab] = useState("overview");
  const [title, subtitle] = TITLES[tab];

  return (
    <DashboardShell role="teacher" nav={NAV} activeKey={tab} onNavigate={setTab} title={title} subtitle={subtitle}>
      {tab === "overview" && <Overview onNavigate={setTab} />}
      {tab === "courses" && <Courses />}
      {tab === "timetable" && <Timetable />}
      {tab === "announcements" && <Announcements />}
    </DashboardShell>
  );
}
