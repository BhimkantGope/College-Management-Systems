// src/components/ui.jsx
export function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-2xl shadow-card border border-ink/5 ${className}`}>{children}</div>;
}

export function StatCard({ label, value, icon: Icon, tone = "ink" }) {
  const toneMap = {
    ink: "text-ink bg-ink/5",
    gold: "text-gold-dark bg-gold/10",
    sage: "text-sage-dark bg-sage/10",
    clay: "text-clay-dark bg-clay/10",
  };
  return (
    <Card className="p-5 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate font-medium">{label}</p>
        <p className="text-3xl font-display font-semibold text-ink mt-1">{value}</p>
      </div>
      {Icon && (
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${toneMap[tone]}`}>
          <Icon size={20} />
        </div>
      )}
    </Card>
  );
}

export function EmptyState({ title, subtitle, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 text-slate">
      {Icon && <Icon size={32} className="mb-3 text-slate-light" />}
      <p className="font-display text-lg text-ink mb-1">{title}</p>
      {subtitle && <p className="text-sm max-w-sm">{subtitle}</p>}
    </div>
  );
}

export function Pill({ children, tone = "slate" }) {
  const toneMap = {
    sage: "bg-sage/10 text-sage-dark",
    clay: "bg-clay/10 text-clay-dark",
    gold: "bg-gold/10 text-gold-dark",
    slate: "bg-ink/5 text-slate",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${toneMap[tone]}`}>
      {children}
    </span>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-ink text-parchment hover:bg-ink-light",
    gold: "bg-gold text-ink hover:bg-gold-dark hover:text-parchment",
    sage: "bg-sage text-parchment hover:bg-sage-dark",
    ghost: "bg-transparent text-ink border border-ink/15 hover:bg-ink/5",
    danger: "bg-clay/10 text-clay-dark hover:bg-clay hover:text-parchment",
  };
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ label, className = "", ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium text-slate mb-1.5">{label}</span>}
      <input
        className={`w-full px-3 py-2 rounded-lg border border-ink/15 bg-white text-sm text-ink placeholder:text-slate-light focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors ${className}`}
        {...props}
      />
    </label>
  );
}

export function Select({ label, className = "", children, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium text-slate mb-1.5">{label}</span>}
      <select
        className={`w-full px-3 py-2 rounded-lg border border-ink/15 bg-white text-sm text-ink focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
