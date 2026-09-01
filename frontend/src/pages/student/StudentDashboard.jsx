// src/pages/student/StudentDashboard.jsx
import { useState } from "react";
import { LayoutGrid, BookOpen, CalendarCheck, GraduationCap, CalendarDays, Megaphone } from "lucide-react";
import DashboardShell from "../../components/DashboardShell";
import Overview from "./Overview";
import Courses from "./Courses";
import Attendance from "./Attendance";
import Grades from "./Grades";
import Timetable from "./Timetable";
import Announcements from "./Announcements";

const NAV = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "courses", label: "My courses", icon: BookOpen },
  { key: "attendance", label: "Attendance", icon: CalendarCheck },
  { key: "grades", label: "Grades", icon: GraduationCap },
  { key: "timetable", label: "Timetable", icon: CalendarDays },
  { key: "announcements", label: "Announcements", icon: Megaphone },
];

const TITLES = {
  overview: ["Overview", "Your academic snapshot this term."],
  courses: ["My courses", "Courses you're enrolled in this semester."],
  attendance: ["Attendance", "Your attendance record, course by course."],
  grades: ["Grades", "Your recorded scores across every assessment."],
  timetable: ["Timetable", "Your weekly class schedule."],
  announcements: ["Announcements", "Notices from the college administration."],
};

export default function StudentDashboard() {
  const [tab, setTab] = useState("overview");
  const [title, subtitle] = TITLES[tab];

  return (
    <DashboardShell role="student" nav={NAV} activeKey={tab} onNavigate={setTab} title={title} subtitle={subtitle}>
      {tab === "overview" && <Overview onNavigate={setTab} />}
      {tab === "courses" && <Courses />}
      {tab === "attendance" && <Attendance />}
      {tab === "grades" && <Grades />}
      {tab === "timetable" && <Timetable />}
      {tab === "announcements" && <Announcements />}
    </DashboardShell>
  );
}
