import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1">
        <Topbar />

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}