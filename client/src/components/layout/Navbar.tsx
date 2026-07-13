import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ClayBadge } from "../ui/ClayBadge";
import { Sidebar } from "./Sidebar";

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-canvas/90 backdrop-blur-md border-b border-surfaceDeep/50 px-4 md:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden clay-btn rounded-clay-sm p-2"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          )}
          <Link to="/" className="font-display text-xl font-semibold text-primary hover:text-primary-dark transition-colors">
            SkillForge <span className="text-ember">AI</span>
          </Link>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <ClayBadge tone={user.role === "PREMIUM" ? "ember" : user.role === "ADMIN" ? "violet" : "sprout"}>
              {user.role}
            </ClayBadge>
            {user.profile && (
              <div className="clay-coin w-9 h-9 rounded-full grid place-items-center text-xs font-mono font-bold text-white" title={`${user.profile.currentStreak} day streak`}>
                {user.profile.currentStreak}
              </div>
            )}
            <span className="hidden sm:inline text-sm font-medium truncate max-w-[120px]">{user.name}</span>
            <button
              onClick={() => logout()}
              className="clay-btn rounded-full p-2.5 hover:text-ember"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="clay-btn rounded-clay-sm px-4 py-2 text-sm font-semibold">
              Log in
            </Link>
            <Link to="/register" className="clay-btn-primary rounded-clay-sm px-4 py-2 text-sm font-semibold text-[#F2ECDF]">
              Get started
            </Link>
          </div>
        )}
      </header>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
          <div className="sidebar-mobile fixed top-0 left-0 h-full w-72 bg-canvas z-50 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-surfaceDeep/50">
              <span className="font-display text-lg font-semibold text-primary">
                SkillForge <span className="text-ember">AI</span>
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="clay-btn rounded-full p-2"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-3">
              <Sidebar mobile onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
