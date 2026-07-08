import {
  LayoutDashboard,
  Code2,
  CalendarDays,
  FileText,
  Brain,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "DSA Tracker", icon: Code2 },
  { name: "Study Planner", icon: CalendarDays },
  { name: "Resume Builder", icon: FileText },
  { name: "AI Review", icon: Brain },
  { name: "Analytics", icon: BarChart3 },
  { name: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-2xl font-bold text-cyan-400">
          SkillForge AI
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Placement Preparation
        </p>
      </div>

      <nav className="space-y-2 p-4">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition-all duration-300 hover:bg-cyan-500 hover:text-white"
            >
              <Icon size={20} />

              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-6 w-64 px-4">
        <button className="flex w-full items-center gap-3 rounded-xl bg-red-500/10 px-4 py-3 text-red-400 transition hover:bg-red-500 hover:text-white">
          <LogOut size={20} />

          Logout
        </button>
      </div>
    </aside>
  );
}