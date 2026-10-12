interface StatCardProps {
  label: string;
  value: number | string;
  detail: string;
  accent: string;
}

export function StatCard({ label, value, detail, accent }: StatCardProps) {
  return (
    <article className="glass-panel relative overflow-hidden rounded-3xl p-4.5">
      <div className={`glow-ring -right-10 -top-10 h-28 w-28 ${accent}`} />
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-400">
        {label}
      </p>
      <div className="mt-2.5 flex items-end justify-between gap-4">
        <strong className="text-3xl font-semibold text-white">{value}</strong>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
          live
        </span>
      </div>
      <p className="mt-2.5 max-w-sm text-sm leading-6 text-slate-300">{detail}</p>
    </article>
  );
}