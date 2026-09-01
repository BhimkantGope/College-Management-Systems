// src/components/DashboardShell.jsx
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ACCENTS = {
  admin: { text: "text-gold", bg: "bg-gold", ring: "ring-gold", soft: "bg-gold/10", label: "Administrator" },
  teacher: { text: "text-gold", bg: "bg-gold", ring: "ring-gold", soft: "bg-gold/10", label: "Faculty" },
  student: { text: "text-sage", bg: "bg-sage", ring: "ring-sage", soft: "bg-sage/10", label: "Student" },
};

export default function DashboardShell({ role, nav, activeKey, onNavigate, title, subtitle, children }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const accent = ACCENTS[role];

  return (
    <div className="min-h-screen flex bg-parchment">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-30 inset-y-0 left-0 w-64 bg-ink text-parchment flex flex-col transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <svg viewBox="0 0 64 64" className="w-9 h-9">
            <circle cx="32" cy="32" r="30" fill="#1B2340" stroke="#C9A227" strokeWidth="1.5" />
            <path d="M32 16 L46 23 L32 30 L18 23 Z" fill="#C9A227" />
            <path d="M22 26 V36 Q32 42 42 36 V26" fill="none" stroke="#FAF7F0" strokeWidth="2" />
          </svg>
          <div>
            <p className="font-display text-lg leading-none">Aetheria</p>
            <p className="text-[11px] tracking-wide text-white/50 uppercase">{accent.label} Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin">
          {nav.map((item) => {
            const active = activeKey === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.key);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active ? `${accent.soft} ${accent.text} font-semibold` : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={17} strokeWidth={2} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold font-mono"
              style={{ backgroundColor: user?.avatarColor || "#C9A227", color: "#1B2340" }}
            >
              {user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-clay-light transition-colors"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 bg-ink/50 z-20 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-parchment/90 backdrop-blur border-b border-ink/10 px-5 lg:px-8 py-4 flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="min-w-0">
            <h1 className="font-display text-xl sm:text-2xl text-ink truncate">{title}</h1>
            {subtitle && <p className="text-sm text-slate mt-0.5">{subtitle}</p>}
          </div>
        </header>
        <main className="flex-1 px-5 lg:px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
