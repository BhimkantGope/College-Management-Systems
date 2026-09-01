// src/pages/admin/AdminDashboard.jsx
import { useState } from "react";
import { LayoutGrid, Users, GraduationCap, BookOpen, Building2, Megaphone } from "lucide-react";
import DashboardShell from "../../components/DashboardShell";
import Overview from "./Overview";
import Students from "./Students";
import Teachers from "./Teachers";
import Courses from "./Courses";
import Departments from "./Departments";
import Announcements from "./Announcements";

const NAV = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "students", label: "Students", icon: GraduationCap },
  { key: "teachers", label: "Faculty", icon: Users },
  { key: "courses", label: "Courses", icon: BookOpen },
  { key: "departments", label: "Departments", icon: Building2 },
  { key: "announcements", label: "Announcements", icon: Megaphone },
];

const TITLES = {
  overview: ["Overview", "A snapshot of the whole campus, at a glance."],
  students: ["Students", "Manage student records and enrollment."],
  teachers: ["Faculty", "Manage faculty profiles and department assignments."],
  courses: ["Courses", "Create courses and assign faculty to teach them."],
  departments: ["Departments", "Organize the college into academic departments."],
  announcements: ["Announcements", "Broadcast notices to faculty and students."],
};

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [title, subtitle] = TITLES[tab];

  return (
    <DashboardShell role="admin" nav={NAV} activeKey={tab} onNavigate={setTab} title={title} subtitle={subtitle}>
      {tab === "overview" && <Overview />}
      {tab === "students" && <Students />}
      {tab === "teachers" && <Teachers />}
      {tab === "courses" && <Courses />}
      {tab === "departments" && <Departments />}
      {tab === "announcements" && <Announcements />}
    </DashboardShell>
  );
}
