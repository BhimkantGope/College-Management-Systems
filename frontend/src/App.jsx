// src/App.jsx
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";

function Root() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment">
        <p className="text-slate text-sm">Loading…</p>
      </div>
    );
  }

  if (!user) return <Login />;
  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "teacher") return <TeacherDashboard />;
  if (user.role === "student") return <StudentDashboard />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment">
      <p className="text-clay-dark text-sm">Unknown role. Please contact your administrator.</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
