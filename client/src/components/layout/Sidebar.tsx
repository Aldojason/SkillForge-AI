import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  CalendarClock,
  FileText,
  Sparkles,
  BarChart3,
  User,
  Settings,
  Shield,
  Crown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ mobile = false, onNavigate }: SidebarProps) {
  const { user } = useAuth();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/dsa", label: "DSA Tracker", icon: Code2 },
    { to: "/planner", label: "Study Planner", icon: CalendarClock },
    { to: "/resume", label: "Resume Builder", icon: FileText },
    { to: "/interview", label: "Mock Interview", icon: Sparkles },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    ...(user?.role !== "PREMIUM" && user?.role !== "ADMIN"
      ? [{ to: "/premium", label: "Go Premium", icon: Crown }]
      : []),
    { to: "/profile", label: "Profile", icon: User },
    ...(user?.role === "ADMIN" ? [{ to: "/admin", label: "Admin Console", icon: Shield }] : []),
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const wrapperClass = mobile
    ? "flex flex-col gap-1.5"
    : "hidden md:flex flex-col gap-2 w-64 shrink-0 p-4";

  return (
    <aside className={wrapperClass}>
      <div className={mobile ? "flex flex-col gap-1" : "clay-raised rounded-clay p-4 flex flex-col gap-1.5"}>
        {links.map(({ to, label, icon: Icon }, idx) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-clay-sm px-3.5 py-2.5 text-sm font-medium transition-all animate-fade-in stagger-${Math.min(idx + 1, 6)} ${
                isActive
                  ? "clay-inset text-primary font-semibold"
                  : "text-ink hover:text-primary hover:bg-surfaceDeep/30"
              } ${to === "/premium" && !isActive ? "text-ember" : ""}`
            }
          >
            <Icon size={18} />
            {label}
            {to === "/premium" && (
              <span className="ml-auto text-[10px] font-mono font-bold bg-ember/15 text-ember px-1.5 py-0.5 rounded-full">
                PRO
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
