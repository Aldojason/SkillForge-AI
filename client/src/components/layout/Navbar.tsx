import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="text-2xl font-bold text-cyan-400"
        >
          SkillForge AI
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="text-slate-300 transition hover:text-cyan-400"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-white transition hover:bg-cyan-600"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;