import { NavLink } from "react-router-dom";

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  `block rounded-2xl border px-3.5 py-3 text-left transition ${
    isActive
      ? "border-cyan-300/40 bg-cyan-300/10 text-white shadow-[0_0_0_1px_rgba(103,232,249,0.2)]"
      : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10"
  }`;

export function DashboardSidebar() {
  return (
    <aside className="glass-panel flex h-full w-full shrink-0 flex-col rounded-[2rem] p-3.5 lg:w-72">
      <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-3.5">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Lodwar Services</p>
        <h1 className="mt-2 text-xl font-semibold text-white">Mini Ticket Tracker</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          A lean workspace for creating tickets, reading stats, and moving tickets forward.
        </p>
      </div>

      <nav className="mt-3 space-y-1.5">
        <NavLink to="/create" className={linkClassName}>
          <div className="text-sm font-semibold">Create</div>
          <p className="mt-2 text-xs leading-5 text-slate-400">Use the form to add a new ticket without leaving the workspace.</p>
        </NavLink>

        <NavLink to="/stats" className={linkClassName}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">Stats</span>
            <span className="text-xs text-slate-400">live</span>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-400">Review the live status breakdown returned by the API.</p>
        </NavLink>

        <NavLink to="/tickets" className={linkClassName}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">Tickets</span>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-400">Browse, filter, paginate, and update tickets from one place.</p>
        </NavLink>
      </nav>
    </aside>
  );
}