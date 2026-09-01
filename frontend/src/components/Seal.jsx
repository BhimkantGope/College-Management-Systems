// src/components/Seal.jsx
// The signature element of this design: a circular "seal" badge, echoing a
// college stamp/emblem. Used wherever the app needs to mark a status —
// attendance, grade bands, initials — so the collegiate identity carries
// through the functional UI, not just the login screen.

const TONES = {
  gold: "text-gold border-gold",
  sage: "text-sage border-sage",
  clay: "text-clay border-clay",
  ink: "text-ink border-ink",
  slate: "text-slate border-slate",
};

export default function Seal({ tone = "ink", children, size = "md", className = "" }) {
  const sizes = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-14 h-14 text-base",
  };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border-[1.5px] font-semibold font-mono shrink-0 ${TONES[tone]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
