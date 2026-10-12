import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardLayout() {
  return (
    <div className="relative h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="glow-ring left-[-6rem] top-[-4rem] h-80 w-80 bg-cyan-500/25" />
      <div className="glow-ring right-[-4rem] top-[10rem] h-96 w-96 bg-orange-500/20" />
      <div className="glow-ring bottom-[-6rem] left-1/3 h-96 w-96 bg-violet-500/20" />

      <main className="flex h-full w-full gap-3 p-3 sm:p-4 lg:p-5">
        <DashboardSidebar />

        <section className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden">
          <Outlet />
        </section>
      </main>
    </div>
  );
}